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
import {
    Breakpoint,
    responsiveService,
} from '../../services/responsive.service.ts';

// Initialize the dock manager custom elements
defineCustomElements();

@customElement('app-dock-manager')
export default class AppDockManager extends LitElement {
    // Define a property for the layout
    @property({ type: Object })
    private dockLayout!: IgcDockManagerLayout;

    // Keep a counter for programmatic layout updates.
    // Each time we set the layout programmatically, increment this; consume on layoutChange.
    private suppressLayoutChangeCount = 0;

    // Track the current breakpoint from the unified responsive service
    private currentBreakpoint: Breakpoint = responsiveService.current;

    private unsubscribeBp?: () => void;

    private onPaneClose = () => {
        this.dispatchEvent(new CustomEvent('app-dirty-change', {
            detail: { dirty: true },
            bubbles: true,
            composed: true
        }));
    };

    private onLayoutChange = () => {
        // Consume programmatic layout changes first
        if (this.suppressLayoutChangeCount > 0) {
            this.suppressLayoutChangeCount -= 1;
            return;
        }

        // Any other layout change is user-driven (resize, move, pin/unpin, etc.)
        this.dispatchEvent(new CustomEvent('app-dirty-change', {
            detail: { dirty: true },
            bubbles: true,
            composed: true
        }));
    };

    public resetLayout = () => {
        // Programmatic change -> expect one layoutChange
        this.suppressLayoutChangeCount += 1;
        this.dockLayout = this.getDefaultLayout();

        this.dispatchEvent(new CustomEvent('app-dirty-change', {
            detail: { dirty: false },
            bubbles: true,
            composed: true
        }));
    };

    protected async firstUpdated() {
        const dm = this.renderRoot.querySelector('igc-dockmanager') as HTMLElement | null;
        if (!dm) return;

        dm.addEventListener('paneClose', this.onPaneClose as EventListener);
        dm.addEventListener('paneClosed', this.onPaneClose as EventListener);

        // Listen to layoutChange exactly once here
        dm.addEventListener('layoutChange', this.onLayoutChange as EventListener);
    }

    private getDefaultLayout(): IgcDockManagerLayout {
        const bp = this.currentBreakpoint ?? responsiveService.current;
        switch (bp) {
            case 'lg':
                return this.getLargeLayout();
            case 'md':
                return this.getMediumLayout();
            case 'sm':
            default:
                return this.getSmallLayout();
        }
    }

