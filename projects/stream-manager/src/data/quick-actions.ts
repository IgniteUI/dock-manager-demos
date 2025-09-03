export type ActionCategory = 'stream' | 'Community' | 'chat' | 'safety';

export interface IQuickAction {
	label?: string;
	icon?: string;
	actionKey: string;
	toggle?: boolean;
    visibility: boolean;
    description?: string;
    category: ActionCategory;
    added: boolean
}

export const quickActions: IQuickAction[] = [
	{
		label: 'Edit Stream Info',
		actionKey: 'edit-stream',
		icon: 'edit',
        visibility: true,
        category: 'stream',
        description: 'Edit your stream title, description, and thumbnail.',
        added: true
	},
	{
		label: 'Manage Goals',
		actionKey: 'manage-goals',
		icon: 'goals',
        visibility: true,
        category: 'Community',
        description: 'Set and track your channel goals.',
        added: true
	},
	{
		label: 'Clip That',
		actionKey: 'clip-that',
		icon: 'clip',
		toggle: true,
        visibility: true,
        category: 'stream',
        description: 'Automatically clip your stream when you are live.',
        added: true
	},
	{
		label: 'Raid Channel',
		actionKey: 'raid-channel',
		icon: 'raid',
		toggle: true,
        visibility: true,
        category: 'Community',
        description: 'Automatically raid your channel when you are live.',
        added: true
	},
	{
		label: 'Stream Together',
		actionKey: 'stream-together',
		icon: 'stream-together',
        visibility: true,
        category: 'Community',
        description: 'Stream with your friends in real-time.',
        added: true
	},
    {
		label: 'Clear Chat History',
		actionKey: 'chat-history',
		icon: 'comments',
        visibility: true,
        category: 'chat',
        description: 'Clear all chat messages from your channel.',
        added: false
	},
    {
		label: 'Toggle Emote-Only Chat',
		actionKey: 'emote-only',
		icon: 'comments',
        visibility: true,
        category: 'chat',
        description: 'Toggle emote-only mode in your channel.',
        added: false
	},
    {
		label: 'Toggle Follower-Only Chat',
		actionKey: 'follower-only',
		icon: 'comments',
        visibility: true,
        category: 'chat',
        description: 'Toggle follower-only mode in your channel.',
        added: false
	},
    {
		label: 'Shield Mode',
		actionKey: 'shield-mode',
		icon: 'security',
        visibility: true,
        category: 'safety',
        description: 'Enable shield mode to protect your channel.',
        added: false
	},
];

export interface IActionCategory {
    icon: string;
    label: string;
    description: string;
}

export const actionsCategory: Record<ActionCategory, IActionCategory> = {
    stream: {
        icon: 'stream',
        label: 'Stream',
        description: 'Settings and tools related to your live stream.',
    },
    Community: {
        icon: 'community',
        label: 'Community',
        description: 'Grow and engage with your community.',
    },
    chat: {
        icon: 'comments',
        label: 'Chat',
        description: 'Moderate and enhance your chat experience.',
    },
    safety: {
        icon: 'security',
        label: 'Safety',
        description: 'Protect your channel and manage safety settings.',
    },
};
