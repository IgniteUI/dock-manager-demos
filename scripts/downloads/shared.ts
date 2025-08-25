/**
 * Central configuration for the downloads pipeline.
 * Change here to affect all processors, templates, and builders.
 */
export const FALLBACK_DM_VERSION = '^1.16.1';

export const STANDALONE_PORT = 3000;

export const SASS_INCLUDE_PATHS = ['node_modules'];

/**
 * Exclude names when traversing projects to build zips.
 */
export const SKIP_NAMES = new Set([
    'node_modules',
    'dist',
    'build',
    '.git',
    '.gitignore',
    '.DS_Store',
    'Thumbs.db',
    '.env',
    '.env.local',
    '.vscode',
    '.idea',
]);

/**
 * Extensions to treat as code files eligible for community import rewriting.
 */
export const CODE_EXTENSIONS = new Set(['.ts', '.js', '.mjs', '.cjs']);

/**
 * Centralized name skip check for archiving.
 * Skips known names and platform artifacts.
 */
export function shouldSkipName(name: string): boolean {
    return SKIP_NAMES.has(name) || name.startsWith('.DS_Store');
}

/**
 * Files that should be replaced or transformed with special handling at project root.
 */
export const ROOT_SPECIAL_FILES = new Set(['package.json', 'vite.config.js', 'vite.config.ts', 'tsconfig.json']);
