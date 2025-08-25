import type { Archiver } from 'archiver';

/**
 * Shared types used across the downloads pipeline.
 */

/** Supported output variants for packaged demos. */
export type VersionType = 'premium' | 'community';

/** Minimal shape for package.json used by our processing. */
export interface IPackageJson {
    name?: string;
    version?: string;
    description?: string;
    author?: string;
    type?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

/** Context describing key filesystem locations. */
export interface IBuildContext {
    projectsDir: string;
    downloadsDir: string;
}

/** Context passed to file processors while traversing projects. */
export interface IProcessContext {
    version: VersionType;
    modifiedFiles: string[];
    archiver: Archiver;
    basePath: string;
}
