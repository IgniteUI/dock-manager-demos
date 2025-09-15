export type ActivityType = 'follow' | 'tipped' | 'subscribed' | 'contributed' | 'cheered';

export interface IActivityFeedItem {
	id: string;
	username: string;
	type: ActivityType;
	message: string;
	icon: string;
	timeAgo: string;
}

export const activityFeed: IActivityFeedItem[] = [
	{
		id: 'follow',
		username: 'KappaCares',
		type: 'follow',
		icon: 'heart',
		message: 'Followed',
		timeAgo: '1 min ago',
	},
	{
		id: 'tipped',
		username: 'PunchyBowl',
		type: 'tipped',
		icon: 'monetization',
		message: 'Tipped $100',
		timeAgo: '1 min ago',
	},
	{
		id: 'subscribed',
		username: 'LazyFace',
		type: 'subscribed',
		icon: 'star',
		message: 'Subscribed to your channel',
		timeAgo: '2 minute ago',
	},
	{
		id: 'contributed',
		username: 'The Crowd',
		type: 'contributed',
		icon: 'etherium',
		message: 'Contributed 10% of the pool',
		timeAgo: '2 min ago',
	},
	{
		id: 'cheered',
		username: 'SoulfulVibes',
		type: 'cheered',
		icon: 'diamond',
		message: 'Cheered 100 Bits',
		timeAgo: '3 minute ago',
	},
];
