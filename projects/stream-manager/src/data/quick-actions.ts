export interface QuickAction {
	label?: string;
	icon?: string;
	actionKey: string;
	toggle?: boolean;
}

export const quickActions: QuickAction[] = [
	{
		label: 'Edit Stream Info',
		actionKey: 'edit-stream',
		icon: 'edit',
	},
	{
		label: 'Manage Goals',
		actionKey: 'manage-goals',
		icon: 'goals',
	},
	{
		label: 'Clip That',
		actionKey: 'clip-that',
		icon: 'clip',
		toggle: true,
	},
	{
		label: 'Raid Channel',
		actionKey: 'raid-channel',
		icon: 'raid',
		toggle: true,
	},
	{
		label: 'Stream Together',
		actionKey: 'stream-together',
		icon: 'stream-together',
	},
	{
		actionKey: 'custom-action',
		icon: 'add-new',
	},
];
