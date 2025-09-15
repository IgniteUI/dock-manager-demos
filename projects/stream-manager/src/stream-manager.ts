import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/navigation-drawer/navigation-drawer.ts';
import './components/dock-manager/dock-manager.ts';
import './components/header/header.ts';
import { registerAppIcons } from './data/icons-registry.ts';
import styles from './stream-manager.scss?inline';
import { Breakpoint, responsiveService } from './services/responsive.service.ts';
import './components/navbar-actions/navbar-actions.ts';
import './components/header-metric-itmes/header-metric-items.ts';

@customElement('app-stream-manager')
export default class StreamManager extends LitElement {
    @state()
    private breakpoint: Breakpoint = responsiveService.current;

    private unsubscribeBp?: () => void;

    constructor() {
		super();
		registerAppIcons();
	}

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

    render() {
        const isSmall = this.breakpoint === 'sm';

        return html`
            <app-header></app-header>

            <main class="sm-main">
                
                ${isSmall ? html`
                    <app-header-metric-items></app-header-metric-items>
                ` : null }
                
                <app-navigation-drawer></app-navigation-drawer>
                <app-dock-manager></app-dock-manager>
            </main>

            ${isSmall ? html`
                <!-- Render actions outside the header on mobile -->
                <app-navbar-actions></app-navbar-actions>
            ` : null }
        `;
    }

	static styles = unsafeCSS(styles);
}
