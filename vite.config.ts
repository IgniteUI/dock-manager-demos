import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    resolve: {
        alias: { 'igniteui-theming': new URL('./node_modules/igniteui-theming', import.meta.url).pathname },
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true
            }
        }
    },
    server: {
        host: true,
        watch: { usePolling: true },
        cors: true,
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            external: ['dompurify', 'marked', 'shiki', 'marked-shiki'],
        },
    },
});
