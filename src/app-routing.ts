import { Route } from '@vaadin/router';
import './views/projects-view/projects-view.ts';
import { projects } from './project-config.ts';

export const routes: Route[] = [
	{
		path: '/',
        redirect: projects.length > 0 ? `/demos/${projects[0].id}` : '/404'
	},
	{
        path: '/demos/:projectName',
        component: 'projects-view'
	},
	{
		path: '(.*)',
		redirect: '/'
	},
];
