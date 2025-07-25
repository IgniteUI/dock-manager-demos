import { LitElement, html, unsafeCSS } from 'lit';

import {
	defineComponents,
	IgcNavDrawerComponent,
	IgcNavDrawerItemComponent,
	IgcIconComponent,
	IgcIconButtonComponent
} from 'igniteui-webcomponents';

import { customElement, property, state } from 'lit/decorators.js';
import styles from './navigation-drawer.scss?inline';
import { IsampleItem, sampleItems } from '../../views/data/samples-navigation.ts';
import { Router } from '@vaadin/router';

defineComponents(
	IgcNavDrawerComponent,
	IgcNavDrawerItemComponent,
	IgcIconComponent,
	IgcIconButtonComponent,
);

@customElement('app-navigation-drawer')
export default class NavigationDrawer extends LitElement {
	@property({ type: Array })
	items: IsampleItem[] = sampleItems;

	/**
	 * The active route path - used to determine which item should be active
	 */
	@property({ type: String })
	activePath: string = '/home/stream-manager';

	@state()
	open = true;

	private handleNavigation(route: string | undefined, e: Event) {
		e.preventDefault();
		if (route) {
			this.activePath = route;
			Router.go(route);
		}
	}

	render() {
		return html`
            <igc-nav-drawer
                .open=${this.open}
                position="relative"
            >
                <igc-nav-drawer-header-item>
                    Sample Drawer
                </igc-nav-drawer-header-item>

                ${this.items.map(item => html`
                    <igc-nav-drawer-item 
                        ?active=${item.route === this.activePath}
                        @click=${(e: Event) => this.handleNavigation(item.route, e)}
                    >
                        <igc-icon
                            slot="icon" name="${item.icon}"
                            collection="${item.collection || 'material'}">
                        </igc-icon>
                        <span slot="content">${item.label}</span>
                    </igc-nav-drawer-item>
                `)}


                <igc-nav-drawer-item>
                    <igc-icon slot="icon" name="search"></igc-icon>
                    <span slot="content">Search</span>
                </igc-nav-drawer-item>
            </igc-nav-drawer>
		`;
	}

	static styles = unsafeCSS(styles);
}
