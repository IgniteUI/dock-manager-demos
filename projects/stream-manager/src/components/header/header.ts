// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
	defineComponents,
	IgcNavbarComponent,
	IgcIconComponent,
	IgcInputComponent,
	IgcAvatarComponent,
	IgcLinearProgressComponent,
} from 'igniteui-webcomponents';
import styles from './header.scss?inline';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(
	IgcNavbarComponent,
	IgcIconComponent,
	IgcInputComponent,
	IgcAvatarComponent,
	IgcLinearProgressComponent,
);

@customElement('app-header')
export default class Header extends LitElement {
	@state() private sessionTime = '1:00:00';
	@state() private viewers = 13000;
	@state() private followers = 50;
	@state() private bitrate = 30;

	private startTime: number;
	private timer: number | undefined;
	private updateInterval = 4000; // 4 seconds interval for other metrics
	private timeUpdateInterval = 1000; // 1 second interval for the clock

	constructor() {
		super();
		this.startTime = Date.now();
	}

	connectedCallback(): void {
		super.connectedCallback();

		// Update time every second
		this.updateSessionTime();
		window.setInterval(() => this.updateSessionTime(), this.timeUpdateInterval);

		// Update other metrics every 4 seconds
		this.timer = window.setInterval(() => this.updateOtherMetrics(), this.updateInterval);
	}

	disconnectedCallback(): void {
		if (this.timer) {
			clearInterval(this.timer);
		}
		super.disconnectedCallback();
	}

	private updateSessionTime(): void {
		const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
		const seconds = elapsedSeconds % 60;
		const minutes = Math.floor(elapsedSeconds / 60) % 40; // Loop minutes from 0 to 39

		// Format as 1:MM:SS
		this.sessionTime = `1:${ minutes.toString().padStart(2, '0') }:${ seconds.toString().padStart(2, '0') }`;
	}

	private updateOtherMetrics(): void {
		// Update viewers: increase from 13K to 17.5K with random increments
		const randomViewerIncrement = Math.floor(Math.random() * 300);
		this.viewers += randomViewerIncrement;
		if (this.viewers > 17500) {
			this.viewers = 13000;
		}

		// Update followers: increase from 50 to 370 with random increments
		const randomFollowerIncrement = Math.floor(Math.random() * 8);
		this.followers += randomFollowerIncrement;
		if (this.followers > 370) {
			this.followers = 50;
		}

		// Update bitrate: randomly change between 10% to 100%
		this.bitrate = 10 + Math.floor(Math.random() * 91); // 10-100
	}

	private formatViewers(value: number): string {
		return (value / 1000).toFixed(1) + 'K';
	}


	render() {
		return html`
            <igc-navbar class="sm-header">
                <!-- START -->
                <a href="#" slot="start" class="sm-header__logo">
                    <igc-icon name="smanager" collection="material" class="sm-header__logomark"></igc-icon>
                    <h1 class="sm-header__logo-text">STREAM MANAGER</h1>
                </a>

                <!-- MIDDLE -->
                <div class="sm-header__info">
                    <div class="sm-info-item">
                        <span class="sm-info-item__label">Session</span>
                        <span class="sm-info-item__value">${ this.sessionTime }</span>
                    </div>

                    <div class="sm-info-item">
                        <span class="sm-info-item__label">Viewers</span>
                        <span class="sm-info-item__value">${ this.formatViewers(this.viewers) }</span>
                    </div>

                    <div class="sm-info-item">
                        <span class="sm-info-item__label">Folowers</span>
                        <span class="sm-info-item__value">${ this.followers }</span>
                    </div>

                    <div class="sm-info-item">
                        <span class="sm-info-item__label">Bitrate</span>
                        <igc-linear-progress hide-label class="sm-info-item__value sm-info-item__value--progress"
                                             value="${ this.bitrate }"></igc-linear-progress>
                    </div>
                </div>

                <!-- END -->
                <div class="sm-header__actions" slot="end">
                    <igc-input type="search" placeholder="Search">
                        <igc-icon slot="prefix" name="search" collection="material"></igc-icon>
                    </igc-input>

                    <nav class="sm-header__actions-nav">
	                    <a href="#">
                            <igc-icon name="comments" collection="material"></igc-icon>
	                    </a>
	                    <a href="#">
                        	<igc-icon name="languages" collection="material"></igc-icon>
                        </a>
	                    <a href="#">
                        	<igc-icon name="info" collection="material"></igc-icon>
                        </a>
	                    <a href="#">
                        	<igc-icon name="inbox" collection="material"></igc-icon>
                        </a>
                    </nav>
                    <igc-avatar src="./src/assets/images/profile.png" shape="circle" name="more_vert">
                        <igc-icon name="user" collection="material"></igc-icon>
                    </igc-avatar>
                </div>
            </igc-navbar>
		`;
	}

	static styles = unsafeCSS(styles);
}
