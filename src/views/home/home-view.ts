import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './home-view.css?inline';

import '../stream-manager.ts';

@customElement('home-view')
export default class HomeView extends LitElement {
	connectedCallback(): void {
		super.connectedCallback();
		window.addEventListener('vaadin-router-location-changed', this.updateCurrentPath);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		window.removeEventListener('vaadin-router-location-changed', this.updateCurrentPath);
	}

	@state()
	private routeName: string = 'stream-manager';

	private updateCurrentPath = (event: any) => {
		const { route } = event.detail.location;
		this.routeName = route.path;
	};

	render() {
		return html`
            ${ this.routeName==='stream-manager' ? html`test`: '' }
            <slot></slot>
		`;
	}

	static styles = unsafeCSS(styles);
}
