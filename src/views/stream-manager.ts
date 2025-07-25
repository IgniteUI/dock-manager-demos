import { LitElement, unsafeCSS, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, state } from 'lit/decorators.js';
import styles from './stream-manager.scss?inline';
import sharedStyles from '../styles/_shared.scss?inline';
import { defineComponents, IgcCircularProgressComponent } from 'igniteui-webcomponents';

defineComponents(
	IgcCircularProgressComponent,
)

@customElement('stream-manager')
export default class StreamManager extends LitElement {
	constructor() {
		super();
	}

	@state() private isLoading = true;
	private loaderShownAt = 0;

	protected firstUpdated() {
		this.loaderShownAt = Date.now();

		const iframe = this.shadowRoot?.querySelector('iframe');
		iframe?.addEventListener('load', this.onIframeLoad);
	}

	private onIframeLoad = () => {
		const elapsed = Date.now() - this.loaderShownAt;
		const remaining = Math.max(1000 - elapsed, 0);

		setTimeout(() => {
			this.isLoading = false;
		}, remaining);
	};

	render() {
		const iframeSrc = `${import.meta.env.BASE_URL}projects/stream-manager/index.html`;
		console.log('iframeSrc:', iframeSrc); // Confirm iframeSrc in the browser console

		return html`
            <div
                class=${classMap({
                    'dm-loading': true,
                    'dm-loading--visible': this.isLoading,
                })}
	            aria-labelledby="loading-message">
                <igc-circular-progress indeterminate></igc-circular-progress>
                <p id="loading-message" class="dm-loading__message">The sample is loading, please wait...</p>
            </div>
            <iframe src=${iframeSrc} loading="eager"></iframe>
		`;
	}

	static styles = [unsafeCSS(styles), unsafeCSS(sharedStyles)];
}
