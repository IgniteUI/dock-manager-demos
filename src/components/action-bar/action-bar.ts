import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
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

	@state()
	private dropdownOpen = false;

	private get projectTitle(): string {
		if (!this.currentProject) return 'Dock Manager Samples';

		return this.currentProject
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
	}

	private handleHamburgerClick() {
		this.dispatchEvent(new CustomEvent('toggle-drawer', { bubbles: true, composed: true }));
	}

	private handleDownloadClick() {
		this.dropdownOpen = !this.dropdownOpen;
	}

	private handleHomeClick() {
		Router.go('/');
	}

	private handleDownloadItemClick(version: string) {
		console.log('Download item clicked:', version);

		this.dispatchEvent(new CustomEvent('download-project', {
			bubbles: true,
			composed: true,
			detail: {
				projectPath: this.currentProject || 'main-app',
				version: version
			}
		}));

		this.dropdownOpen = false;
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

                ${this.currentProject ? html`
                    <igc-icon-button
                            @click="${this.handleHomeClick}"
                            variant="flat"
                            slot="start">
                        <igc-icon name="home" collection="material"></igc-icon>
                    </igc-icon-button>
                ` : ''}

                <h1 slot="start" class="ig-typography__h5">${this.projectTitle}</h1>

                <igc-dropdown slot="end">
                    <igc-button
                            slot="target"
                            @click="${this.handleDownloadClick}"
                            aria-label="Download ${this.projectTitle} App"
                            title="Download ${this.projectTitle} App"
                            variant="outlined">
                        <span>Download</span>
                        <igc-icon name="download" collection="material"></igc-icon>
                    </igc-button>
                    <igc-dropdown-item @click="${() => this.handleDownloadItemClick('premium')}">
                        Premium Version
                    </igc-dropdown-item>
                    <igc-dropdown-item @click="${() => this.handleDownloadItemClick('community')}">
                        Community Version
                    </igc-dropdown-item>
                    <igc-dropdown-item @click="${() => this.handleDownloadItemClick('both')}">
                        Download Both
                    </igc-dropdown-item>
                </igc-dropdown>
            </igc-navbar>
		`;
	}

	static styles = unsafeCSS(styles);
}
