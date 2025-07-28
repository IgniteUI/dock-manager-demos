import { Route } from '@vaadin/router';
import './views/stream-manager/stream-manager-view.ts';

export const routes: Route[] = [
	{
		path: '/',
		redirect: '/stream-manager-view'
	},
	{
		path: '/stream-manager-view',
		component: 'stream-manager-view'
	},
	{
		path: '(.*)',
		redirect: '/stream-manager-view'
	},
];
