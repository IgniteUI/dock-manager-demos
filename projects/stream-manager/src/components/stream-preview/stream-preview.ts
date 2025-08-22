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
	IgcCircularProgressComponent,
} from 'igniteui-webcomponents';
import styles from './stream-preview.scss?inline';
import { mockStreamPreview, IStreamPreviewData } from '../../data/stream-preview.ts';
import foxGuitar from '../../assets/videos/AdobeStock_1269394798.mp4';
import { repeat } from 'lit/directives/repeat.js';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(
	IgcChipComponent,
	IgcBadgeComponent,
	IgcCardComponent,
	IgcIconComponent,
	IgcDividerComponent,
	IgcCircularProgressComponent,
);

const LOADER_DELAY_MS = 2000;
const LOADING_MESSAGE = 'Loading stream, please wait…';
const ERROR_MESSAGE = 'Sorry, we have technical difficulties, please try again later.';
const LIVE_LABEL = 'LIVE';
const FOLLOWERS_LABEL = 'followers';

@customElement('app-stream-preview')
export default class StreamPreview extends LitElement {
	@state()
	private previewData: IStreamPreviewData = mockStreamPreview;

	@state()
	private isVideoLoading = true;

	@state()
	private isVideoError = false;

	private handleVideoLoaded = () => {
		setTimeout(() => {
			this.isVideoLoading = false;
			this.isVideoError = false;
		}, LOADER_DELAY_MS);
	};

	private handleVideoError = () => {
		this.isVideoLoading = false;
		this.isVideoError = true;
	};


	render() {
		return html`
            <igc-card class="sm-stream-preview">
                <igc-card-media class="sm-stream-preview__media">
                    <div class="sm-stream-preview__loader ${ this.isVideoLoading && !this.isVideoError ? 'loading': '' }">
                        ${ this.isVideoLoading && !this.isVideoError ? html`
                            <igc-circular-progress indeterminate></igc-circular-progress>
                            <p>${ LOADING_MESSAGE }</p>
                        `: nothing }

                        ${ this.isVideoError ? html`
                            <p class="sm-stream-preview__error">
                                ${ ERROR_MESSAGE }
                            </p>`: nothing }
                    </div>

                    <video
                        src="${ foxGuitar }"
                        aria-label="Streamer video"
                        ?autoplay="${ this.isVideoLoading && !this.isVideoError}"
                        loop
                        muted
                        type="video/webm"
                        @loadeddata=${ this.handleVideoLoaded }
                        @error=${ this.handleVideoError }
                    </video>
                </igc-card-media>

                <igc-card-header class="sm-stream-preview__header">
                    <h3 slot="title" class="sm-stream-preview__title">
                        ${ this.previewData.streamTitle }
                        <igc-icon name="verified" collection="material">icon</igc-icon>
                    </h3>
                    <h5 slot="subtitle" class="sm-stream-preview__subtitle">
                        <span>
	                        ${ this.previewData.description } 
	                        <a class="sm-link" href="#">@${ this.previewData.streamerName }</a>
                        </span>
                        <div class="sm-stream-preview__state">
                            ${ this.previewData.isLive ? html`
                                <igc-badge
                                    variant="danger"
                                    class="${ this.isVideoLoading && !this.isVideoError ? 'loading': 'sm-animation-live' }">
                                </igc-badge> ${ LIVE_LABEL }`: nothing }
                        </div>
                    </h5>
                </igc-card-header>

                <igc-card-content class="sm-stream-preview__content">
                    <div class="sm-stream-preview__genres">
                        ${ repeat(this.previewData.genres, genre => genre, genre => html`
                            <igc-chip>
                                <span class="sm-stream-preview__genres-text">${ genre }</span>
                            </igc-chip>
                        `) }
                    </div>
                    <igc-divider></igc-divider>
                    <div class="sm-stream-preview__social">
                        <div class="sm-stream-preview__social-channels">
                            ${ repeat(this.previewData.socialMedia, (p) => p.accountName, (platform) => html`
                                <a href="${ platform.url }" aria-label="Go to ${ platform.accountName } profile">
                                    <igc-icon name="${ platform.icon }" collection="material"></igc-icon>
                                    <span class="sm-stream-preview__social-channels-name">${ platform.accountName }</span>
                                </a>
                            `) }
                        </div>
                        <span class="sm-stream-preview__followers">
	                        <span class="sm-stream-preview__followers-amount">
		                        ${ this.previewData.followers }
	                        </span>
	                        ${ FOLLOWERS_LABEL }
                        </span>
                    </div>
                </igc-card-content>
            </igc-card>
		`;
	}

	static styles = unsafeCSS(styles);
}
