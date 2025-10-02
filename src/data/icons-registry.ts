import { registerIconFromText } from 'igniteui-webcomponents';
import {
	CLOSE,
	HAMBURGER_MENU,
	HOME,
	LOGO_STREAM_MANAGER,
    FALLBACK_PROJECT_ICON
} from '../assets/icons/icons.ts';

/**
 * Registers application icons
 */
export function registerAppIcons(): void {
	registerIconFromText('smanager', LOGO_STREAM_MANAGER, 'material');
	registerIconFromText('hamburger_menu', HAMBURGER_MENU, 'material');
	registerIconFromText('close', CLOSE, 'material');
	registerIconFromText('home', HOME, 'material');
	registerIconFromText('project_fallback', FALLBACK_PROJECT_ICON, 'material');
}
