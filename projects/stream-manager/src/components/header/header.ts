import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
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
import { InavbarAction, navbarActions } from '../../data/navbar-actions.ts';
import { IqualityLevel, qualityLevels } from '../../data/quality-levels.ts';

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
	private static readonly MIN_BITRATE = 29500;
	private static readonly MAX_BITRATE = 60000;
	private static readonly BITRATE_STEP = 2000;
	private static readonly DIRECTION_CHANGE_PROBABILITY = 0.15;
	private static readonly MIN_VIEWERS = 43000;
	private static readonly MAX_VIEWERS = 175000;
	private static readonly MINUTES_LOOP_COUNT = 40;

	// Timer Configuration
	private readonly timeUpdateInterval = 1000;
	private readonly updateInterval = 2000;
	private readonly bitrateUpdateInterval = 3000;

	// 1 for increasing, -1 for decreasing
	private bitrateDirection = 1;

	private readonly startTime: number;
	private intervals: { [key: string]: number } = {};

	// State Properties
	@state()
	private sessionTime = '1:00:00';

	@state()
	private viewers = Header.MIN_VIEWERS;

	@state()
	private followers = 65000;

	@state()
	private bitrate = Header.MIN_BITRATE;

	@state()
	private qualityInfo: IqualityLevel = qualityLevels[0];

	@state()
	private navbarActions: InavbarAction[] = navbarActions;

	private _logoTemplate = html`
    <a href="#" slot="start" class="sm-header__logo">
        <igc-icon name="smanager" collection="material" class="sm-header__logomark"></igc-icon>
        <h1 class="sm-header__logo-text">STREAM MANAGER</h1>
    </a>
`;

	constructor() {
		super();
		this.startTime = Date.now();
		this.qualityInfo = this.calculateQualityInfo(this.bitrate);
	}

	/**
	 * Recalculate `qualityInfo` whenever the `bitrate` changes
	 */
	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('bitrate')) {
			this.qualityInfo = this.calculateQualityInfo(this.bitrate);
		}
		super.updated(changedProperties);
	}

	/**
	 * Set up timers for updating metrics when a component is connected
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

		// Set intervals for regular updates with different frequencies
		this.intervals = {
			// Session time updates most frequently (every second)
			sessionTime: window.setInterval(() => this.updateSessionTime(), this.timeUpdateInterval),

			// Viewers update every 2 seconds
			viewers: window.setInterval(() => {
				// Update viewers with random increments
				const randomViewerIncrement = Math.floor(Math.random() * 300);
				this.viewers += randomViewerIncrement;

				// Reset viewers if they exceed a max threshold
				if (this.viewers > Header.MAX_VIEWERS) {
					this.viewers = Header.MIN_VIEWERS;
				}
			}, this.updateInterval),

			// Followers update with a slight offset (every 3 seconds)
			followers: window.setInterval(() => {
				// Update followers with small random increments
				const randomFollowerIncrement = Math.floor(Math.random() * 500);
				this.followers += randomFollowerIncrement;
			}, this.updateInterval + 1000),

			// Bitrate updates with its own interval (every 3 seconds)
			bitrate: window.setInterval(() => this.updateBitrate(), this.bitrateUpdateInterval)
		};

	}

	/**
	 * Clear all timers to prevent memory leaks
	 */
	private clearTimers(): void {
		Object.values(this.intervals).forEach(clearInterval);
		this.intervals = {};
	}

	/**
	 * Pad a number with a leading zero if needed
	 */
	private padZero(num: number): string {
		return num.toString().padStart(2, '0');
	}

	/**
	 * Calculate quality info based on bitrate
	 */
	private calculateQualityInfo(bitrate: number): IqualityLevel {
		for (const level of qualityLevels) {
			if (bitrate >= level.min && bitrate < level.max) {
				return level;
			}
		}
		return qualityLevels[qualityLevels.length - 1];
	}

	/**
	 * Calculate the percentage for the progress bar based on current bitrate quality level
	 */
	private get bitratePercentage(): number {
		const [minPercent, maxPercent] = this.qualityInfo.percentRange;

		const { min, max } = this.qualityInfo;
		const range = max - min;

		// Calculate percentage within the current quality range
		const percentRange = maxPercent - minPercent;
		const positionInRange = this.bitrate - min;

		// Avoid division by zero
		if (range === 0) return maxPercent;

		return minPercent + (positionInRange / range) * percentRange;
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
	 * Format number to thousands with K suffix
	 */
	private formatThousands(value: number): string {
		return (value / 1000).toFixed(1) + 'K';
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

	/**
	 * Render the bitrate metric with the progress bar
	 */
	private renderBitrateItem() {
		// Convert to Mbps
		const formattedBitrate = (this.bitrate / 1000).toFixed(1);
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
	            Bitrate Quality: ${formattedBitrate} Mbps (${this.qualityInfo.label})
            </igc-tooltip>
		`;
	}

	/**
	 * Render the metrics section
	 */
	private renderMetrics() {
		return html`
            <div class="sm-header__info">
                ${this.renderMetricItem('Session', this.sessionTime)}
                ${this.renderMetricItem('Viewers', this.formatThousands(this.viewers))}
                ${this.renderMetricItem('Followers', this.formatThousands(this.followers))}
                ${this.renderBitrateItem()}
            </div>
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
	 * Render the logo section
	 */
	private renderLogo() {
		return this._logoTemplate;
	}

	/**
	 * Render the navigation icons
	 */
	private renderNavigation() {
		return html`
            <nav class="sm-header__actions-nav">
                ${ repeat(this.navbarActions, action => action.name, action => html`
                    <a href="#" aria-label="${action.label}">
                        <igc-icon name="${action.name}" collection="${action.collection}"></igc-icon>
                    </a>
                `)}
            </nav>
        `;
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

	static styles = unsafeCSS(styles);
}
