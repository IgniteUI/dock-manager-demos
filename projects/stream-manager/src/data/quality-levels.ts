export interface IqualityLevel {
	min: number;
	max: number;
	label: string;
	variant: string;
	percentRange: [number, number];
}


// Quality levels and thresholds
export const qualityLevels: IqualityLevel[] = [
	{
		min: 0,
		max: 30000,
		label: 'Poor',
		variant: 'danger',
		percentRange: [0, 30]
	},
	{
		min: 30000,
		max: 35000,
		label: 'Acceptable',
		variant: 'primary',
		percentRange: [30, 50]
	},
	{
		min: 35000,
		max: 45000,
		label: 'Good',
		variant: 'primary',
		percentRange: [50, 80]
	},
	{
		min: 45000,
		max: Infinity,
		label: 'Excellent',
		variant: 'primary',
		percentRange: [80, 100]
	},
];
