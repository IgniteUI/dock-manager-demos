export interface IHeaderMetric {
    key: string;
    label: string;
    iconName: string;
    collection: string;
    type: 'text' | 'progress';
}

export const headerMetrics: IHeaderMetric[] = [
    {
        key: 'session',
        label: 'Session',
        iconName: 'schedule',
        collection: 'material',
        type: 'text'
    },
    {
        key: 'viewers',
        label: 'Viewers',
        iconName: 'user',
        collection: 'material',
        type: 'text'
    },
    {
        key: 'followers',
        label: 'Followers',
        iconName: 'community',
        collection: 'material',
        type: 'text'
    },
    {
        key: 'bitrate',
        label: 'Bitrate',
        iconName: 'analytics',
        collection: 'material',
        type: 'progress'
    }
];
