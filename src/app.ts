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
    private router?: Router;
    private abortController = new AbortController();

    // Strong typing for the custom event detail
    private static isDownloadEvent(
        e: Event
    ): e is CustomEvent<{ projectPath?: string; version?: 'premium' | 'community' | 'both' }> {
        // Narrow to CustomEvent with an object detail that may contain projectPath/version
        return (
            'detail' in (e as any) &&
            typeof (e as any).detail === 'object' &&
            ((e as any).detail?.projectPath === undefined || typeof (e as any).detail?.projectPath === 'string')
        );
    }

    // Note: parameter is Event to satisfy addEventListener typing for custom events
    private onDownloadRequested = async (evt: Event) => {
        if (!App.isDownloadEvent(evt)) {
            console.warn('download-project fired without expected CustomEvent detail');
            return;
        }
        const event = evt; // narrowed to CustomEvent via type guard above

        // Prevent multiple simultaneous downloads
        if (this.isDownloading) {
            return;
        }

        const { projectPath, version } = event.detail || {};

        const targetProject = projectPath === 'main-app' ? this.getCurrentProjectFromUrl() : projectPath;

        if (!targetProject) {
            this.showDownloadError();
            return;
        }

        this.isDownloading = true;

        try {
            if (version === 'both') {
                await Promise.allSettled([
                    this.downloadService.downloadProject(targetProject, 'premium'),
                    this.downloadService.downloadProject(targetProject, 'community')
                ]);
            } else {
                const success = await this.downloadService.downloadProject(targetProject, version ?? 'premium');
                if (success) {
                }
            }
        } catch (err) {
            console.error('Download failed', err);
        } finally {
            this.isDownloading = false;
        }
    };

    constructor() {
        super();
        registerAppIcons();

        // Listen for download requests dispatched by the app-action-bar component when the download button is clicked
        window.addEventListener('download-project', this.onDownloadRequested, {
            signal: this.abortController.signal
        });
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        // Abort all listeners added with the controller
        this.abortController.abort();
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
            this.router = new Router(outlet);
            this.router.setRoutes(routes);
        } else {
            console.warn('<router-outlet> not found. Router not initialized.');
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
