export interface InavbarAction {
	label: string;
	name: string;
	collection?: string;
    badge?: boolean;
    badgeCount?: number;
    isActive?: boolean;
    route?: string;
    isMobile?: boolean;
}

export const navbarActions: InavbarAction[] = [
	{
		label: 'Comments',
		name: 'comments',
		collection: 'material',
        route: './comments'
	},
	{
		label: 'languages',
		name: 'languages',
		collection: 'material',
        isMobile: false,
	},
	{
		label: 'Info',
		name: 'info',
		collection: 'material',
        route: './comments',
        isMobile: false,
	},
	{
		label: 'Inbox',
		name: 'inbox',
		collection: 'material',
        badge: true,
        badgeCount: 2,
        route: './comments'
	},
    {
        label: 'More',
        name: 'more',
        collection: 'material',
        isMobile: true,
    },
];
