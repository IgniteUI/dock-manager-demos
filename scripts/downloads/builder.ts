import fs from 'fs-extra';
import path from 'node:path';
import archiver from 'archiver';
import { processDirectoryFiles } from './processors';
import { finalizeArchive } from './archiver';
import { getCommunityVersion, getPremiumVersion } from './versioning';
import type { IPackageJson, VersionType } from './types';
import { log } from './console-color-utils.js';
import { SKIP_NAMES } from './shared.ts';
import { createStandaloneViteConfig } from './vite-template.ts';
import { createReadmeContent } from './readme-template.ts';
import { modifyContentForCommunity, readFileUtf8, stripTsconfigPaths } from './transform.ts';

function shouldSkipName(name: string): boolean {
    return SKIP_NAMES.has(name) || name.startsWith('.DS_Store');
}

function mutatePackageJsonForStandalone(
    pkg: IPackageJson,
    variant: VersionType,
    versions: { community: string; premium: string },
    projectName: string
): IPackageJson {
    const next: IPackageJson = { ...(pkg || {}) };

    next.scripts = {
        "dev": "vite",
        "build": "npm run compile-theme && tsc && vite build",
        "preview": "vite preview",
        "compile-theme": "sass --load-path=node_modules src/styles/theme.scss:src/styles/theme.css",
        "watch-theme": "sass --watch --load-path=node_modules src/styles:src/styles src/styles/theme.scss:src/styles/theme.css"
    };

    if (next.devDependencies) {
        delete next.devDependencies['concurrently'];
        delete next.devDependencies['tsx'];
    }

    next.dependencies = { ...(next.dependencies || {}) };
    if (!next.dependencies['igniteui-theming']) {
        next.dependencies['igniteui-theming'] = 'v19.3.0-beta.3';
    }

    if (variant === 'community') {
        if (next.dependencies['@infragistics/igniteui-dockmanager']) {
            delete next.dependencies['@infragistics/igniteui-dockmanager'];
        }
        next.dependencies['igniteui-dockmanager'] = versions.community;
        log.version('community', 'igniteui-dockmanager', versions.community);
        next.name = `${next.name || projectName}-community`;
    } else {
        if (next.dependencies['igniteui-dockmanager']) {
            delete next.dependencies['igniteui-dockmanager'];
        }
        next.dependencies['@infragistics/igniteui-dockmanager'] = versions.premium;
        log.version('premium', '@infragistics/igniteui-dockmanager', versions.premium);
        next.name = `${next.name || projectName}-premium`;
    }

    return next;
}

/**
 * Creates a zipped, standalone variant (premium/community) of a project.
 */
export async function createProjectZip(
    projectsDir: string,
    downloadsDir: string,
    projectName: string,
    version: VersionType
): Promise<void> {
    const versionIcon = version === 'premium' ? '💎' : '🌟';
    log.header(`${versionIcon} Building ${version} version...`);

    const projectDir = path.join(projectsDir, projectName);
    const outputZip = path.join(downloadsDir, `${projectName}-${version}.zip`);

    if (!(await fs.pathExists(projectDir))) {
        const msg = `Project directory does not exist: ${projectDir}`;
        log.error(msg);
        throw new Error(msg);
    }

    const communityVersion = getCommunityVersion(projectDir);
    const premiumVersion = getPremiumVersion(projectDir);
    const versions = { community: communityVersion, premium: premiumVersion };

    if (await fs.pathExists(outputZip)) {
        await fs.remove(outputZip);
    }

    const output = fs.createWriteStream(outputZip);
    const archive = archiver('zip', { zlib: { level: 6 }, forceLocalTime: true });
    archive.pipe(output);

    const modifiedFiles: string[] = [];

    const entries = await fs.readdir(projectDir);
    const rootItems = entries.filter((file) => !shouldSkipName(file) && !file.endsWith('.zip'));

    for (const file of rootItems) {
        const filePath = path.join(projectDir, file);
        const stats = await fs.stat(filePath);
        const relativePath = path.relative(projectDir, filePath);

        if (stats.isDirectory()) {
            await processDirectoryFiles(filePath, projectDir, archive, version, modifiedFiles);
            continue;
        }

        if (file === 'package.json') {
            const pkg = (await fs.readJson(filePath)) as IPackageJson;
            const nextPkg = mutatePackageJsonForStandalone(pkg, version, versions, projectName);
            archive.append(JSON.stringify(nextPkg, null, 2), { name: relativePath });
            continue;
        }

        if (file === 'vite.config.js' || file === 'vite.config.ts') {
            archive.append(createStandaloneViteConfig(), { name: 'vite.config.ts' });
            continue;
        }

        if (file === 'tsconfig.json') {
            try {
                const tsconfigRaw = await readFileUtf8(filePath);
                archive.append(stripTsconfigPaths(tsconfigRaw), { name: relativePath });
            } catch {
                archive.file(filePath, { name: relativePath });
            }
            continue;
        }

        if (version === 'community' && (file.endsWith('.ts') || file.endsWith('.js'))) {
            try {
                const content = await readFileUtf8(filePath);
                const modifiedContent = modifyContentForCommunity(content);
                if (content !== modifiedContent) {
                    modifiedFiles.push(relativePath);
                    archive.append(modifiedContent, { name: relativePath });
                } else {
                    archive.file(filePath, { name: relativePath });
                }
            } catch (error: any) {
                log.warning(`Could not modify ${relativePath}: ${error.message}`);
                archive.file(filePath, { name: relativePath });
            }
            continue;
        }

        archive.file(filePath, { name: relativePath });
    }
        if (version === 'community' && modifiedFiles.length > 0) {
        log.info(`Modified ${modifiedFiles.length} files for community version:`, 2);
        modifiedFiles.forEach((f) => log.info(f, 4));
    }

    archive.append(createReadmeContent(projectName, version, communityVersion, premiumVersion), { name: 'README.md' });

    await finalizeArchive(archive, output);
    log.size(`${projectName}-${version}.zip`, archive.pointer());
}
