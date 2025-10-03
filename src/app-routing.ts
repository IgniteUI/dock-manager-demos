import type { Route } from '@vaadin/router';
import { projects } from './project-config';

// Pick Stream Manager if present; otherwise the first project.
const defaultProjectId = (projects.find(p => p.id === 'stream-manager') || projects[0])?.id ?? 'stream-manager';
const defaultProjectPath = `/projects/${defaultProjectId}`;

export const routes: Route[] = [
    // Root → absolute default
    { path: '/', redirect: defaultProjectPath },

    // Parent segment → relative child redirect (avoids /projects/projects/…)
    { path: '/projects', redirect: defaultProjectId },

    // Project view
    { path: '/projects/:projectName', component: 'projects-view' },

    // Catch-all → absolute default
    { path: '(.*)', redirect: defaultProjectPath },
];
