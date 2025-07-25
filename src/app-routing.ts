import { Route } from '@vaadin/router';

export const routes: Route[] = [
	{
		path: '',
		component: 'stream-manager'
	},
	{
		path: '(.*)',
		redirect: 'stream-manager'
	},
];

