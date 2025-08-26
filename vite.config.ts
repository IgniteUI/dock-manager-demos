import { defineConfig } from 'vite';
import type { ProxyOptions } from 'vite';
import { projects } from './src/project-config.ts';

import fs from 'node:fs';
import path from 'node:path';

const BASE_PORT = 3001;
const PORTS_FILE = path.resolve(process.cwd(), 'projects.ports.json');
const ENV_MAP_VAR = 'PROJECTS_PORT_MAP';

// Parse JSON safely (env/file), return undefined on failure.
function safeParseJSON<T>(value?: string): T | undefined {
    if (!value) return undefined;
    try {
        const parsed = JSON.parse(value);
        return (parsed && typeof parsed === 'object') ? parsed as T : undefined;
    } catch {
        return undefined;
    }
}

// Read ports map from env (preferred) or file fallback.
function readPortsMap(): Record<string, number> {
    const fromEnv = safeParseJSON<Record<string, number>>(process.env[ENV_MAP_VAR]);
    if (fromEnv) return fromEnv;

    if (fs.existsSync(PORTS_FILE)) {
        const fileContent = fs.readFileSync(PORTS_FILE, 'utf-8');
        const fromFile = safeParseJSON<Record<string, number>>(fileContent);
        if (fromFile) return fromFile;
    }
    return {};
}

// Compute alphabetical index-based fallback (aligns with typical project runner behavior)
function alphabeticalIndexFallback(id: string): number {
    const sortedIds = [...projects.map(p => p.id)].sort((a, b) => a.localeCompare(b));
    const idx = Math.max(0, sortedIds.indexOf(id));
    return BASE_PORT + idx;
}

// Compute port for a project: explicit map -> env override -> alphabetical fallback.
function resolveProjectPort(id: string, portsMap: Record<string, number>): number {
    const fromMap = portsMap[id];

    const envKey = `PORT_${id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
    const envPortRaw = process.env[envKey];
    const envPortParsed = envPortRaw ? parseInt(envPortRaw, 10) : NaN;
    const fromEnv = Number.isFinite(envPortParsed) ? envPortParsed : undefined;

    const fallback = alphabeticalIndexFallback(id);

    return (fromMap ?? fromEnv) ?? fallback;
}

function buildProxyEntry(routeWithSlash: string, port: number): ProxyOptions {
    return {
        target: `http://localhost:${port}`,
        changeOrigin: true,
        // No rewrite – child apps expect the full base prefix
        configure: (proxy) => {
            proxy.on('error', (err: Error) => {
                console.error(`❌ Proxy error for ${routeWithSlash}:`, err.message);
            });
            proxy.on('proxyReq', (_proxyReq: any, req: any) => {
                console.log(`🔄 Proxying ${routeWithSlash}:`, req.url);
            });
        }
    };
}

function buildProjectsProxy(): Record<string, ProxyOptions> {
    const portsMap = readPortsMap();

    const proxy = projects.reduce<Record<string, ProxyOptions>>((acc, p) => {
        const route = `/projects/${p.id}`;
        const routeWithSlash = `${route}/`; // IMPORTANT: only proxy the trailing-slash path
        const port = resolveProjectPort(p.id, portsMap);
        acc[routeWithSlash] = buildProxyEntry(routeWithSlash, port);
        return acc;
    }, {});

    console.log('🔧 Projects proxy map:');
    for (const [route, cfg] of Object.entries(proxy)) {
        console.log(`  ${route} -> ${cfg.target}`);
    }
    return proxy;
}

export default defineConfig({
    base: './',
    server: {
        port: parseInt(process.env.VITE_PORT || process.env.PORT || '5173', 10),
        host: true,
        strictPort: true,
        watch: { usePolling: true },
        cors: true,
        proxy: buildProjectsProxy()
    }
});
