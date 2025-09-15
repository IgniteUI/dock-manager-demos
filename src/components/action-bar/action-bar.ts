import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
	defineComponents,
	IgcButtonComponent,
	IgcIconButtonComponent,
	IgcIconComponent,
	IgcNavbarComponent,
	IgcDropdownComponent,
	IgcDropdownItemComponent
} from 'igniteui-webcomponents';
import styles from './action-bar.scss?inline';

defineComponents(
	IgcButtonComponent,
	IgcNavbarComponent,
	IgcIconComponent,
	IgcIconButtonComponent,
	IgcDropdownComponent,
	IgcDropdownItemComponent
);

@customElement('app-action-bar')
export default class ActionBar extends LitElement {
	@property({ type: String })
	currentProject = '';

	private handleHamburgerClick() {
		this.dispatchEvent(new CustomEvent('toggle-drawer', { bubbles: true, composed: true }));
	}

	render() {
		return html`
            <igc-navbar>
                <div slot="start" class="dm-app-title">
                    <igc-icon-button
                            @click="${this.handleHamburgerClick}"
                            variant="flat">
                        <igc-icon name="hamburger_menu" collection="material"></igc-icon>
                    </igc-icon-button>

                    <h1 class="dm-app-title__text">Dock manager demos</h1>
                </div>
            </igc-navbar>
		`;
	}

	static styles = unsafeCSS(styles);
}
