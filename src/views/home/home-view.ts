import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './home-view.scss?inline';

import '../stream-manager.ts';

@customElement('home-view')
export default class HomeView extends LitElement {
	render() {
		return html`
            <slot></slot>
		`;
	}

	static styles = unsafeCSS(styles);
}
