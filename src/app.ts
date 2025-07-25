import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing';
import { defineComponents, IgcNavbarComponent, IgcNavDrawerComponent } from 'igniteui-webcomponents';
import './components/navigation-drawer/navigation-drawer.ts'
import styles from './styles/_layout.scss?inline';

defineComponents(
	IgcNavbarComponent,
	IgcNavDrawerComponent,
);

import './views/home/home-view.ts';

@customElement('app-root')
export default class App extends LitElement {
	firstUpdated() {
		const outlet = this.shadowRoot?.querySelector('router-outlet');

		const router = new Router(outlet, {
			baseUrl: '/showcase/',
		});

		router.setRoutes(routes);
	}

	render() {
		return html`
			<div class="dm-app-layout">
                <app-navigation-drawer></app-navigation-drawer>
                <router-outlet></router-outlet>
			</div>
		`;
	}

	static styles = unsafeCSS(styles);
}
