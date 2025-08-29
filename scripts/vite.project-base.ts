import { defineConfig, mergeConfig, type UserConfig } from 'vite';

function getEnvPort(): number | undefined {
    const p = process.env.PORT || process.env.VITE_PORT;
    return p ? Number.parseInt(p, 10) : undefined;
}

function normalizeBase(input: string): string {
    // Ensure a leading slash and single trailing slash
    let b = input.trim();
    if (!b.startsWith('/')) b = '/' + b;
    if (!b.endsWith('/')) b = b + '/';
    return b;
}

/**
 * Minimal shared Vite config for child projects:
 * - base: BASE_PATH or VITE_BASE_PATH env (defaults to '/')
 * - server.port: PORT/VITE_PORT env (defaults to 0 for auto-pick)
 * - server.strictPort: true only when a concrete port is chosen
 */
export function createBaseViteConfig(extra?: UserConfig) {
    const envPort = getEnvPort();
    const baseEnv = process.env.BASE_PATH || process.env.VITE_BASE_PATH;
    const basePath = baseEnv ? normalizeBase(baseEnv) : '/';

    const chosenPort = envPort ?? 0;       // 0 => auto-pick a free port
    const strict = Number.isFinite(chosenPort) && chosenPort !== 0;

    const usePolling = process.env.CHOKIDAR_USEPOLLING === 'true';

    const baseCfg: UserConfig = defineConfig({
        base: basePath,
        server: {
            port: chosenPort,
            strictPort: strict,
            host: true,
            watch: { usePolling },
            cors: true
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true,
                }
            }
        }
    });

    return extra ? mergeConfig(baseCfg, extra) : baseCfg;
}
