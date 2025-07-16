export interface SocialMediaPlatform {
	url: string;
	icon: string;
	accountName: string;
}

export interface StreamPreviewData {
	streamTitle: string;
	streamerName: string;
	description: string;
	isLive: boolean;
	genres: string[];
	socialMedia: SocialMediaPlatform[];
	followers: string;
	thumbnailUrl: string;
}

export const mockStreamPreview: StreamPreviewData = {
	streamTitle: 'FOXYONAIR',
	streamerName: 'foxyonairtv',
	description: '24Hours blues + singing',
	isLive: true,
	genres: ['Guitar', 'Singing', 'Looping', 'Blues'],
	socialMedia: [
		{
			url: '#',
			icon: 'logo-tiktok',
			accountName: '@foxyonair',
		},
		{
			url: '#',
			icon: 'logo-instagram',
			accountName: '@solofoxy',
		},
		{
			url: '#',
			icon: 'logo-youtube',
			accountName: '/FOXY',
		},
		{
			url: '#',
			icon: 'logo-vimeo',
			accountName: 'Vimeo',
		},
	],
	followers: '6.5k',
	thumbnailUrl: 'fox-guitar.mp4',
};
