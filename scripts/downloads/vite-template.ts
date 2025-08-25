import { SASS_INCLUDE_PATHS, STANDALONE_PORT } from './shared.ts';

/**
 * Emits a standalone Vite config for the packaged demo.
 */
export function createStandaloneViteConfig(): string {
    return `import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            'igniteui-theming': new URL('./node_modules/igniteui-theming', import.meta.url).pathname,
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: ${JSON.stringify(SASS_INCLUDE_PATHS)}
            }
        }
    },
    server: {
        port: ${STANDALONE_PORT},
        host: true,
        watch: {
            usePolling: true
        }
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
`;
}
