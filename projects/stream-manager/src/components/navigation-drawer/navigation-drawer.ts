import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import {
	defineComponents,
	IgcNavDrawerComponent,
	IgcIconComponent,
	IgcNavDrawerItemComponent,
} from 'igniteui-webcomponents';

import { navigationItems, INavItem } from '../../data/navigation-items.ts';
import styles from './navigation-drawer.scss?inline';

defineComponents(
	IgcNavDrawerComponent,
	IgcIconComponent,
	IgcNavDrawerItemComponent,
);

@customElement('app-navigation-drawer')
export default class NavigationDrawer extends LitElement {
	@query('igc-nav-drawer')
	private navDrawer!: IgcNavDrawerComponent;

	@property({ type: Array })
	items: INavItem[] = navigationItems;

	/**
	 * The active route path - used to determine which item should be active
	 */
	@property({ type: String })
	activePath: string = '/stream';

	@state()
	open = false;

	private toggleNavDrawer() {
		if (this.navDrawer) {
			this.open = !this.open;
			this.navDrawer.open = this.open;
			this.requestUpdate();
		}
	}

	render() {
		return html`
            <igc-nav-drawer
                    .open=${ this.open }
                    position="relative"
                    class="sm-nav"
            >
                <igc-nav-drawer-header-item 
	                class="sm-nav__header-item sm-nav__header-item--toggle"
                    @click=${ (e: Event) => {
                        e.stopPropagation();
                        this.toggleNavDrawer();
                    }}
                >
                    <span>DASHBOARD</span>
                    <igc-icon
                        class="sm-menu-toggle-button"
                        name="back"
                        collection="material"
                    ></igc-icon>
                </igc-nav-drawer-header-item>

                ${ this.items.map(item => html`
                    <igc-nav-drawer-item ?active=${ item.route===this.activePath }>
                        <igc-icon
                            slot="icon" name="${ item.icon }"
                            collection="${ item.collection }">
                        </igc-icon>
                        <span slot="content">${ item.label }</span>
                    </igc-nav-drawer-item>
                `) }

                <div slot="mini">
                    <igc-nav-drawer-header-item
	                    class="sm-nav__header-item sm-nav__header-item--toggle"
                        @click=${ (e: Event) => {
                            e.stopPropagation();
                            this.toggleNavDrawer();
                        } }
                    >
                        <igc-icon
                                class="sm-menu-toggle-button"
                                name="forward"
                                collection="material"
                        ></igc-icon>
                    </igc-nav-drawer-header-item>
                    ${ this.items.map(item => html`
                        <igc-nav-drawer-item
                                ?active=${ item.route===this.activePath }
                        >
                            <igc-icon
                                    slot="icon" name="${ item.icon }"
                                    collection="${ item.collection }">
                            </igc-icon>
                        </igc-nav-drawer-item>
                    `) }
                </div>
            </igc-nav-drawer>
		`;
	}

	static styles = unsafeCSS(styles);
}
