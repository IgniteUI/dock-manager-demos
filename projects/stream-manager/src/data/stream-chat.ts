// Basic roles/badges
export type Role = 'viewer' | 'broadcaster' | 'subscriber' | 'moderator' | 'bot' | 'streamer';
export type Badge =  'music-note' |'verified' | 'crown' | 'diamond' | 'broadcaster' | 'subscriber' | 'moderator' | 'bot' | 'streamer' | 'VIP';

export type StagedMsg = {
    username: string;
    role: Role;
    badges?: Badge[];
    time: string;
    message: string;
    isSelf?: boolean;
};

export const staged: StagedMsg[] = [
    {
        username: 'SoulfulVibes',
        role: 'viewer',
        time: '1:27',
        message: 'This reminds me of a back porch Mississippi sunset',
    },
    {
        username: 'MidnightSlide',
        role: 'moderator',
        badges: ['diamond'],
        time: '1:28',
        message: 'What tuning are you using on that resonator?',
    },
    {
        username: 'Mod_BluBot',
        role: 'bot',
        time: '1:28',
        message: 'Don’t forget to follow the channel',
    },
    {
        username: 'VinylCat',
        role: 'moderator',
        badges: ['verified', 'crown'],
        time: '1:29',
        message: 'Got this running through my speakers.',
    },
    {
        username: 'Mod_BluBot',
        role: 'bot',
        time: '1:28',
        message: 'Tip: Use !help for commands like !uptime or !song.',
    },
    {
        username: 'GuitarNerd',
        role: 'subscriber',
        badges: ['music-note'],
        time: '1:30',
        message: 'You looping that rhythm section live? Sounds killer!',
    },
    {
        username: 'FoxyOnAir',
        role: 'streamer',
        badges: ['verified'],
        time: '1:31',
        message: 'Yeah I got a looper pedal running—I\'ll break it down after this tune',
    },
    {
        username: 'JazzJack',
        role: 'subscriber',
        badges: ['verified'],
        time: '1:34',
        message: 'New here! Is this every week?',
    },
    {
        username: 'MidnightSlide',
        role: 'moderator',
        badges: ['diamond'],
        time: '1:38',
        message: 'Welcome @JazzJack! Yep, blues sessions every Tuesday at 8 PM EST',
    },
    {
        username: 'Mod_BluBot',
        role: 'bot',
        time: '1:50',
        message: 'Don’t forget to follow the channel',
    },
    {
        username: 'FoxyOnAir',
        role: 'streamer',
        badges: ['diamond'],
        time: '1:54',
        message: 'Thank you for following me',
    },
    {
        username: 'GuitarNerd',
        role: 'subscriber',
        badges: ['music-note'],
        time: '2:00',
        message: 'Tip the artist using !tip or check out the merch with !shop',
    },
    {
        username: 'Mod_BluBot',
        role: 'bot',
        time: '2:00',
        message: 'Tip the artist using !tip or check out the merch with !shop',
    },
    {
        username: 'BluesLover92',
        role: 'subscriber',
        badges: ['subscriber'],
        time: '2:05',
        message: 'That slide work is incredible! How long have you been playing?',
    },
    {
        username: 'FoxyOnAir',
        role: 'streamer',
        badges: ['diamond'],
        time: '2:07',
        message: 'Thanks! Been playing for about 15 years, picked up slide about 5 years ago',
    },
    {
        username: 'VinylCat',
        role: 'moderator',
        badges: ['verified', 'crown'],
        time: '2:10',
        message: 'Chat, let\'s show some love with those heart emotes! 💙',
    },
    {
        username: 'RhythmRider',
        role: 'subscriber',
        badges: ['subscriber'],
        time: '2:12',
        message: '💙💙💙 This is pure fire! Request: Can you play some Delta blues next?',
    },
    {
        username: 'Mod_BluBot',
        role: 'bot',
        time: '2:15',
        message: 'Stream has been live for 2 hours and 15 minutes. Current song requests: 3',
    },
];

// Split the messages for preloading and streaming
export const preloadedMessages = staged.slice(0, 12);
export const streamingMessages = staged.slice(12);

