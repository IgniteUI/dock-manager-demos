import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
    defineComponents,
    IgcNavbarComponent,
    IgcIconComponent,
    IgcInputComponent,
    IgcAvatarComponent,
    IgcLinearProgressComponent,
    IgcTooltipComponent,
    IgcIconButtonComponent,
} from 'igniteui-webcomponents';
import styles from './header.scss?inline';
import { IqualityLevel, qualityLevels } from '../../data/quality-levels.ts';
import profileImage from '../../assets/images/profile.png';
import { Breakpoint, responsiveService } from '../../services/responsive.service.ts';
import { IHeaderMetric, headerMetrics } from '../../data/header-metric.ts';
import '../navbar-actions/navbar-actions.ts';

// Initialize required Igniteui components
defineComponents(
	IgcNavbarComponent,
	IgcIconComponent,
	IgcInputComponent,
	IgcAvatarComponent,
	IgcLinearProgressComponent,
	IgcTooltipComponent,
    IgcIconButtonComponent
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

    @state()
    private headerMetrics: IHeaderMetric[] = headerMetrics;

    /**
     * Get the value for a specific metric
     */
    private getMetricValue(metricKey: string): string {
        switch (metricKey) {
            case 'session':
                return this.sessionTime;
            case 'viewers':
                return this.formatThousands(this.viewers);
            case 'followers':
                return this.formatThousands(this.followers);
            case 'bitrate':
                return (this.bitrate / 1000).toFixed(1); // For tooltip
            default:
                return '';
        }
    }

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
    private layoutDirty = false;

    // In the class
    @state()
    private breakpoint: Breakpoint = responsiveService.current;

    // Add the missing property
    private _unsubscribeBp?: () => void;

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
        window.addEventListener('app-dirty-change', this.onAppDirtyChange as EventListener);
        this._unsubscribeBp = responsiveService.addListener(({ current }) => {
            if (this.breakpoint !== current) {
                this.breakpoint = current;
                this.requestUpdate();
            }
        });
    }

    /**
	 * Cleanup timers when a component is disconnected
	 */
    disconnectedCallback(): void {
        this.clearTimers();
        window.removeEventListener('app-dirty-change', this.onAppDirtyChange as EventListener);
        if (this._unsubscribeBp) {
            this._unsubscribeBp();
            this._unsubscribeBp = undefined;
        }
        super.disconnectedCallback();
    }


    private onAppDirtyChange = (e: Event) => {
        const ce = e as CustomEvent<{ dirty: boolean }>;
        this.layoutDirty = !!ce.detail?.dirty;
    };

    private onResetAppClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        // Request reset across shadow DOM via a global event
        window.dispatchEvent(new CustomEvent('reset-app-request'));
    };

    private onToggleNavDrawerClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        // Global event for any navigation drawer instance to listen for
        window.dispatchEvent(new CustomEvent('app-toggle-nav-drawer', { bubbles: true, composed: true }));
    };

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
	 * Calculate the percentage for the progress bar based on the current bitrate quality level
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
    private renderMetricItem(metric: IHeaderMetric) {
        const isLarge = this.breakpoint === 'lg';
        const value = this.getMetricValue(metric.key);

        return html`
            <div 
                tabindex="0" 
                aria-label="${metric.label}"
                class="sm-info-item"
                id="${metric.key}Value"
            >
                ${isLarge ? html`
                    <span class="sm-info-item__label">${metric.label}</span>
                ` : html`
                    <igc-icon
                        class="sm-info-item__icon" 
                        name="${metric.iconName}" 
                        collection="${metric.collection}">
                    </igc-icon>
                `}

                ${metric.type === 'progress' ? html`
                    <igc-linear-progress
                            hide-label
                            class="sm-info-item__value sm-info-item__value--progress"
                            value="${this.bitratePercentage}">
                    </igc-linear-progress>
                ` : html`
                    <span class="sm-info-item__value">${value}</span>
                `}
            </div>

            ${metric.key === 'bitrate' ? html`
                <igc-tooltip anchor="${metric.key}Value" with-arrow>
                    Bitrate Quality: ${value} Mbps (${this.qualityInfo.label})
                </igc-tooltip>
            ` : nothing}
        `;
    }

    /**
     * Render the metrics section
     */
    private renderMetrics() {
        return html`
            <div class="sm-header__info">
                ${this.headerMetrics.map(metric => this.renderMetricItem(metric))}
            </div>
        `;
    }


    /**
	 * Render the logo section
	 */
	private renderLogo() {
        const isSmall = this.breakpoint === 'sm';
        return html`
            <div class="sm-header__logo" slot="start">
                ${isSmall ? html`
                    <igc-icon-button
                        class="sm-header__drawer-btn"
                        variant="flat"
                        aria-label="Open navigation"
                        @click=${this.onToggleNavDrawerClick}
                    >
                        <igc-icon name="hamburger" collection="material"></igc-icon>
                    </igc-icon-button>
                ` : null}

                <a href="#">
                    <igc-icon name="smanager" collection="material" class="sm-header__logomark"></igc-icon>
                    <h1 class="sm-header__logo-text">STREAM MANAGER</h1>
                </a>

                <igc-icon-button
                        id="resetBtn"
                        variant="flat"
                        ?disabled=${!this.layoutDirty}
                        @click=${this.onResetAppClick}
                        aria-label="Reset layout">
                    <igc-icon name="reset" collection="material"></igc-icon>
                </igc-icon-button>

                <igc-tooltip anchor="resetBtn" with-arrow>
                    Reset App
                </igc-tooltip>
            </div>
        `;
    }

	/**
	 * Render the header component UI
	 */
    render() {
        const isSmall = this.breakpoint === 'sm';
        return html`
            <igc-navbar class="sm-header">
                ${this.renderLogo()}

                ${!isSmall ? html`
                    ${this.renderMetrics()}
                    <app-navbar-actions slot="end"></app-navbar-actions>
                ` : nothing}

                <igc-avatar tabindex="0" slot="end" src="${profileImage}" shape="circle" name="more_vert">
                    <igc-icon name="user" collection="material"></igc-icon>
                </igc-avatar>
            </igc-navbar>

            ${isSmall ? html`${this.renderMetrics()}` : nothing}
        `;
    }


    static styles = unsafeCSS(styles);
}
