export interface StreamScheduleItem {
	day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
	startTime: string;
	endTime: string;
}

export const streamSchedule: StreamScheduleItem[] = [
	{ day: 'Monday', startTime: '10:00', endTime: '16:00' },
	{ day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
	{ day: 'Wednesday', startTime: '10:00', endTime: '16:00' },
	{ day: 'Thursday', startTime: '07:00', endTime: '15:00' },
	{ day: 'Friday', startTime: '11:00', endTime: '12:00' },
	{ day: 'Saturday', startTime: '04:00', endTime: '17:00' },
];
