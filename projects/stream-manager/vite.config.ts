import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'igniteui-theming': new URL('./node_modules/igniteui-theming', import.meta.url).pathname,
		},
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				includePaths: ['node_modules']
			}
		}
	},
	server: {
		watch: {
			// Force the watcher to also detect changes in the node_modules
			usePolling: true
		}
	},
});
