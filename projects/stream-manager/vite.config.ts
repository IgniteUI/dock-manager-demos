import { createBaseViteConfig } from '../../scripts/vite.project-base';

export default createBaseViteConfig(
    {
        resolve: {
            alias: {
                // Use a relative path to main node_modules
                // @ts-ignore
                'igniteui-theming': new URL('../../node_modules/igniteui-theming', import.meta.url).pathname,
            },
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
    }
);
