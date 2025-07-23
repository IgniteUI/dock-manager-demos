
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
	defineComponents,
	IgcNavbarComponent,
	IgcIconComponent,
	IgcInputComponent,
	IgcAvatarComponent,
	IgcLinearProgressComponent,
	IgcTooltipComponent,
} from 'igniteui-webcomponents';
import styles from './header.scss?inline';

// Initialize required Igniteui components
defineComponents(
	IgcNavbarComponent,
	IgcIconComponent,
	IgcInputComponent,
	IgcAvatarComponent,
	IgcLinearProgressComponent,
	IgcTooltipComponent
);

/**
 * Stream Manager application header component
 * Displays live-streaming metrics and navigation controls
 */
@customElement('app-header')
export default class Header extends LitElement {
	// Constants
	private static readonly MIN_BITRATE = 5000;
	private static readonly MAX_BITRATE = 9000;
	private static readonly BITRATE_STEP = 1000;
	private static readonly DIRECTION_CHANGE_PROBABILITY = 0.15;
	private static readonly MIN_VIEWERS = 43000;
	private static readonly MAX_VIEWERS = 17500;
	private static readonly MINUTES_LOOP_COUNT = 40;

	// State Properties
	@state() private sessionTime = '1:00:00';
	@state() private viewers = Header.MIN_VIEWERS;
	@state() private followers = 123000;
	@state() private bitrate = Header.MIN_BITRATE;
	@state() private bitrateDirection = 1; // 1 for increasing, -1 for decreasing


	// Timer Configuration
	private readonly timeUpdateInterval = 1000;
	private readonly updateInterval = 4000;
	private readonly bitrateUpdateInterval = 5000;

	// Private Properties
	private readonly startTime: number;
	private timer: number | undefined;
	private bitrateTimer: number | undefined;

	constructor() {
		super();
		this.startTime = Date.now();
	}

	/**
	 * Set up timers for updating metrics when component is connected
	 */
	connectedCallback(): void {
		super.connectedCallback();
		this.setupTimers();
	}

	/**
	 * Cleanup timers when a component is disconnected
	 */
	disconnectedCallback(): void {
		this.clearTimers();
		super.disconnectedCallback();
	}

	/**
	 * Calculate and update the session time display
	 */
	private updateSessionTime(): void {
		const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
		const seconds = elapsedSeconds % 60;
		const minutes = Math.floor(elapsedSeconds / 60) % Header.MINUTES_LOOP_COUNT;

		// HH:MM:SS
		this.sessionTime = `1:${this.padZero(minutes)}:${this.padZero(seconds)}`;
	}


	/**
	 * Set up all interval timers for metrics
	 */
	private setupTimers(): void {
		// Initial update
		this.updateSessionTime();

		// Set intervals for regular updates
		window.setInterval(() => this.updateSessionTime(), this.timeUpdateInterval);
		this.timer = window.setInterval(() => this.updateViewersAndFollowers(), this.updateInterval);
		this.bitrateTimer = window.setInterval(() => this.updateBitrate(), this.bitrateUpdateInterval);
	}

	/**
	 * Clear all timers to prevent memory leaks
	 */
	private clearTimers(): void {
		if (this.timer) {
			clearInterval(this.timer);
		}
		if (this.bitrateTimer) {
			clearInterval(this.bitrateTimer);
		}
	}

	/**
	 * Pad a number with a leading zero if needed
	 */
	private padZero(num: number): string {
		return num.toString().padStart(2, '0');
	}

	/**
	 * Update viewer and follower counts with random increments
	 */
	private updateViewersAndFollowers(): void {
		// Update viewers with random increments
		const randomViewerIncrement = Math.floor(Math.random() * 300);
		this.viewers += randomViewerIncrement;

		// Reset viewers if they exceed a max threshold
		if (this.viewers > Header.MAX_VIEWERS) {
			this.viewers = Header.MIN_VIEWERS;
		}

		// Update followers with small random increments
		const randomFollowerIncrement = Math.floor(Math.random() * 12);
		this.followers += randomFollowerIncrement;
	}

