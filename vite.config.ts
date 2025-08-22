import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import type { ProxyOptions } from 'vite';

interface ProjectPortMap {
    [projectName: string]: number;
}

// Auto-discover projects and create port mapping
function createProjectPortMap(): ProjectPortMap {
    const projects = readdirSync('projects', { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

    const BASE_PORT = 3001;
    return projects.reduce((map: ProjectPortMap, project, index) => {
        map[project] = BASE_PORT + index;
        return map;
    }, {});
}

const PROJECT_PORTS = createProjectPortMap();
console.log('🔗 Main app proxy configuration:', PROJECT_PORTS);

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            'igniteui-theming': new URL('./node_modules/igniteui-theming', import.meta.url).pathname,
        },
    },
    server: {
        port: 5173, // Main app port
        watch: {
            usePolling: true
        },
        proxy: createProjectProxies(PROJECT_PORTS)
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js'
            }
        }
    }
});

function createProjectProxies(portMap: ProjectPortMap): Record<string, ProxyOptions> {
    const proxies: Record<string, ProxyOptions> = {};

    Object.entries(portMap).forEach(([project, port]) => {
        proxies[`/projects/${project}`] = {
            target: `http://localhost:${port}`,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(`/projects/${project}`, ''),
            configure: (proxy) => {
                proxy.on('error', (err: Error) => {
                    console.error(`❌ Proxy error for ${project}:`, err.message);
                });
                proxy.on('proxyReq', (_proxyReq, req) => {
                    console.log(`🔄 Proxying ${project}:`, req.url);
                });
            }
        };
    });

    console.log('📍 Configured proxies:', Object.keys(proxies));
    return proxies;
}
