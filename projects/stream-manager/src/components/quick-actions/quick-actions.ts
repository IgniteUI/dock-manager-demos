// dock-manager.ts
import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineCustomElements } from 'igniteui-dockmanager/loader';
import {
    defineComponents, IgcSwitchComponent, IgcIconComponent, IgcDialogComponent, IgcTabsComponent, IgcCardComponent,
} from 'igniteui-webcomponents';
import styles from './quick-actions.scss?inline';
import { ActionCategory, actionsCategory, IQuickAction, quickActions } from '../../data/quick-actions.ts';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(IgcSwitchComponent, IgcIconComponent, IgcDialogComponent, IgcTabsComponent, IgcCardComponent);

@customElement('app-quick-actions')
export default class QuickActions extends LitElement {
	@state()
	private actions: IQuickAction[] = quickActions;

    private onAddClick = (e: Event) => {
        e.preventDefault();
        const dialog = this.renderRoot.querySelector('igc-dialog') as IgcDialogComponent | null;
        dialog?.show();
    };

    private onCancelClick = (e: Event) => {
        e.preventDefault();
        const dialog = this.renderRoot.querySelector('igc-dialog') as IgcDialogComponent | null;
        dialog?.hide();
    };

    // Remove from main pane: set added = false
    private handleRemove = (e: Event, actionKey: string) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = this.actions.findIndex(a => a.actionKey === actionKey);
        if (idx === -1) return;
        const updated = [...this.actions];
        updated[idx] = { ...updated[idx], added: false };
        this.actions = updated;
    };

    // Add from the dialog: set added = true
    private handleAdd = (e: Event, actionKey: string) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = this.actions.findIndex(a => a.actionKey === actionKey);
        if (idx === -1) return;
        if (this.actions[idx].added) return; // already added
        const updated = [...this.actions];
        updated[idx] = { ...updated[idx], added: true };
        this.actions = updated;
    };


    render() {
        return html`
            <div class="sm-quick-actions">
                ${ this.actions
                .filter(action => action.added)
                .map(action => html`
                    <a href="#" class="sm-quick-actions-item" tabindex="${action.toggle ? -1 : nothing}">
                        <igc-icon 
                            class="sm-quick-actions-item__icon" 
                            name="${ action.icon }"
                            collection="material"
                        ></igc-icon>
                        ${ action.label && !action.toggle ? html`
                            <span class="sm-quick-actions-item__label">${ action.label }</span>
                        `: nothing }

                        ${ action.toggle ? html`
                            <igc-switch class="sm-quick-actions-item__switch">
                                ${ action.label }
                            </igc-switch>`: nothing }
                        <igc-icon-button
                                class="sm-quick-actions-item__action-btn"
                                variant="contained"
                                title="Remove action"
                                @click=${(e: Event) => this.handleRemove(e, action.actionKey)}
                        >
                            <igc-icon name="remove" collection="material"></igc-icon>
                        </igc-icon-button>
                    </a>
                `)}

                <a href="#" class="sm-quick-actions-item sm-quick-actions-item--add" @click=${this.onAddClick}>
                    <igc-icon class="sm-quick-actions-item__icon" name="add-new" collection="material"></igc-icon>
                </a>
            </div>
            <igc-dialog id="dialog" hide-default-action close-on-outside-click>
                <div slot="title">
                    Manage Quick Actions

                    <igc-icon-button class="sm-quick-actions__close-dialog" @click=${this.onCancelClick} variant="flat">
                        <igc-icon name="remove" collection="material"></igc-icon>
                    </igc-icon-button>
                </div>
                <igc-tabs>
                    ${ Object.entries(actionsCategory).map(([catKey, meta]) => {
                        const key = catKey as ActionCategory;
                        const categoryActions = this.actions.filter(a => a.category === key && a.visibility);

                        return html`
                            <igc-tab>
                                <igc-icon slot="prefix" name="${ meta.icon }" collection="material"></igc-icon>
                                <span slot="label">
                                    ${ meta.label }
                                </span>
                                <div class="sm-quick-actions__tab">
                                    <p class="sm-quick-actions__description">${ meta.description }</p>

                                    <div class="sm-quick-actions__grid">
                                        ${ categoryActions.length
                                            ? categoryActions.map(a => html`
                                                    <igc-card>
                                                        <igc-card-content>
                                                            <a href="#" class="sm-quick-actions-item"
                                                               tabindex="${ a.toggle ? -1: nothing }">
                                                                <igc-icon class="sm-quick-actions-item__icon" name="${ a.icon }"
                                                                          collection="material"></igc-icon>
                                                                ${ a.label && !a.toggle ? html`
                                                                <span class="sm-quick-actions-item__label">${ a.label }</span>
                                                            `: nothing }
                                                                ${ a.toggle ? html`
                                                                <igc-switch class="sm-quick-actions-item__switch">
                                                                    ${ a.label }
                                                                </igc-switch>`: nothing }
                                                            </a>

                                                            <p class="sm-quick-action__description">
                                                                ${a.description}
                                                            </p>
                                                        </igc-card-content>

                                                        <igc-card-actions>
                                                            <igc-button
                                                                slot="end"
                                                                class="sm-quick-actions-item__dialog-action-btn"
                                                                variant="outlined"
                                                                title="${ a.added ? 'Remove action': 'Add action' }"
                                                                @click=${ (e: Event) => a.added
                                                                        ? this.handleRemove(e, a.actionKey)
                                                                        : this.handleAdd(e, a.actionKey)
                                                                }
                                                            >
                                                               
                                                                <igc-icon name="${!a.added ? 'add-new': 'remove' }" collection="material"></igc-icon>
                                                                ${ a.added ? 'Remove': 'Add' }
                                                            </igc-button>
                                                        </igc-card-actions>
                                                    </igc-card>
                                                `)
                                            : html`<span class="sm-quick-actions__empty">No actions in this category.</span>`
                                        }
                                    </div>
                                </div>
                            </igc-tab>
                        `;
                    })}
                </igc-tabs>
            </igc-dialog>
        `;
    }

    static styles = unsafeCSS(styles);
}
