import path from 'node:path';
import fs from 'fs-extra';
import type { IPackageJson } from './types';
import { log } from './console-color-utils.js';
import { FALLBACK_DM_VERSION } from './shared.ts';

/**
 * Reads a project's package.json safely.
 */
function readPackageJsonSafe(projectDir: string): IPackageJson | null {
    try {
        return fs.readJsonSync(path.join(projectDir, 'package.json')) as IPackageJson;
    } catch (error: any) {
        log.warning(`Could not read project package.json: ${error.message}`);
        return null;
    }
}

/**
 * Resolve the Community Dock Manager version with fallback.
 */
export function getCommunityVersion(projectDir: string): string {
    const pkg = readPackageJsonSafe(projectDir);
    if (pkg?.dependencies?.['igniteui-dockmanager']) return pkg.dependencies['igniteui-dockmanager'];
    if (pkg?.dependencies?.['@infragistics/igniteui-dockmanager']) return pkg.dependencies['@infragistics/igniteui-dockmanager'];
    log.warning(`No dock manager dependency found, using fallback ${FALLBACK_DM_VERSION}`);
    return FALLBACK_DM_VERSION;
}

/**
 * Resolve the Premium Dock Manager version with fallback.
 */
export function getPremiumVersion(projectDir: string): string {
    const pkg = readPackageJsonSafe(projectDir);
    if (pkg?.dependencies?.['@infragistics/igniteui-dockmanager']) return pkg.dependencies['@infragistics/igniteui-dockmanager'];
    if (pkg?.dependencies?.['igniteui-dockmanager']) return pkg.dependencies['igniteui-dockmanager'];
    log.warning(`No dock manager dependency found, using fallback ${FALLBACK_DM_VERSION}`);
    return FALLBACK_DM_VERSION;
}
