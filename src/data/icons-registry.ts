import { registerIconFromText } from 'igniteui-webcomponents';
import {
	CLOSE,
	DOWNLOAD,
	HAMBURGER_MENU,
	HOME,
	LOGO_STREAM_MANAGER,
} from '../assets/icons/icons.ts';

/**
 * Registers application icons
 */
export function registerAppIcons(): void {
	registerIconFromText('smanager', LOGO_STREAM_MANAGER, 'material');
	registerIconFromText('download', DOWNLOAD, 'material');
	registerIconFromText('hamburger_menu', HAMBURGER_MENU, 'material');
	registerIconFromText('close', CLOSE, 'material');
	registerIconFromText('home', HOME, 'material');
}
