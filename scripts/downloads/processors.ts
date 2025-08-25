import fs from 'fs-extra';
import path from 'node:path';
import type { Archiver } from 'archiver';
import { modifyContentForCommunity, stripTsconfigPaths, readFileUtf8 } from './transform';
import type { VersionType } from './types';
import { log } from './console-color-utils.js';
import { CODE_EXTENSIONS, shouldSkipName } from './shared.ts';
import { createStandaloneViteConfig } from './vite-template.ts';

function isCodeFile(filePath: string): boolean {
    return CODE_EXTENSIONS.has(path.extname(filePath));
}

/**
 * Recursively walks a directory, adding files to an archiver instance while:
 * - Replacing vite config with a standalone template
 * - Stripping tsconfig paths
 * - Rewriting premium imports for community builds
 * - Preserving relative paths inside the archive
 */
export async function processDirectoryFiles(
    dirPath: string,
    basePath: string,
    archive: Archiver,
    version: VersionType,
    modifiedFiles: string[]
): Promise<void> {
    const items = await fs.readdir(dirPath);

    for (const item of items) {
        if (shouldSkipName(item)) continue;

        const itemPath = path.join(dirPath, item);
        const relativePath = path.relative(basePath, itemPath);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
            await processDirectoryFiles(itemPath, basePath, archive, version, modifiedFiles);
            continue;
        }

        // Replace Vite config (emit at root as vite.config.ts)
        if (item === 'vite.config.js' || item === 'vite.config.ts') {
            archive.append(createStandaloneViteConfig(), { name: 'vite.config.ts' });
            continue;
        }

        // Strip tsconfig paths
        if (relativePath === 'tsconfig.json') {
            try {
                const tsconfigRaw = await readFileUtf8(itemPath);
                archive.append(stripTsconfigPaths(tsconfigRaw), { name: relativePath });
            } catch {
                archive.file(itemPath, { name: relativePath });
            }
            continue;
        }

        // Community: rewrite premium imports
        if (version === 'community' && isCodeFile(itemPath)) {
            try {
                const content = await readFileUtf8(itemPath);
                const modifiedContent = modifyContentForCommunity(content);

                if (content !== modifiedContent) {
                    modifiedFiles.push(relativePath);
                    archive.append(modifiedContent, { name: relativePath });
                } else {
                    archive.file(itemPath, { name: relativePath });
                }
            } catch (error: any) {
                log.warning(`Could not modify ${relativePath}: ${error.message}`);
                archive.file(itemPath, { name: relativePath });
            }
            continue;
        }

        // Default: copy as-is (preserving a relative path)
        archive.file(itemPath, { name: relativePath });
    }
}
