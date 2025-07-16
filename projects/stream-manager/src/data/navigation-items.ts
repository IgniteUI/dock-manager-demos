export interface INavItem {
	label: string;
	icon: string;
	collection?: string;
	route?: string;
}

export const navigationItems: INavItem[] = [
	{
		label: 'Home',
		icon: 'home',
		collection: 'material',
		route: '/home',
	},
	{
		label: 'Stream',
		icon: 'stream',
		collection: 'material',
		route: '/stream',

	},
	{
		label: 'Alerts',
		icon: 'alerts',
		collection: 'material',
		route: '/alerts',
	},
	{
		label: 'Tools',
		icon: 'tools',
		collection: 'material',
		route: '/tools',
	},
	{
		label: 'Rewards',
		icon: 'rewards',
		collection: 'material',
		route: '/rewards',
	},
	{
		label: 'Schedule',
		icon: 'schedule',
		collection: 'material',
		route: '/schedule',
	},
	{
		label: 'Analytics',
		icon: 'analytics',
		collection: 'material',
		route: '/analytics',
	},
	{
		label: 'Community',
		icon: 'community',
		collection: 'material',
		route: '/community',
	},
	{
		label: 'Settings',
		icon: 'settings',
		collection: 'material',
		route: '/settings',
	},
];
