// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
	defineComponents, IgcChatComponent,
} from 'igniteui-webcomponents';
import styles from './stream-chat.scss?inline';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(IgcChatComponent);

@customElement('app-stream-chat')
export default class StreamChat extends LitElement {
	render() {
		return html`
			<!-- <igc-chat></igc-chat> -->
            <div class="coming-soon">
                Chat component coming soon
            </div>
		`;
	}

	static styles = unsafeCSS(styles);
}
