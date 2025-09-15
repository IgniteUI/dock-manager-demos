import { projects } from '../project-config.ts';

export interface IsampleItem {
	label: string;
	icon: string;
	collection?: string;
	route: string;
}

// Generate navigation from the project registry
export const sampleItems: IsampleItem[] = projects.map(project => ({
	label: project.name,
	icon: project.icon,
	collection: 'material',
	route: project.route
}));