    private getLargeLayout(): IgcDockManagerLayout {
        return {
            rootPane: {
                type: IgcDockManagerPaneType.splitPane,
                orientation: IgcSplitPaneOrientation.horizontal,
                panes: [
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 729,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamPreview',
                                header: 'Stream Preview',
                                unpinnedSize: 700,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            }
                        ],
                    },
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 400,
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
                                unpinnedSize: 400,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamSchedule',
                                header: 'Stream Schedule',
                                unpinnedSize: 330,
                                isPinned: false,
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

    private getMediumLayout(): IgcDockManagerLayout {
        return {
            rootPane: {
                type: IgcDockManagerPaneType.splitPane,
                orientation: IgcSplitPaneOrientation.horizontal,
                panes: [
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 700,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamPreview',
                                header: 'Stream Preview',
                                unpinnedLocation: IgcUnpinnedLocation.right,
                                size: 500
                            },
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'quickActions', header: 'Quick Actions',
                                unpinnedLocation: IgcUnpinnedLocation.right,
                                size: 200
                            },
                        ],
                    },
                    {
                        type: IgcDockManagerPaneType.splitPane,
                        orientation: IgcSplitPaneOrientation.vertical,
                        size: 420,
                        panes: [
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamChat', header: 'Stream chat',
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'activityFeed', header: 'Activity Feed',
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                            {
                                type: IgcDockManagerPaneType.contentPane,
                                contentId: 'streamSchedule',
                                header: 'Stream Schedule',
                                isPinned: false,
                                unpinnedSize: 290,
                                unpinnedLocation: IgcUnpinnedLocation.right
                            },
                        ],
                    },
                ],
            },
        };
    }

    private getSmallLayout(): IgcDockManagerLayout {
        return {
            rootPane: {
                type: IgcDockManagerPaneType.splitPane,
                orientation: IgcSplitPaneOrientation.vertical,
                floatingResizable: false,
                allowEmpty: false,
                useFixedSize: true,
                panes: [
                    {
                        allowMaximize: false,
                        allowPinning: false,
                        allowFloating: false,
                        allowDocking: false,
                        type: IgcDockManagerPaneType.contentPane,
                        contentId: 'streamPreview',
                        header: 'Stream Preview',
                        unpinnedLocation: IgcUnpinnedLocation.right,
                        size: 520
                    },
                    {
                        allowMaximize: false,
                        allowPinning: false,
                        allowFloating: false,
                        allowDocking: false,
                        type: IgcDockManagerPaneType.contentPane,
                        contentId: 'streamChat',
                        header: 'Stream Chat',
                        unpinnedLocation: IgcUnpinnedLocation.right,
                        size: 400
                    },
                    {
                        allowMaximize: false,
                        allowPinning: false,
                        allowFloating: false,
                        allowDocking: false,
                        type: IgcDockManagerPaneType.contentPane,
                        contentId: 'activityFeed',
                        header: 'Activity Feed',
                        unpinnedLocation: IgcUnpinnedLocation.right,
                        size: 470
                    },
                    {
                        allowMaximize: false,
                        allowPinning: false,
                        allowFloating: false,
                        allowDocking: false,
                        type: IgcDockManagerPaneType.contentPane,
                        contentId: 'quickActions',
                        header: 'Quick Actions',
                        unpinnedLocation: IgcUnpinnedLocation.right,
                        size: 410
                    },
                    {
                        allowMaximize: false,
                        allowPinning: false,
                        allowFloating: false,
                        allowDocking: false,
                        type: IgcDockManagerPaneType.contentPane,
                        contentId: 'streamSchedule',
                        header: 'Stream Schedule',
                        unpinnedSize: 290,
                        unpinnedLocation: IgcUnpinnedLocation.right,
                        size: 420
                    },
                ],
            },
        };
    }

    connectedCallback(): void {
        super.connectedCallback?.();
        // Subscribe to viewport-only changes
        this.currentBreakpoint = responsiveService.current;
        this.unsubscribeBp = responsiveService.addListener(({ current }: { current: Breakpoint }) => {
            if (current === this.currentBreakpoint) return;
            this.currentBreakpoint = current;
            this.applyResponsiveLayout();
        });

        // Initial baseline BEFORE first render
        const w = window.innerWidth || 0;
        const computed = responsiveService.compute(w);
        if (!this.dockLayout || computed !== this.currentBreakpoint) {
            this.currentBreakpoint = computed;

            // Programmatic initial set -> expect one layoutChange
            this.suppressLayoutChangeCount += 1;
            this.dockLayout = this.getDefaultLayout();

            // Ensure DM applies the new layout after the first render
            this.updateComplete.then(() => {
                const dmEl = this.renderRoot.querySelector('igc-dockmanager') as any;
                if (dmEl) dmEl.layout = this.dockLayout;
            });

            // Not dirty after initial baseline
            this.dispatchEvent(new CustomEvent('app-dirty-change', {
                detail: { dirty: false },
                bubbles: true,
                composed: true
            }));
        }

        window.addEventListener('reset-app-request', this.resetLayout as EventListener);
    }

    public disconnectedCallback() {
        window.removeEventListener('reset-app-request', this.resetLayout as EventListener);
        if (this.unsubscribeBp) {
            this.unsubscribeBp();
            this.unsubscribeBp = undefined;
        }
        super.disconnectedCallback?.();
    }

    private applyResponsiveLayout(): void {
        // Programmatic responsive baseline -> expect one layoutChange
        this.suppressLayoutChangeCount += 1;

        this.dockLayout = this.getDefaultLayout();

        this.updateComplete.then(() => {
            const dm = this.renderRoot.querySelector('igc-dockmanager') as any;
            if (dm) {
                dm.layout = this.dockLayout;
            }
        });

        // Not dirty when snapping to responsive baseline
        this.dispatchEvent(new CustomEvent('app-dirty-change', {
            detail: { dirty: false },
            bubbles: true,
            composed: true
        }));
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
