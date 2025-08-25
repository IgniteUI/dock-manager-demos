import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            // Use a relative path to main node_modules
            // @ts-ignore
            'igniteui-theming': new URL('../../node_modules/igniteui-theming', import.meta.url).pathname,
        },
    },
    server: {
        port: parseInt(process.env.VITE_PORT || process.env.PORT || '3001'),
        host: true,
        strictPort: true,
        watch: {
            usePolling: true
        },
        // Important: Configure CORS for iframe embedding
        cors: true
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
