import { LOGO_STREAM_MANAGER } from './assets/icons/icons.ts';

export interface ProjectConfig {
	id: string;
	name: string;
    /**
     * Icon can be:
     * - a registry icon name (e.g., 'smanager'), or
     * - a raw SVG string (e.g., LOGO_STREAM_MANAGER)
     */
	icon?: string;
	description?: string;
}

export const projects: ProjectConfig[] = [
	{
		id: 'stream-manager',
		name: 'Stream Manager',
        icon: LOGO_STREAM_MANAGER,
		description: 'Stream Manager demo'
	},
    {
        id: 'demo',
        name: 'Demo',
        description: 'Minimal demo project'
    }
];
