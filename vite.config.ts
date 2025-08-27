import { defineConfig } from 'vite';
import type { ProxyOptions } from 'vite';
import { projects } from './src/project-config.ts';

import fs from 'node:fs';
import path from 'node:path';

const BASE_PORT = 3001;
const PORTS_FILE = path.resolve(process.cwd(), 'projects.ports.json');
const ENV_MAP_VAR = 'PROJECTS_PORT_MAP';
const LOG_PREFIX = '[main]';
const isVerbose = process.env.VERBOSE === '1' || process.env.DEBUG_PROXY === '1';

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
    if (fromEnv) {
        console.log(`${LOG_PREFIX} Using projects port map from env ${ENV_MAP_VAR}`);
        return fromEnv;
    }

    if (fs.existsSync(PORTS_FILE)) {
        const fileContent = fs.readFileSync(PORTS_FILE, 'utf-8');
        const fromFile = safeParseJSON<Record<string, number>>(fileContent);
        if (fromFile) {
            console.log(`${LOG_PREFIX} Using projects port map from ${PORTS_FILE}`);
            return fromFile;
        }
    }
    console.log(`${LOG_PREFIX} No explicit projects port map found (env/file). Using fallback allocation.`);
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
                console.error(`${LOG_PREFIX} Proxy error for ${routeWithSlash}: ${err.message}`);
            });
            if (isVerbose) {
                proxy.on('proxyReq', (_proxyReq: any, req: any) => {
                    console.log(`${LOG_PREFIX} Proxy ${routeWithSlash}${req.url}`);
                });
            }
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

    // Structured summary
    console.log(`${LOG_PREFIX} Projects proxy map:`);
    for (const p of projects) {
        const route = `/projects/${p.id}/`;
        const envKey = `PORT_${p.id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
        const hasMap = Object.prototype.hasOwnProperty.call(readPortsMap(), p.id);
        const hasEnv = !!process.env[envKey];
        const source = hasMap ? 'map' : (hasEnv ? 'env' : 'fallback');
        const port = resolveProjectPort(p.id, portsMap);
        console.log(`${LOG_PREFIX}   ${route} -> http://localhost:${port} (source: ${source})`);
    }
    return proxy;
}

export default defineConfig({
    base: './',
    server: {
        port: parseInt(process.env.VITE_PORT || process.env.PORT || '3000', 10),
        host: true,
        strictPort: Boolean(process.env.VITE_PORT || process.env.PORT),
        watch: { usePolling: true },
        cors: true,
        proxy: buildProjectsProxy()
    }
});
