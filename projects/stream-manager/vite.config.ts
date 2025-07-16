import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'igniteui-theming': new URL('./node_modules/igniteui-theming', import.meta.url).pathname,
		},
	},
	css: {
		// You can specify where compiled CSS files should go
		// if you want them in a specific directory
		devSourcemap: true, // Enable source maps for debugging
	},
});
