import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
    defineComponents,
    IgcIconComponent,
    IgcLinearProgressComponent,
    IgcTooltipComponent
} from 'igniteui-webcomponents';
import { Breakpoint, responsiveService } from '../../services/responsive.service.ts';
import { IHeaderMetric, headerMetrics } from '../../data/header-metric.ts';
import { IqualityLevel, qualityLevels } from '../../data/quality-levels.ts';
import styles from './header-metrick-items.scss?inline';

defineComponents(IgcIconComponent, IgcLinearProgressComponent, IgcTooltipComponent);

@customElement('app-header-metric-items')
export class AppHeaderMetricItems extends LitElement {
    // Responsive
    @state()
    private breakpoint: Breakpoint = responsiveService.current;

    private _unsubscribeBp?: () => void;

    // Data source (static config)
    @state()
    private headerMetrics: IHeaderMetric[] = headerMetrics;

    // Live values
    @state()
    private sessionTime = '1:00:00';

    @state()
    private viewers = AppHeaderMetricItems.MIN_VIEWERS;

    @state()
    private followers = 65000;

    @state()
    private bitrate = AppHeaderMetricItems.MIN_BITRATE;

    @state()
    private qualityInfo: IqualityLevel = qualityLevels[0];

    // Internal
    private readonly startTime = Date.now();
    private bitrateDirection = 1;
    private intervals: { [key: string]: number } = {};

    // Constants (copied from previous logic)
    private static readonly MINUTES_LOOP_COUNT = 40;
    private static readonly MIN_VIEWERS = 43000;
    private static readonly MAX_VIEWERS = 175000;
    private static readonly MIN_BITRATE = 29500;
    private static readonly MAX_BITRATE = 60000;
    private static readonly BITRATE_STEP = 2000;
    private static readonly DIRECTION_CHANGE_PROBABILITY = 0.15;

    private readonly timeUpdateInterval = 1000;
    private readonly updateInterval = 2000;
    private readonly bitrateUpdateInterval = 3000;

    connectedCallback(): void {
        super.connectedCallback();
        this.setupTimers();
        this._unsubscribeBp = responsiveService.addListener(({ current }) => {
            if (this.breakpoint !== current) {
                this.breakpoint = current;
                this.requestUpdate();
            }
        });
    }

    disconnectedCallback(): void {
        this.clearTimers();
        if (this._unsubscribeBp) {
            this._unsubscribeBp();
            this._unsubscribeBp = undefined;
        }
        super.disconnectedCallback();
    }

    protected updated(changed: Map<string, unknown>) {
        if (changed.has('bitrate')) {
            this.qualityInfo = this.calculateQualityInfo(this.bitrate);
        }
    }

    // Timers
    private setupTimers(): void {
        this.updateSessionTime();

        this.intervals = {
            sessionTime: window.setInterval(() => this.updateSessionTime(), this.timeUpdateInterval),

            viewers: window.setInterval(() => {
                const inc = Math.floor(Math.random() * 300);
                this.viewers += inc;
                if (this.viewers > AppHeaderMetricItems.MAX_VIEWERS) {
                    this.viewers = AppHeaderMetricItems.MIN_VIEWERS;
                }
            }, this.updateInterval),

            followers: window.setInterval(() => {
                const inc = Math.floor(Math.random() * 500);
                this.followers += inc;
            }, this.updateInterval + 1000),

            bitrate: window.setInterval(() => this.updateBitrate(), this.bitrateUpdateInterval),
        };
    }

    private clearTimers(): void {
        Object.values(this.intervals).forEach(clearInterval);
        this.intervals = {};
    }

    // Calculations
    private updateSessionTime(): void {
        const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const seconds = elapsedSeconds % 60;
        const minutes = Math.floor(elapsedSeconds / 60) % AppHeaderMetricItems.MINUTES_LOOP_COUNT;
        this.sessionTime = `1:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }

    private updateBitrate(): void {
        const randomVariation = Math.floor(Math.random() * 3);
        this.bitrate += (this.bitrateDirection * AppHeaderMetricItems.BITRATE_STEP) + randomVariation;

        if (this.bitrate >= AppHeaderMetricItems.MAX_BITRATE) {
            this.bitrateDirection = -1;
        } else if (this.bitrate <= AppHeaderMetricItems.MIN_BITRATE) {
            this.bitrateDirection = 1;
        }

        if (Math.random() < AppHeaderMetricItems.DIRECTION_CHANGE_PROBABILITY) {
            this.bitrateDirection *= -1;
        }

        this.bitrate = Math.max(
            AppHeaderMetricItems.MIN_BITRATE,
            Math.min(AppHeaderMetricItems.MAX_BITRATE, this.bitrate)
        );
    }

    private calculateQualityInfo(bitrate: number): IqualityLevel {
        for (const level of qualityLevels) {
            if (bitrate >= level.min && bitrate < level.max) {
                return level;
            }
        }
        return qualityLevels[qualityLevels.length - 1];
    }

    private get bitratePercentage(): number {
        const [minPercent, maxPercent] = this.qualityInfo.percentRange;
        const { min, max } = this.qualityInfo;
        const range = max - min;
        if (range === 0) return maxPercent;
        const positionInRange = this.bitrate - min;
        return minPercent + (positionInRange / range) * (maxPercent - minPercent);
    }

    private padZero(num: number): string {
        return num.toString().padStart(2, '0');
    }

    private formatThousands(value: number): string {
        return (value / 1000).toFixed(1) + 'K';
    }

    private getMetricValue(metricKey: string): string {
        switch (metricKey) {
            case 'session':
                return this.sessionTime;
            case 'viewers':
                return this.formatThousands(this.viewers);
            case 'followers':
                return this.formatThousands(this.followers);
            case 'bitrate':
                return (this.bitrate / 1000).toFixed(1);
            default:
                return '';
        }
    }

    // Rendering
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

    render() {
        return html`
      <div class="sm-header__info">
        ${this.headerMetrics.map(metric => this.renderMetricItem(metric))}
      </div>
    `;
    }

    static styles = unsafeCSS(styles);
}
