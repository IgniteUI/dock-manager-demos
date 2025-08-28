/**
 * Stream Preview web component.
 *
 * Renders a card with:
 * - A media area that plays a looping muted video
 * - A loading indicator while media is fetching/decoding
 * - An inline error message if the media fails to load
 * - Stream metadata (title, verified icon, description, live state)
 * - Genre chips and social links with follower count
 *
 * Accessibility:
 * - The media wrapper uses aria-busy to announce loading to assistive tech.
 * - Error message is marked with role="alert" for immediate announcement.
 * - A loader region is presentational and removed from the tree once ready.
 *
 * Usage:
 *   <app-stream-preview></app-stream-preview>
 *
 * Dependencies:
 * - LitElement for templating and reactive state
 * - Ignite UI Web Components for Card, Icon, Chip, Badge, Divider, Progress
 */
import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { defineCustomElements } from 'igniteui-dockmanager/loader';
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
// ... existing code ...
import { mockStreamPreview, IStreamPreviewData } from '../../data/stream-preview.ts';
import foxGuitar from '../../assets/videos/AdobeStock_1269394798.mp4';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';

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

/** Message shown in the loader while the video is initializing. */
const LOADING_MESSAGE = 'Loading stream, please wait…';
/** Message shown when the video element emits an error event. */
const ERROR_MESSAGE = 'Sorry, we have technical difficulties, please try again later.';
/** Label displayed when the stream is live. */
const LIVE_LABEL = 'LIVE';
/** Label appended after the followers value. */
const FOLLOWERS_LABEL = 'followers';


@customElement('app-stream-preview')
export default class StreamPreview extends LitElement {
    /**
     * Immutable preview data used to populate the card.
     * Replace with real data source or make it a public @property if needed.
     */
    private readonly previewData: IStreamPreviewData = mockStreamPreview;

    /** Video source URL. Defaults to the bundled asset but can be overridden for testing. */
    @property({ type: String, attribute: 'src' })
    videoSrc: string = foxGuitar;

    /** Internal flag: true while the video is still loading/decoding. */
    @state()
    private isVideoLoading = true;

    /** Internal flag: true if the video failed to load. */
    @state()
    private isVideoError = false;

    /**
     * Whether the loader UI should be visible.
     * Loader is shown only when loading and not in error state.
     */
    private get showLoader(): boolean {
        return this.isVideoLoading && !this.isVideoError;
    }

    /**
     * String form of the media region busy state for aria-busy attribute.
     * Using a getter ensures it stays in sync with isVideoLoading.
     */
    private get mediaAriaBusy(): string {
        return String(this.isVideoLoading);
    }

    /**
     * Video loaded handler: hides loader and clears errors.
     * Bound as an arrow function to preserve component context.
     */
    private handleVideoLoaded = (_ev: Event) => {
        this.isVideoLoading = false;
        this.isVideoError = false;
    };

    /**
     * Video error handler: hides loader and shows error message.
     * Bound as an arrow function to preserve component context.
     */
    private handleVideoError = (_ev: Event) => {
        this.isVideoLoading = false;
        this.isVideoError = true;
    };

    render() {
        return html`
            <igc-card class="sm-stream-preview">
                <igc-card-media
                        class="sm-stream-preview__media"
                        aria-busy="${this.mediaAriaBusy}">
                    <div class=${classMap({
                            'sm-stream-preview__loader': true,
                            'loading': this.showLoader
                        })}>
                            ${ this.showLoader ? html`
                                <igc-circular-progress indeterminate></igc-circular-progress>
                                <p>${ LOADING_MESSAGE }</p>
                                `: nothing
                            }
    
                            ${ this.isVideoError ? html`
                                <div class="sm-stream-preview__error">
                                    <p role="alert">
                                        ${ ERROR_MESSAGE }
                                    </p>
                                </div>
                                `: nothing
                            }
                    </div>

                    <video
                        src="${this.videoSrc}"
                        aria-label="Streamer video"
                        autoplay
                        loop
                        muted
                        playsinline
                        type="video/mp4"
                        @loadeddata=${this.handleVideoLoaded}
                        @error=${this.handleVideoError}
                    ></video>
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
                                        class=${classMap({
                                            'loading': this.showLoader,
                                            'sm-animation-live': !this.showLoader
                                        })}>
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

    /** Component-scoped styles compiled from SCSS. */
    static styles = unsafeCSS(styles);
}
