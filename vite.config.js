import {defineConfig} from 'vite';
import {viteStaticCopy} from 'vite-plugin-static-copy';

export default defineConfig({
    base: '/showcase/',
    resolve: {
        alias: {
            'igniteui-theming': new URL('./node_modules/igniteui-theming',
                import.meta.url).pathname,
        },
    },
    server: {
        watch: {
            // Force the watcher to also detect changes in the node_modules
            usePolling: true
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: './web.config',
                    dest: '',
                },
                {
                    src: './projects/stream-manager/public/*',
                    dest: '',
                }
            ],
        }),
    ],
});
