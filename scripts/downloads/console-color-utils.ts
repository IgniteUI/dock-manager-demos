// Console colors and formatting
export const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgGreen: '\x1b[42m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
} as const;

type VersionKind = 'premium' | 'community';

export const log = {
    header: (text: string): void => {
        console.log(`\n${ colors.bgBlue }${ colors.white }${ colors.bright } ${ text } ${ colors.reset }`);
    },

    success: (text: string): void => {
        console.log(`${ colors.green }✓${ colors.reset } ${ text }`);
    },

    info: (text: string, indent: number = 0): void => {
        const pad = indent > 0 ? ' '.repeat(indent): '';
        console.log(`${ pad }${ colors.cyan }•${ colors.reset } ${ text }`);
    },

    warning: (text: string): void => {
        console.log(`${ colors.yellow }⚠${ colors.reset } ${ text }`);
    },

    error: (text: string): void => {
        console.log(`${ colors.red }✗${ colors.reset } ${ text }`);
    },

    step: (text: string): void => {
        console.log(`${ colors.magenta }►${ colors.reset } ${ text }`);
    },

    version: (type: VersionKind, pkg: string, version: string): void => {
        const typeColor = type==='premium' ? colors.magenta: colors.green;
        console.log(
            `  ${ typeColor }${ type.toUpperCase() }${ colors.reset } ${ colors.dim }→${ colors.reset } ${ pkg } ${ colors.yellow }${ version }${ colors.reset }`,
        );
    },

    size: (filename: string, bytes: number): void => {
        const mb = (bytes / 1024 / 1024).toFixed(2);
        console.log(
            `${ colors.green }✓${ colors.reset } ${ colors.bright }${ filename }${ colors.reset } ${ colors.dim }(${ mb } MB)${ colors.reset }`,
        );
    },

    title: (text: string): void => {
        console.log(`\n${ colors.bright }${ colors.blue }🚀 ${ text }${ colors.reset }`);
    },

    subtitle: (text: string): void => {
        console.log(`${ colors.dim }${ text }${ colors.reset }\n`);
    },

    finalSuccess: (text: string): void => {
        console.log(`\n${ colors.bgGreen }${ colors.white }${ colors.bright } 🎉 ${ text } ${ colors.reset }`);
    },

    finalError: (text: string): void => {
        console.log(`\n${ colors.red }💥 ${ text }${ colors.reset }`);
    },
};

export function time<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    log.step(`${label}…`);
    return fn().finally(() => {
        const seconds = ((Date.now() - start) / 1000).toFixed(2);
        log.info(`${label} done in ${seconds}s`);
    });
}
