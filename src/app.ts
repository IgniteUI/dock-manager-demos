import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing';
import './components/action-bar/action-bar.ts';
import './components/navigation/navigation.ts';
import './views/projects-view/projects-view.ts';
import styles from './styles/_layout.scss?inline';
import { registerAppIcons } from './data/icons-registry.ts';
import { DownloadService } from './services/download-service.ts';

@customElement('app-root')
export default class App extends LitElement {
	private downloadService = new DownloadService();
	private isDownloading = false;

	constructor() {
		super();
		registerAppIcons();

		// Listen for download requests dispatched by the app-action-bar component when the download button is clicked
		window.addEventListener('download-project', this.onDownloadRequested.bind(this));
	}

	private async onDownloadRequested(event: Event): Promise<void> {
		// Prevent multiple simultaneous downloads
		if (this.isDownloading) {
			console.log('Download already in progress, ignoring');
			return;
		}

		console.log('onDownloadRequested called', event);

		const { projectPath, version } = (event as CustomEvent).detail || {};
		console.log('Event detail:', { projectPath, version });

		const targetProject = projectPath === 'main-app' ? this.getCurrentProjectFromUrl() : projectPath;
		console.log('Target project determined:', targetProject);
		console.log('Current URL:', window.location.pathname);

		if (targetProject) {
			console.log(`Download requested for project: ${targetProject}, version: ${version || 'premium'}`);

			this.isDownloading = true; // Set flag

			try {
				const success = await this.downloadService.downloadProject(targetProject, version || 'premium');

				if (success) {
					if (version === 'both') {
						console.log('Both versions downloaded successfully');
					} else {
						console.log(`${version} version downloaded successfully`);
					}
				}
			} finally {
				this.isDownloading = false; // Reset flag
			}
		} else {
			this.showDownloadError();
		}
	}

	private getCurrentProjectFromUrl(): string | null {
		const pathname = window.location.pathname;

		// Works for: /projects/stream-manager, /my-app/projects/stream-manager, etc.
		const pathMatch = pathname.match(/\/projects\/([^\/]+)/);
		return pathMatch?.[1] || null;
	}

	private showDownloadError(): void {
		console.error('Could not determine which project to download');
		alert('Could not determine which project to download');
	}

	// Required for Vaadin Router to work with light DOM
	createRenderRoot() {
		return this;
	}

	firstUpdated() {
		this.initializeRouter();
	}

	private initializeRouter(): void {
		const outlet = document.querySelector('router-outlet');
		if (outlet) {
			new Router(outlet).setRoutes(routes);
		}
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
