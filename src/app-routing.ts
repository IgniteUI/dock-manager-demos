import type { Route } from '@vaadin/router';
import { projects } from './project-config';

// Pick Stream Manager if present; otherwise the first project.
const defaultRoute = (projects.find(p => p.id === 'stream-manager') || projects[0])?.route || '/projects/stream-manager';

export const routes: Route[] = [
    // Redirect roots to the default project
    { path: '/', redirect: defaultRoute },
    { path: '/projects', redirect: defaultRoute },

    // Projects view (expects :projectName)
    { path: '/projects/:projectName', component: 'projects-view' },

    // Catch-all → default
    { path: '(.*)', redirect: defaultRoute }
];
