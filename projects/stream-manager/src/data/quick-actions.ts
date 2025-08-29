export interface IQuickAction {
	label?: string;
	icon?: string;
	actionKey: string;
	toggle?: boolean;
    visibility?: boolean;
    category?: [string];
}

export const quickActions: IQuickAction[] = [
	{
		label: 'Edit Stream Info',
		actionKey: 'edit-stream',
		icon: 'edit',
        visibility: true,
        category: ['stream']
	},
	{
		label: 'Manage Goals',
		actionKey: 'manage-goals',
		icon: 'goals',
        visibility: true,
        category: ['Community']
	},
	{
		label: 'Clip That',
		actionKey: 'clip-that',
		icon: 'clip',
		toggle: true,
        visibility: true,
        category: ['stream']
	},
	{
		label: 'Raid Channel',
		actionKey: 'raid-channel',
		icon: 'raid',
		toggle: true,
        visibility: true,
        category: ['Community']
	},
	{
		label: 'Stream Together',
		actionKey: 'stream-together',
		icon: 'stream-together',
        visibility: true,
        category: ['Community']
	},
	{
		actionKey: 'custom-action',
		icon: 'add-new',
	},
];
