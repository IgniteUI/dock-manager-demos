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
		route: '/stream-manager-view',
	},
];
