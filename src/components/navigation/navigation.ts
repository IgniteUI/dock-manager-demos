import { LitElement, html, unsafeCSS } from 'lit';

import {
	defineComponents,
	IgcNavDrawerComponent,
	IgcNavDrawerItemComponent,
	IgcIconComponent,
	IgcIconButtonComponent
} from 'igniteui-webcomponents';

import { customElement, property, state } from 'lit/decorators.js';
import styles from './navigation.scss?inline';
import { IsampleItem, sampleItems } from '../../data/samples-navigation.ts';
import { Router } from '@vaadin/router';

defineComponents(
	IgcNavDrawerComponent,
	IgcNavDrawerItemComponent,
	IgcIconComponent,
	IgcIconButtonComponent,
);

@customElement('app-navigation')
export default class Navigation extends LitElement {
    @property({ type: Array })
    items: IsampleItem[] = sampleItems;

    /**
     * The active route path - used to determine which item should be active
     */
    @property({ type: String })
    activePath: string = '/';

    @state()
    open = false;

    constructor() {
        super();
        this.activePath = window.location.pathname;
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('toggle-drawer', this.handleToggleDrawer.bind(this));
        // Keep menu highlight in sync when navigation happens elsewhere (back/forward, deep links)
        window.addEventListener('vaadin-router-location-changed', this.syncActivePath);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('toggle-drawer', this.handleToggleDrawer.bind(this));
        window.removeEventListener('vaadin-router-location-changed', this.syncActivePath);
    }

    private syncActivePath = () => {
        this.activePath = window.location.pathname;
        this.requestUpdate();
    };

    private handleToggleDrawer() {
        this.open = !this.open;
    }

    private handleNavigation(route: string | undefined, e: Event) {
        e.preventDefault();
        if (route) {
            this.activePath = route;
            // Once an item is clicked, navigate and close the drawer
            this.open = false;
            Router.go(route);
        }
    }

    render() {
        return html`
            <igc-nav-drawer
                    class="dm-navigation-drawer"
                    .open=${this.open}
            >
                <igc-nav-drawer-header-item class="dm-navigation-drawer__header">
                    <span class="dm-navigation-drawer__header-title">Demos</span>
                    <igc-icon-button
                            aria-label="Close navigation"
                            title="Close the navigation"
                            variant="flat"
                            @click=${() => this.open = false}>
                        <igc-icon name="close" collection="material"></igc-icon>
                    </igc-icon-button>
                </igc-nav-drawer-header-item>

                ${this.items.map(item => html`
                    <igc-nav-drawer-item
                            ?active=${ this.activePath === item.route || this.activePath.startsWith(item.route + '/') }
                            @click=${ (e: Event) => this.handleNavigation(item.route, e)}>
                        <igc-icon
                                slot="icon" name="${item.icon}"
                                collection="${item.collection || 'material'}">
                        </igc-icon>
                        <span slot="content">${item.label}</span>
                    </igc-nav-drawer-item>
                `)}
            </igc-nav-drawer>
        `;
    }
    static styles = unsafeCSS(styles);

}
