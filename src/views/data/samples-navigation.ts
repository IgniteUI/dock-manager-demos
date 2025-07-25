export interface IsampleItem {
	label: string;
	icon: string;
	collection?: string;
	route?: string;
}

export const sampleItems: IsampleItem[] = [
	{
		label: 'Stream Manager',
		icon: 'stream',
		collection: 'material',
		route: '/home/stream-manager',
	},
	{
		label: 'Home',
		icon: 'home',
		collection: 'material',
		route: '/home',
	},
	{
		label: 'Alerts',
		icon: 'alerts',
		collection: 'material',
		route: '/alerts',
	},
];
