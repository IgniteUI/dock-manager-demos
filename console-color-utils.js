// Console colors and formatting
const colors = {
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
};

// Console helpers
export const log = {
    header: (text) => console.log(
        `\n${colors.bgBlue}${colors.white}${colors.bright} ${text} ${colors.reset}`),
    success: (text) => console.log(`${colors.green}✓${colors.reset} ${text}`),
    info: (text, indent = 0) => console.log(
        `${' '.repeat(indent)}${colors.cyan}•${colors.reset} ${text}`),
    warning: (text) => console.log(`${colors.yellow}⚠${colors.reset} ${text}`),
    error: (text) => console.log(`${colors.red}✗${colors.reset} ${text}`),
    step: (text) => console.log(`${colors.magenta}►${colors.reset} ${text}`),
    version: (type, pkg, version) => {
        const typeColor = type === 'premium' ? colors.magenta : colors.green;
        console.log(
            `  ${typeColor}${type.toUpperCase()}${colors.reset} ${colors.dim}→${colors.reset} ${pkg} ${colors.yellow}${version}${colors.reset}`);
    },
    size: (filename, bytes) => {
        const mb = (bytes / 1024 / 1024).toFixed(2);
        console.log(
            `${colors.green}✓${colors.reset} ${colors.bright}${filename}${colors.reset} ${colors.dim}(${mb} MB)${colors.reset}`);
    },
    title: (text) => console.log(
        `\n${colors.bright}${colors.blue}🚀 ${text}${colors.reset}`),
    subtitle: (text) => console.log(`${colors.dim}${text}${colors.reset}\n`),
    finalSuccess: (text) => console.log(
        `\n${colors.bgGreen}${colors.white}${colors.bright} 🎉 ${text} ${colors.reset}`),
    finalError: (text) => console.log(`\n${colors.red}💥 ${text}${colors.reset}`),
};

// Export colors for direct access if needed
export {colors};
