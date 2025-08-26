import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
                <div slot="start" class="dm-app-title">
                    <igc-icon-button
                            @click="${this.handleHamburgerClick}"
                            variant="flat">
                        <igc-icon name="hamburger_menu" collection="material"></igc-icon>
                    </igc-icon-button>

                    <h1 class="dm-app-title__text">Dock manager demos</h1>
                </div>

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
                </igc-dropdown>
            </igc-navbar>
		`;
	}

	static styles = unsafeCSS(styles);
}
