import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
    defineComponents,
    IgcNavbarComponent,
    IgcIconComponent,
    IgcAvatarComponent,
    IgcTooltipComponent,
    IgcIconButtonComponent,
} from 'igniteui-webcomponents';
import styles from './header.scss?inline';
import profileImage from '../../assets/images/profile.png';
import { Breakpoint, responsiveService } from '../../services/responsive.service.ts';
import '../navbar-actions/navbar-actions.ts';
import '../header-metric-itmes/header-metric-items.ts';

defineComponents(
    IgcNavbarComponent,
    IgcIconComponent,
    IgcAvatarComponent,
    IgcTooltipComponent,
    IgcIconButtonComponent,
);

/**
 * Stream Manager application header component
 * Displays navigation controls; metrics are delegated to app-header-metric-items
 */
@customElement('app-header')
export default class Header extends LitElement {
    @state()
    private layoutDirty = false;

    @state()
    private breakpoint: Breakpoint = responsiveService.current;

    private _unsubscribeBp?: () => void;

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('app-dirty-change', this.onAppDirtyChange as EventListener);
        this._unsubscribeBp = responsiveService.addListener(({ current }) => {
            if (this.breakpoint!==current) {
                this.breakpoint = current;
            }
        });
    }

    disconnectedCallback(): void {
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
        window.dispatchEvent(new CustomEvent('reset-app-request'));
    };

    private onToggleNavDrawerClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('app-toggle-nav-drawer', { bubbles: true, composed: true }));
    };

    private renderLogo() {
        const isSmall = this.breakpoint==='sm';
        return html`
            <div class="sm-header__logo" slot="start">
                ${ isSmall ? html`
                    <igc-icon-button
                        class="sm-header__drawer-btn"
                        variant="flat"
                        aria-label="Open navigation"
                        @click=${ this.onToggleNavDrawerClick }
                    >
                        <igc-icon name="hamburger" collection="material"></igc-icon>
                    </igc-icon-button>
                `: null }

                <a href="#">
                    <igc-icon name="smanager" collection="material" class="sm-header__logomark"></igc-icon>
                    <h1 class="sm-header__logo-text">STREAM MANAGER</h1>
                </a>

                <igc-icon-button
                        id="resetBtn"
                        variant="flat"
                        ?disabled=${ !this.layoutDirty }
                        @click=${ this.onResetAppClick }
                        aria-label="Reset layout">
                    <igc-icon name="reset" collection="material"></igc-icon>
                </igc-icon-button>

                <igc-tooltip anchor="resetBtn" with-arrow>
                    Reset App
                </igc-tooltip>
            </div>
        `;
    }

    render() {
        const isSmall = this.breakpoint==='sm';
        return html`
            <igc-navbar class="sm-header">
                ${ this.renderLogo() }

                ${ !isSmall ? html`
                    <app-header-metric-items></app-header-metric-items>
                    <app-navbar-actions slot="end"></app-navbar-actions>
                `: nothing }

                <igc-avatar tabindex="0" slot="end" src="${ profileImage }" shape="circle" name="more_vert">
                    <igc-icon name="user" collection="material"></igc-icon>
                </igc-avatar>
            </igc-navbar>
        `;
    }

    static styles = unsafeCSS(styles);
}
