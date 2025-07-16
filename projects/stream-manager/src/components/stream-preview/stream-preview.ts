// dock-manager.ts
import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
	defineComponents,
	IgcChipComponent,
	IgcBadgeComponent,
	IgcCardComponent,
	IgcIconComponent,
	IgcDividerComponent,
} from 'igniteui-webcomponents';
import styles from './stream-preview.scss?inline';
import { mockStreamPreview, StreamPreviewData } from '../../data/stream-preview.ts';
import foxGuitar from '../../assets/videos/fox-guitar.webm';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(
	IgcChipComponent,
	IgcBadgeComponent,
	IgcCardComponent,
	IgcIconComponent,
	IgcDividerComponent,
);

@customElement('app-stream-preview')
export default class StreamPreview extends LitElement {
	@state()
	private previewData: StreamPreviewData = mockStreamPreview;

	render() {
		return html`
            <igc-card class="sm-stream-preview">
                <igc-card-media class="sm-stream-preview__media">
                    <video src="${ foxGuitar }"
                           autoplay
                           loop
                           muted
                           playsinline
                           type="video/webm"
                    >
                        <source src="../../assets/videos/fox-guitar.webm" type="video/webm">
                        Your browser does not support the video tag.
                    </video>
                </igc-card-media>

                <igc-card-header class="sm-stream-preview__header">
                    <h3 slot="title" class="sm-stream-preview__title">
                        ${ this.previewData.streamTitle }
                        <igc-icon name="verified" collection="material">icon</igc-icon>
                    </h3>
                    <h5 slot="subtitle" class="sm-stream-preview__subtitle">
                        <span>${ this.previewData.description } <a class="sm-link"
                                                                   href="#">@${ this.previewData.streamerName }</a></span>
                        <div class="sm-stream-preview__state">
                            ${ this.previewData.isLive ? html`
                                <igc-badge variant="danger" class="sm-animation-pulse"></igc-badge> live`: nothing }
                        </div>
                    </h5>
                </igc-card-header>

                <igc-card-content class="sm-stream-preview__content">
                    <div class="sm-stream-preview__genres">
                        ${ this.previewData.genres.map(genre => html`
                            <igc-chip>${ genre }</igc-chip>`) }
                    </div>
                    <igc-divider></igc-divider>
                    <div class="sm-stream-preview__social">
                        <div class="sm-stream-preview__social-channels">
                            ${ this.previewData.socialMedia.map(platform => html`
                                <a href="${ platform.url }">
                                    <igc-icon name="${ platform.icon }" collection="material"></igc-icon>
                                    <span class="sm-stream-preview__social-channels-name">${ platform.accountName }</span>
                                </a>
                            `) }
                        </div>
                        <span class="sm-stream-preview__followers">${ this.previewData.followers } followers</span>
                    </div>
                </igc-card-content>
		`;
	}

	static styles = unsafeCSS(styles);
}
