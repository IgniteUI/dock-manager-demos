// dock-manager.ts
import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineCustomElements } from 'igniteui-dockmanager/loader';
import {
	defineComponents, IgcSwitchComponent, IgcIconComponent,
} from 'igniteui-webcomponents';
import styles from './quick-actions.scss?inline';
import { IQuickAction, quickActions } from '../../data/quick-actions.ts';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(IgcSwitchComponent, IgcIconComponent);

@customElement('app-quick-actions')
export default class QuickActions extends LitElement {
	@state()
	private actions: IQuickAction[] = quickActions;

	render() {
		return html`
            <div class="sm-quick-actions">
                ${ this.actions.map(action => html`
                    <a href="#" class="sm-quick-actions-item" tabindex="${action.toggle ? -1 : nothing}">
                        <igc-icon class="sm-quick-actions-item__icon" name="${ action.icon }"
                                  collection="material"></igc-icon>
                        ${ action.label && !action.toggle ? html`
                            <span class="sm-quick-actions-item__label">${ action.label }</span>
                        `: nothing }

                        ${ action.toggle ? html`
                            <igc-switch class="sm-quick-actions-item__switch">
                                ${ action.label }
                            </igc-switch>`: nothing }
                    </a>
                `)}
            </div>
		`;
	}

	static styles = unsafeCSS(styles);
}
