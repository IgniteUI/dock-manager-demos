// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
	defineComponents, IgcButtonComponent, IgcIconButtonComponent, IgcIconComponent, IgcListComponent,
} from 'igniteui-webcomponents';
import styles from './activity-feed.scss?inline';
import { activityFeed, ActivityFeedItem } from '../../data/activity-feed.ts';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(IgcListComponent, IgcButtonComponent, IgcIconButtonComponent, IgcIconComponent);

@customElement('app-activity-feed')
export default class ActivityFeed extends LitElement {
	@state()
	private feed: ActivityFeedItem[] = activityFeed;

	render() {
		return html`
            <igc-list class="sm-activity-feed">
                <igc-list-header class="sm-activity-feed__header" tabindex="0">
                    <div class="sm-activity-feed__filter sm-activity-feed__filter-accent">Filter</div>
                    <igc-button variant="flat">Skip Alerts</igc-button>
                </igc-list-header>
                ${ this.feed.map(item => html`
                    <igc-list-item 
	                    tabindex="0"
	                    aria-label="${ item.username } - ${ item.message}${ item.timeAgo }"
	                    class="sm-activity-feed__item sm-activity-feed__item--${item.type}"
                    >
                        <igc-icon slot="start" name="${ item.icon }" collection="material"></igc-icon>

                        <span slot="title">${ item.username }</span>
                        <span slot="subtitle">
                            ${ item.message } <small class="sm-activity-feed__timestamp">${ item.timeAgo }</small>
						</span>

                        <igc-icon-button aria-label="Select Options" class="sm-activity-feed__more-button" slot="end" variant="flat">
                            <igc-icon name="more" , collection="material"></igc-icon>
                        </igc-icon-button>
                    </igc-list-item>
                `) }
            </igc-list>
		`;
	}

	static styles = unsafeCSS(styles);
}
