export interface InavbarAction {
	label: string;
	name: string;
	collection?: string;
}

export const navbarActions: InavbarAction[] = [
	{
		label: 'Comments',
		name: 'comments',
		collection: 'material',
	},
	{
		label: 'languages',
		name: 'languages',
		collection: 'material',
	},
	{
		label: 'Info',
		name: 'info',
		collection: 'material',
	},
	{
		label: 'Inbox',
		name: 'inbox',
		collection: 'material',
	},
];
