import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing';
import './components/action-bar/action-bar.ts'
import './components/navigation/navigation.ts'
import './views/stream-manager/stream-manager-view.ts'
import styles from './styles/_layout.scss?inline';
import { registerAppIcons } from './data/icons-registry.ts';
import { DownloadService } from './services/download-service.ts';

@customElement('app-root')
export default class App extends LitElement {
	constructor() {
		super();
		registerAppIcons();
		window.addEventListener('download-current-app', this.handleDownloadApp.bind(this));
	}

	private handleDownloadApp() {
		// Get the current view/project name
		const currentView = this.getCurrentViewName();
		if (currentView) {
			const downloadService = new DownloadService();
			downloadService.downloadProject(currentView);
		} else {
			console.error('Could not determine current view');
			alert('Could not determine which project to download');
		}
	}

	private getCurrentViewName(): string | null {
		// Get the current route/URL to determine which view is active
		const path = window.location.pathname;

		// Extract the project name from the path
		// This implementation depends on your routing structure
		// Example: if URL is /stream-manager, return 'stream-manager'
		const matches = path.match(/\/([^\/]+)$/);
		if (matches && matches[1]) {
			return matches[1];
		}

		// Fallback to checking for iframes
		const iframes = document.querySelectorAll('iframe');
		for (const iframe of Array.from(iframes)) {
			const src = iframe.getAttribute('src');
			if (src) {
				const projectMatch = src.match(/projects\/([^\/]+)/);
				if (projectMatch && projectMatch[1]) {
					return projectMatch[1];
				}
			}
		}

		return null;
	}

	createRenderRoot() {
		return this; // <- 🔥 critical for routing to work
	}

	firstUpdated() {
		const outlet = document.querySelector('router-outlet'); // light DOM now
		const router = new Router(outlet);
		router.setRoutes(routes);
	}

	render() {
		return html`
			<div class="dm-app-layout">
				<app-action-bar></app-action-bar>
                <app-navigation></app-navigation>
                <router-outlet></router-outlet>
			</div>
		`;
	}

	static styles = unsafeCSS(styles);
}
