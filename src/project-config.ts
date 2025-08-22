export interface ProjectConfig {
	id: string;
	name: string;
	icon: string;
	component: string;
	route: string;
	description?: string;
}

export const projects: ProjectConfig[] = [
	{
		id: 'stream-manager',
		name: 'Stream Manager',
		icon: 'stream',
		component: 'stream-manager',
		route: '/projects/stream-manager',
		description: 'Stream Manager demo'
	}
];
