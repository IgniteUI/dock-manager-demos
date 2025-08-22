// src/components/project-iframe/project-iframe.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './project-iframe.scss?inline';
import { defineComponents, IgcCircularProgressComponent } from 'igniteui-webcomponents';

defineComponents(
	IgcCircularProgressComponent,
);

@customElement('project-iframe')
export class ProjectIframe extends LitElement {
	@property({ type: String })
	projectPath = '';

	@property({ type: String })
	projectName = '';


	private _loadStartTime = 0;

	@state()
	private _loading = true;

	@state()
	private _error = false;

	connectedCallback() {
		super.connectedCallback();
		this._loadStartTime = Date.now();
		this._loading = true;

		// Dispatch loading started event
		this.dispatchEvent(new CustomEvent('iframe-loading-started', {
			bubbles: true,
			composed: true
		}));
	}

	private async _handleLoad() {
		const elapsedTime = Date.now() - this._loadStartTime;
		const minLoadTime = 1000; // 1 second

		if (elapsedTime < minLoadTime) {
			// Wait for the remaining time to reach 1 second
			await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
		}


		this._loading = false;
		this._error = false;
	}

	private _handleError() {
		this._loading = false;
		this._error = true;
	}

    private getProjectUrl(): string {
        // Map project names to their dev server ports
        const portMap: Record<string, number> = {
            'stream-manager': 3001,
            // Add more projects here as needed:
            // 'another-project': 3002,
        };

        const port = portMap[this.projectPath] || 3001;
        return `http://localhost:${port}/`;
    }


    render() {
		if (this._error) {
			return html`
	        <div class="error">
	          <p>Failed to load a project: ${this.projectName} at /${this.projectPath}</p>
	        </div>
	      `;
		}

		return html`
			<div
				class="dm-loading 
				${this._loading ? 'dm-loading--visible': ''}"
                role="status"
                aria-live="polite"
                aria-hidden="${!this._loading}"
                ?aria-describedby="${ this._loading ? 'dm-loading-message': '' }"
                tabindex="1">
            
	            <igc-circular-progress indeterminate></igc-circular-progress>
	            <div id="dm-loading-message" class="dm-loading__message">Loading ${this.projectName} project, please wait...</div>
			</div>

            <iframe
                src="${this.getProjectUrl()}"
                @load=${this._handleLoad}
                @error=${this._handleError}
                aria-label="Interactive demo for ${this.projectName} project"
                title="Project: ${this.projectName}">
            </iframe>
        `;
	}

	static styles = unsafeCSS(styles);
}
