import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    defineComponents,
    IgcIconComponent,
    IgcLinearProgressComponent,
    IgcTooltipComponent
} from 'igniteui-webcomponents';
import type { IHeaderMetric } from '../../data/header-metric.ts';

defineComponents(IgcIconComponent, IgcLinearProgressComponent, IgcTooltipComponent);

/**
 * Header metric item component.
 * Renders in light DOM to inherit parent styles.
 */
@customElement('app-header-metric-item')
export class AppHeaderMetricItem extends LitElement {
    @property({ type: Object }) metric!: IHeaderMetric;
    @property({ type: Boolean }) isLarge = false;
    @property({ type: String }) value = '';
    @property({ type: Number }) percentage?: number;
    @property({ type: String }) qualityLabel?: string;

    // Use light DOM so header.scss styles apply
    protected createRenderRoot() {
        return this;
    }

    render() {
        const { metric, isLarge, value, percentage, qualityLabel } = this;

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
                            value="${percentage ?? 0}">
                    </igc-linear-progress>
                ` : html`
                    <span class="sm-info-item__value">${value}</span>
                `}
            </div>

            ${metric.key === 'bitrate' ? html`
                <igc-tooltip anchor="${metric.key}Value" with-arrow>
                    Bitrate Quality: ${value} Mbps (${qualityLabel ?? ''})
                </igc-tooltip>
            ` : nothing}
        `;
    }
}
