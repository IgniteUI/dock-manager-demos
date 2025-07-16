// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
	defineComponents, IgcListComponent,
} from 'igniteui-webcomponents';
import styles from './stream-schedule.scss?inline';
import { streamSchedule, StreamScheduleItem } from '../../data/stream-schedule.ts';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(IgcListComponent);

@customElement('app-stream-schedule')
export default class StreamSchedule extends LitElement {
	@state()
	private schedule: StreamScheduleItem[] = streamSchedule;

	render() {
		return html`
            <igc-list class="sm-schedule-list">
                ${ this.schedule.map(item => html`
                    <igc-list-item class="sm-schedule-item">
                        <div slot="start" class="sm-schedule-item__label">${ item.day }</div>
                        <div slot="end" class="sm-schedule-item__value">${ item.startTime } - ${ item.endTime }</div>
                    </igc-list-item>
                `) }
            </igc-list>

		`;
	}

	static styles = unsafeCSS(styles);
}
