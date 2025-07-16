import { LitElement, unsafeCSS, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import sampleStyles from './stream-manager.scss?inline';
import sharedStyles from '../shared.scss?inline';

@customElement('stream-manager')
export default class StreamManager extends LitElement {
	constructor() {
		super();
	}

	private onLoad = (event: any) => {
		event.target.parentElement.classList.remove('loading');
	};

	render() {
		const iframeSrc = `${ import.meta.env.BASE_URL }igx-docmanager`;
		return html`
            <div class="iframe-wrapper loading">
                <iframe src=${ iframeSrc } @load=${ this.onLoad }></iframe>
            </div>
		`;
	}

	static styles = [unsafeCSS(sampleStyles), unsafeCSS(sharedStyles)];
}
