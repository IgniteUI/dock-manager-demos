import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import './components/navigation-drawer/navigation-drawer.ts';
import './components/dock-manager/dock-manager.ts';
import './components/header/header.ts';
import { registerAppIcons } from './data/icons-registry.ts';
import styles from './stream-manager.scss?inline';

@customElement('app-stream-manager')
export default class StreamManager extends LitElement {
	constructor() {
		super();
		registerAppIcons();
	}

	render() {
		return html`
            <app-header></app-header>

            <main class="sm-main">
                <app-navigation-drawer></app-navigation-drawer>
                <app-dock-manager></app-dock-manager>
            </main>
		`;
	}

	static styles = unsafeCSS(styles);
}