	/**
	 * Update the bitrate with a natural-looking oscillation pattern
	 */
	private updateBitrate(): void {
		// Add random variation for natural appearance
		const randomVariation = Math.floor(Math.random() * 3);

		// Update bitrate with direction and randomness
		this.bitrate += (this.bitrateDirection * Header.BITRATE_STEP) + randomVariation;

		// Change a direction at boundaries
		if (this.bitrate >= Header.MAX_BITRATE) {
			this.bitrateDirection = -1;
		} else if (this.bitrate <= Header.MIN_BITRATE) {
			this.bitrateDirection = 1;
		}

		// Occasionally change a direction randomly
		if (Math.random() < Header.DIRECTION_CHANGE_PROBABILITY) {
			this.bitrateDirection *= -1;
		}

		// Ensure the bitrate stays within bounds
		this.bitrate = Math.max(Header.MIN_BITRATE, Math.min(Header.MAX_BITRATE, this.bitrate));
	}

	/**
	 * Format viewer count for display
	 */
	private formatViewers(value: number): string {
		return this.formatThousands(value);
	}

	/**
	 * Format follower count for display
	 */
	private formatFollowers(value: number): string {
		return this.formatThousands(value);
	}

	/**
	 * Format number to thousands with K suffix
	 */
	private formatThousands(value: number): string {
		return (value / 1000).toFixed(1) + 'K';
	}

	/**
	 * Render the header component UI
	 */
	render() {
		return html`
      <igc-navbar class="sm-header">
        ${this.renderLogo()}
        ${this.renderMetrics()}
        ${this.renderActions()}
      </igc-navbar>
    `;
	}

	/**
	 * Render the logo section
	 */
	private renderLogo() {
		return html`
      <a href="#" slot="start" class="sm-header__logo">
        <igc-icon name="smanager" collection="material" class="sm-header__logomark"></igc-icon>
        <h1 class="sm-header__logo-text">STREAM MANAGER</h1>
      </a>
    `;
	}

	/**
	 * Render the metrics section
	 */
	private renderMetrics() {
		return html`
      <div class="sm-header__info">
        ${this.renderMetricItem('Session', this.sessionTime)}
        ${this.renderMetricItem('Viewers', this.formatViewers(this.viewers))}
        ${this.renderMetricItem('Followers', this.formatFollowers(this.followers))}
        ${this.renderBitrateItem()}
      </div>
    `;
	}

	/**
	 * Render a standard metric item
	 */
	private renderMetricItem(label: string, value: string) {
		return html`
      <div class="sm-info-item">
        <span class="sm-info-item__label">${label}</span>
        <span class="sm-info-item__value">${value}</span>
      </div>
    `;
	}

	private get bitratePercentage(): number {
		return (
			((this.bitrate - Header.MIN_BITRATE) /
				(Header.MAX_BITRATE - Header.MIN_BITRATE)) *
			100
		);
	}

	/**
	 * Render the bitrate metric with the progress bar
	 */
	private renderBitrateItem() {
		const rawBitrate = this.bitrate;
		const percent = this.bitratePercentage;

		return html`
            <div class="sm-info-item" id="bitrateValue">
                <span class="sm-info-item__label">Bitrate</span>
                <igc-linear-progress
                        hide-label
                        class="sm-info-item__value sm-info-item__value--progress"
                        value="${percent}">
                </igc-linear-progress>
            </div>
            <igc-tooltip anchor="bitrateValue">
                Current Bitrate: ${rawBitrate} kbps
            </igc-tooltip>
		`;
	}


	/**
	 * Render the actions section
	 */
	private renderActions() {
		return html`
      <div class="sm-header__actions" slot="end">
        <igc-input type="search" placeholder="Search">
          <igc-icon slot="prefix" name="search" collection="material"></igc-icon>
        </igc-input>
        ${this.renderNavigation()}
        <igc-avatar src="./src/assets/images/profile.png" shape="circle" name="more_vert">
          <igc-icon name="user" collection="material"></igc-icon>
        </igc-avatar>
      </div>
    `;
	}

	/**
	 * Render the navigation icons
	 */
	private renderNavigation() {
		const navIcons = [
			{ name: 'comments', collection: 'material' },
			{ name: 'languages', collection: 'material' },
			{ name: 'info', collection: 'material' },
			{ name: 'inbox', collection: 'material' },
		];

		return html`
      <nav class="sm-header__actions-nav">
        ${navIcons.map(icon => html`
          <a href="#">
            <igc-icon name="${icon.name}" collection="${icon.collection}"></igc-icon>
          </a>
        `)}
      </nav>
    `;
	}

	static styles = unsafeCSS(styles);
}
