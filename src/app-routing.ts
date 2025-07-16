import { Route } from '@vaadin/router';

export const routes: Route[] = [
	{ path: '', redirect: 'home' },
	{
		path: 'home',
		component: 'home-view',
		children: [
			{ path: '', redirect: 'home/stream-manager' },
			{ path: 'stream-manager', component: 'stream-manager' },
		],
	},

	// Fallback route
	{ path: '(.*)', redirect: 'home' },
];

