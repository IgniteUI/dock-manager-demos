import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
    IgcDockManagerPaneType,
    IgcSplitPaneOrientation,
    IgcDockManagerLayout,
    IgcUnpinnedLocation,
} from '@infragistics/igniteui-dockmanager';

defineCustomElements();

@customElement('app-demo')
export class DemoApp extends LitElement {
    // Define a property for the layout
    @property({ type: Object })
    private dockLayout: IgcDockManagerLayout = this.getDefaultLayout();

    /**
     * Returns the default layout configuration for the dock manager
     */
    private getDefaultLayout(): IgcDockManagerLayout {
        return {
            rootPane: {
                type: IgcDockManagerPaneType.splitPane,
                orientation: IgcSplitPaneOrientation.horizontal,
                panes: [
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 723,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamPreview',
                                header: 'Stream Preview',
                                unpinnedSize: 713,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            }
                        ],
                    },
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 378,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'activityFeed',
                                header: 'Activity Feed',
                                unpinnedSize: 378,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'quickActions',
                                header: 'Quick Actions',
                                unpinnedSize: 378,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamSchedule',
                                header: 'Stream Schedule',
                                isPinned: false,
                                unpinnedSize: 378,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                        ],
                    },
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 378,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamChat',
                                header: 'Stream chat',
                                unpinnedLocation: IgcUnpinnedLocation.right,
                                unpinnedSize: 344,
                            },
                        ],
                    },
                ],
            },
        };
    }

    static styles = css`
        :host {
            display: block;
            min-height: 100dvh;
        }
        
        .wrap {
            padding: 1rem;
        }
        
        igc-dockmanager {
            height: 70vh;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            display: block;
        }
    `;

    render() {
        return html`
            <div class="wrap">
                <h2>Demo Project</h2>
                <p>This is a minimal demo project mounted under /projects/demo.</p>
                <igc-dockmanager id="dockManager" class="app-dock-manager dark-theme" .layout=${ this.dockLayout }></igc-dockmanager>
            </div>
        `;
    }
}
