import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router, RouterLocation } from '@vaadin/router';
import '../../components/project-iframe/project-iframe.ts';
import styles from './projects-view.scss?inline';
import { ProjectConfig, projects } from '../../project-config.ts';

@customElement('projects-view')
export class ProjectsView extends LitElement {
	@state()
	private _projectId = '';

	@state()
	private _loading = true;

	@state()
	private _error = '';

	@state()
	private _currentProject: ProjectConfig | null = null;

	/**
	 * Vaadin Router lifecycle hooks - called before entering a route
	 */
    async onBeforeEnter(location: RouterLocation) {
        // Handle both root route and project routes
        const projectName = location.params.projectName as string;

        // If no projectName (root route), redirect to Stream Manager explicitly
        if (!projectName) {
            Router.go('/projects/stream-manager');
            return;
        }

        this._projectId = projectName;

        if (!this._projectId) {
            this._error = 'No projects available';
            this._loading = false;
            return;
        }

        this._currentProject = projects.find(p => p.id === this._projectId) || null;

        if (!this._currentProject) {
            this._error = `Project "${this._projectId}" not found`;
            this._loading = false;
            return;
        }

        // Update action bar
        const actionBar = document.querySelector('app-action-bar') as any;
        if (actionBar) {
            actionBar.currentProject = this._projectId;
        }

        // No need to dynamically load - iframe will handle it
        this._loading = false;
    }

    onBeforeLeave() {
        const actionBar = document.querySelector('app-action-bar') as any;
        if (actionBar) {
            actionBar.currentProject = '';
        }
    }

    render() {
        if (this._loading) {
            return html`
                <div class="loading">Loading ${this._projectId}...</div>
            `;
        }

        if (this._error) {
            return html`<div class="error">${this._error}</div>`;
        }

        if (!this._currentProject) {
            return html`<div class="error">Project not found</div>`;
        }

        return html`
            <project-iframe
                    .projectPath="${this._projectId}"
                    .projectName="${this._currentProject.name}">
            </project-iframe>
        `;
    }

    static styles = unsafeCSS(styles);

}
