import { registerIconFromText } from 'igniteui-webcomponents';
import {
	ALERTS, ANALYTICS, BACK, COMMUNITY, FORWARD,
	HOME, REWARDS, SETTINGS, SCHEDULE, STREAM,
	TOOLS, SMANAGER, SEARCH, COMMENTS, LANGUAGES,
	INBOX, INFO, USER, MORE, EDIT, CLIP, GOALS, RAID, STREAM_TOGETHER, ADD_NEW,
	CROWN, MUSIC_NOTE, TAG_FACE,
	VERIFIED, LOGO_TIKTOK, LOGO_INSTAGRAM, LOGO_YOUTUBE, LOGO_VIMEO,
	HEART, MONETIZATION, STAR, ETHERIUM, DIAMOND,


} from '../assets/icons/icons.ts';

/**
 * Registers application icons
 */
export function registerAppIcons(): void {
	// Nav toggle icons
	registerIconFromText('back', BACK, 'material');
	registerIconFromText('forward', FORWARD, 'material');

	// Main navigation icons
	registerIconFromText('home', HOME, 'material');
	registerIconFromText('stream', STREAM, 'material');
	registerIconFromText('alerts', ALERTS, 'material');
	registerIconFromText('tools', TOOLS, 'material');
	registerIconFromText('rewards', REWARDS, 'material');
	registerIconFromText('schedule', SCHEDULE, 'material');
	registerIconFromText('analytics', ANALYTICS, 'material');
	registerIconFromText('community', COMMUNITY, 'material');
	registerIconFromText('settings', SETTINGS, 'material');

	// Header icons
	registerIconFromText('search', SEARCH, 'material');
	registerIconFromText('comments', COMMENTS, 'material');
	registerIconFromText('languages', LANGUAGES, 'material');
	registerIconFromText('info', INFO, 'material');
	registerIconFromText('inbox', INBOX, 'material');
	registerIconFromText('user', USER, 'material');

	// 	Logo icons
	registerIconFromText('smanager', SMANAGER, 'material');

	// 	Activity feed
	registerIconFromText('more', MORE, 'material');
	registerIconFromText('heart', HEART, 'material');
	registerIconFromText('monetization', MONETIZATION, 'material');
	registerIconFromText('star', STAR, 'material');
	registerIconFromText('etherium', ETHERIUM, 'material');
	registerIconFromText('diamond', DIAMOND, 'material');

	// Quick actions
	registerIconFromText('edit', EDIT, 'material');
	registerIconFromText('clip', CLIP, 'material');
	registerIconFromText('goals', GOALS, 'material');
	registerIconFromText('raid', RAID, 'material');
	registerIconFromText('stream-together', STREAM_TOGETHER, 'material');
	registerIconFromText('add-new', ADD_NEW, 'material');

	// Stream chat
	registerIconFromText('crown', CROWN, 'material');
	registerIconFromText('music-note', MUSIC_NOTE, 'material');
	registerIconFromText('tag-face', TAG_FACE, 'material');

	// Stream preview
	registerIconFromText('verified', VERIFIED, 'material');
	registerIconFromText('logo-tiktok', LOGO_TIKTOK, 'material');
	registerIconFromText('logo-instagram', LOGO_INSTAGRAM, 'material');
	registerIconFromText('logo-youtube', LOGO_YOUTUBE, 'material');
	registerIconFromText('logo-vimeo', LOGO_VIMEO, 'material');

}
