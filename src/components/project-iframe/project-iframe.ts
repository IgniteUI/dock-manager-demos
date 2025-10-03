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
        this._startLoading();
        this.dispatchEvent(new CustomEvent('iframe-loading-started', {
            bubbles: true,
            composed: true
        }));
    }

    // Ensure loading resets when projectPath changes after first render
    protected updated(changed: Map<string, unknown>) {
        if (changed.has('projectPath')) {
            this._startLoading();
        }
    }

    private _startLoading() {
        this._loadStartTime = Date.now();
        this._loading = true;
        this._error = false;
    }

    private async _handleLoad() {
        const elapsedTime = Date.now() - this._loadStartTime;
        const minLoadTime = 1000; // 1 second

        if (elapsedTime < minLoadTime) {
            await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
        }

        this._loading = false;
        this._error = false;
    }

    private _handleError(ev: Event) {
        console.error('iframe load error', { projectPath: this.projectPath, event: ev });
        this._loading = false;
        this._error = true;
    }

    // Build URL via the main app proxy: /projects/<id>/
    private getProjectUrl(): string {
        // Respect <base href>, default to root
        const baseEl = document.querySelector('base');
        const baseRaw = baseEl?.getAttribute('href') || '/';
        const base = baseRaw.replace(/\/*$/, ''); // trim trailing slash

        const id = this.projectPath.replace(/^\/*|\/*$/g, '');
        const safeId = encodeURIComponent(id);

        return `${base}/projects/${safeId}/`;
    }

    render() {
        if (this._error) {
            return html`
                <div class="error" role="alert">
                    <p>Failed to load a project: ${this.projectName} at /${this.projectPath}</p>
                </div>
            `;
        }

        return html`
            <div
                class="dm-loading ${this._loading ? 'dm-loading--visible': ''}"
                role="status"
                aria-live="polite"
                aria-describedby="${ this._loading ? 'dm-loading-message' : '' }"
                tabindex="0">
                <igc-circular-progress indeterminate></igc-circular-progress>
                <div id="dm-loading-message" class="dm-loading__message">
                    <div class="dm-loading__project-name">
                        ${this.projectName}
                    </div>
                    <span>Loading, please wait...</span>
                </div>
            </div>

            <iframe
                src="${this.getProjectUrl()}"
                @load=${this._handleLoad}
                @error=${this._handleError}
                aria-label="Interactive demo for ${this.projectName} project"
                title="Project: ${this.projectName}"
                loading="lazy"
                referrerpolicy="no-referrer">
            </iframe>
        `;
    }

    static styles = unsafeCSS(styles);

}
