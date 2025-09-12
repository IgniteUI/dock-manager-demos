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
        iconName: 'session',
        collection: 'material',
        type: 'text'
    },
    {
        key: 'viewers',
        label: 'Viewers',
        iconName: 'viewers',
        collection: 'material',
        type: 'text'
    },
    {
        key: 'followers',
        label: 'Followers',
        iconName: 'followers',
        collection: 'material',
        type: 'text'
    },
    {
        key: 'bitrate',
        label: 'Bitrate',
        iconName: 'bitrate',
        collection: 'material',
        type: 'progress'
    }
];
