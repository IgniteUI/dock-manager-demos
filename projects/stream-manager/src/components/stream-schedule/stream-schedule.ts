// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
import {
	defineComponents, IgcListComponent,
} from 'igniteui-webcomponents';
import styles from './stream-schedule.scss?inline';
import { streamSchedule, IStreamScheduleItem } from '../../data/stream-schedule.ts';

// Initialize the dock manager custom elements
defineCustomElements();

defineComponents(IgcListComponent);

@customElement('app-stream-schedule')
export default class StreamSchedule extends LitElement {
    // readonly to prevent accidental changes
    private readonly schedule: IStreamScheduleItem[] = streamSchedule;

    // Pre-render templates since data is static
    private readonly scheduleTemplates = this.schedule.map(item => html`
		<igc-list-item class="sm-schedule-item" tabindex="0">
			<div slot="start" class="sm-schedule-item__label">${item.day}</div>
			<div slot="end" class="sm-schedule-item__value">${item.startTime} - ${item.endTime}</div>
		</igc-list-item>
	`);

    render() {
        return html`<igc-list class="sm-schedule-list">${this.scheduleTemplates}</igc-list>`;
    }

    static styles = unsafeCSS(styles);
}
