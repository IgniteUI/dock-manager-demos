// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import '../stream-chat/stream-chat.ts';
import '../stream-preview/stream-preview.ts';
import '../stream-schedule/stream-schedule.ts';
import '../activity-feed/activity-feed.ts';
import '../quick-actions/quick-actions.ts';
import {
	IgcDockManagerPaneType,
	IgcSplitPaneOrientation,
	IgcDockManagerLayout, IgcUnpinnedLocation,
} from '@infragistics/igniteui-dockmanager';
import styles from './dock-manager.scss?inline';

// Initialize the dock manager custom elements
defineCustomElements();

@customElement('app-dock-manager')
export default class AppDockManager extends LitElement {
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

	render() {
		return html`
            <igc-dockmanager id="dockManager" class="app-dock-manager" .layout=${ this.dockLayout }>
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
                    <div class="temporary">
                        Chat component coming soon
                    </div>
<!--                    <app-stream-chat></app-stream-chat>-->
                </div>
            </igc-dockmanager>
		`;
	}

	static styles = unsafeCSS(styles);
}
