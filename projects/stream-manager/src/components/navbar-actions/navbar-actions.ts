import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
    defineComponents,
    IgcInputComponent,
    IgcIconComponent,
    IgcBadgeComponent,
} from 'igniteui-webcomponents';
import styles from './navbar-actions.scss?inline';
import { InavbarAction, navbarActions } from '../../data/navbar-actions.ts';
import { Breakpoint, responsiveService } from '../../services/responsive.service.ts';

defineComponents(IgcInputComponent, IgcIconComponent, IgcBadgeComponent);

@customElement('app-navbar-actions')
export default class NavbarActions extends LitElement {
    @state()
    private breakpoint: Breakpoint = responsiveService.current;

    @state()
    private navbarActions: InavbarAction[] = navbarActions;

    private unsubscribeBp?: () => void;

    connectedCallback(): void {
        super.connectedCallback?.();
        this.unsubscribeBp = responsiveService.addListener(({ current }) => {
            if (this.breakpoint !== current) {
                this.breakpoint = current;
                this.requestUpdate();
            }
        });
    }

    disconnectedCallback(): void {
        if (this.unsubscribeBp) {
            this.unsubscribeBp();
            this.unsubscribeBp = undefined;
        }
        super.disconnectedCallback?.();
    }

    // Decide visibility per action based on breakpoint and isMobile flag
    private shouldShow(action: InavbarAction): boolean {
        const isMobileView = this.breakpoint === 'sm';
        if (action.isMobile === true) return isMobileView;
        if (action.isMobile === false) return !isMobileView;
        return true;
    }

    /**
     * Render the search input or icon based on breakpoint
     */
    private renderSearch() {
        const isMedium = this.breakpoint === 'lg' || this.breakpoint === 'md';

        return isMedium ? html`
            <igc-input type="search" placeholder="Search">
                <igc-icon slot="prefix" name="search" collection="material"></igc-icon>
            </igc-input>
        ` : html`
            <a class="sm-actions__action" href="#" aria-label="Search">
                <igc-icon name="search" collection="material"></igc-icon>
            </a>
        `;
    }

    /**
     * Render the navigation icons
     */
    private renderNavigation() {
        return html`
            ${repeat(
                    this.navbarActions.filter(a => this.shouldShow(a)),
                    action => action.name,
                    action => html`
                    <span class="sm-actions__action">
                        ${action.badge ? html`
                            <igc-badge class="sm-actions__badge">${action.badgeCount}</igc-badge>
                        ` : null}
                        <a href="#" aria-label="${action.label}">
                            <igc-icon name="${action.name}" collection="${action.collection}"></igc-icon>
                        </a>
                    </span>
                `
            )}
        `;
    }


    render() {
        const isSmall = this.breakpoint === 'sm';
        return html`
            <nav class="sm-actions">
                ${isSmall ? html`
                    <igc-icon class="sm-actions__action sm-actions__action--active" name="home" collection="material"></igc-icon>
                ` : nothing}

                ${this.renderSearch()}
                ${this.renderNavigation()}
            </nav>
        `;
    }


    static styles = unsafeCSS(styles);
}
