// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defineCustomElements } from 'igniteui-dockmanager/loader';
import '../stream-chat/stream-chat.ts';
import '../stream-preview/stream-preview.ts';
import '../stream-schedule/stream-schedule.ts';
import '../activity-feed/activity-feed.ts';
import '../quick-actions/quick-actions.ts';
import {
	IgcDockManagerPaneType,
	IgcSplitPaneOrientation,
	IgcDockManagerLayout,
	IgcUnpinnedLocation,
} from 'igniteui-dockmanager';
import styles from './dock-manager.scss?inline';

// Initialize the dock manager custom elements
defineCustomElements();

@customElement('app-dock-manager')
export default class AppDockManager extends LitElement {
	// Define a property for the layout
	@property({ type: Object })
	private dockLayout: IgcDockManagerLayout = this.getDefaultLayout();

    // Marks when the initial dock layout pass is done
    private layoutInitialized = false;

    // Suppress the next layoutChange that fires immediately after a programmatic reset
    private ignoreNextLayoutChange = false;

    private onPaneClose = () => {
        if (!this.layoutInitialized) return;
        this.dispatchEvent(new CustomEvent('layout-dirty-change', {
            detail: { dirty: true },
            bubbles: true,
            composed: true
        }));

    };

    private onLayoutChange = () => {
        if (!this.layoutInitialized) return;
        if (this.ignoreNextLayoutChange) {
            this.ignoreNextLayoutChange = false;
            return;
        }
        this.dispatchEvent(new CustomEvent('layout-dirty-change', {
            detail: { dirty: true },
            bubbles: true,
            composed: true
        }));
    };


    public resetLayout = () => {
        this.ignoreNextLayoutChange = true;
        this.dockLayout = this.getDefaultLayout();
        this.dispatchEvent(new CustomEvent('layout-dirty-change', {
            detail: { dirty: false },
            bubbles: true,
            composed: true
        }));
        // the layout remains initialized; only the immediate programmatic change is ignored
    };



    protected firstUpdated() {
        const dm = this.renderRoot.querySelector('igc-dockmanager') as HTMLElement | null;
        if (!dm) return;

        dm.addEventListener('paneClose', this.onPaneClose as EventListener);
        dm.addEventListener('paneClosed', this.onPaneClose as EventListener);

        // Consume the very first layoutChange (initialization) once, then attach the real handler.
        const initHandler = () => {
            this.layoutInitialized = true;
            dm.addEventListener('layoutChange', this.onLayoutChange as EventListener);

            // Ensure consumers start with a known state: not dirty
            this.dispatchEvent(new CustomEvent('layout-dirty-change', {
                detail: { dirty: false },
                bubbles: true,
                composed: true
            }));
        };
        dm.addEventListener('layoutChange', initHandler as EventListener, { once: true });

        // Listen for global reset requests (cross-shadow-safe)
        window.addEventListener('reset-layout-request', this.resetLayout as EventListener);
    }

    public disconnectedCallback() {
        window.removeEventListener('reset-layout-request', this.resetLayout as EventListener);
    }

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

	render() {
		return html`
            <igc-dockmanager id="dockManager" class="app-dock-manager dark-theme" .layout=${ this.dockLayout }>
                <div slot="streamPreview">
                    <app-stream-preview></app-stream-preview>
                </div>
                <div slot="activityFeed">
                    <app-activity-feed></app-activity-feed>
                </div>
                <div slot="streamSchedule">
                    <app-stream-schedule></app-stream-schedule>
                </div>
                <div slot="quickActions">
                    <app-quick-actions></app-quick-actions>
                </div>
                <div slot="streamChat">
                    <app-stream-chat></app-stream-chat>
                </div>
            </igc-dockmanager>
        `;
	}

	static styles = unsafeCSS(styles);
}
