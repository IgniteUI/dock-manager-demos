import { html, LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing';
import './components/action-bar/action-bar.ts';
import './components/navigation/navigation.ts';
import './views/projects-view/projects-view.ts';
import styles from './styles/_layout.scss?inline';
import { registerAppIcons } from './data/icons-registry.ts';

@customElement('app-root')
export default class App extends LitElement {
    private router?: Router;
    private abortController = new AbortController();

    constructor() {
        super();
        registerAppIcons();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        // Abort all listeners added with the controller
        this.abortController.abort();
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
