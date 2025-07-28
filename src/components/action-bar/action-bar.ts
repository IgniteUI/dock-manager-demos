import { LitElement, html, unsafeCSS } from 'lit';

import {
	defineComponents,
	IgcButtonComponent,
	IgcIconButtonComponent,
	IgcIconComponent,
	IgcNavbarComponent,
} from 'igniteui-webcomponents';

import { customElement } from 'lit/decorators.js';
import styles from './action-bar.scss?inline';

defineComponents(
	IgcButtonComponent,
	IgcNavbarComponent,
	IgcIconComponent,
	IgcIconButtonComponent
);

@customElement('app-action-bar')
export default class ActionBar extends LitElement {
	handleHamburgerClick() {
		// Dispatch a custom event when the hamburger button is clicked
		this.dispatchEvent(new CustomEvent('toggle-drawer', { bubbles: true, composed: true }));
	}

	handleDownloadClick() {
		// Dispatch a custom event for downloading the current app
		this.dispatchEvent(new CustomEvent('download-current-app', { bubbles: true, composed: true }));
	}


	render() {
		return html`
            <igc-navbar>
				<igc-icon-button
                    @click="${this.handleHamburgerClick}"
					variant="flat" 
					slot="start">
					<igc-icon name="hamburger_menu" collection="material"></igc-icon>
				</igc-icon-button>
	            
                <h1 class="ig-typography__h5">Dock manager samples</h1>
	            <igc-button
                    @click="${this.handleDownloadClick}"
                    slot="end" 
		            variant="contained">
		            <span>Download app</span>
                    <igc-icon name="download" collection="material"></igc-icon>
	            </igc-button>
            </igc-navbar>
		`;
	}

	static styles = unsafeCSS(styles);
}
