import fs from 'fs-extra';
import path from 'node:path';
import { paths } from './paths';
import { createProjectZip } from './builder';
import type { VersionType } from './types';
import { log } from './console-color-utils.js';

type VariantArg = VersionType | 'both';

function parseArgs(argv: string[]) {
    const args = argv.slice(2);

    const fromFlags = args.reduce<Record<string, string>>((acc, arg) => {
        const m = arg.match(/^--([^=]+)=(.*)$/);
        if (m) acc[m[1]] = m[2];
        return acc;
    }, {});

    const project =
        fromFlags.project ??
        process.env.npm_config_project ??
        args[0]; // positional fallback

    const variantRaw =
        fromFlags.variant ??
        process.env.npm_config_variant ??
        args[1]; // positional fallback

    const variant = (variantRaw as VariantArg) || 'premium';

    return { project, variant };
}

async function listProjects(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir);
    const projects: string[] = [];
    for (const name of entries) {
        if (name.startsWith('.') || name.endsWith('.zip')) continue;
        const full = path.join(dir, name);
        const stat = await fs.stat(full);
        if (stat.isDirectory()) {
            projects.push(name);
        }
    }
    return projects;
}

async function run(): Promise<void> {
    const { project, variant } = parseArgs(process.argv);

    await fs.ensureDir(paths.downloadsDir);

    // Determine target projects
    const projects =
        !project || project === 'all'
            ? await listProjects(paths.projectsDir)
            : [project];

    if (!projects.length) {
        log.error(`No projects found in: ${paths.projectsDir}`);
        process.exit(1);
        return;
    }

    log.header(`Preparing downloads to: ${paths.downloadsDir}`);

    for (const p of projects) {
        try {
            if (variant === 'both') {
                await createProjectZip(paths.projectsDir, paths.downloadsDir, p, 'premium');
                await createProjectZip(paths.projectsDir, paths.downloadsDir, p, 'community');
            } else {
                await createProjectZip(paths.projectsDir, paths.downloadsDir, p, variant as VersionType);
            }
        } catch (err: any) {
            log.error(`Failed to create zip for "${p}" (${variant}): ${err?.message ?? err}`);
            // Continue with the next project
        }
    }

    log.success('Downloads preparation finished.');
}

run().catch((err) => {
    log.error(err?.stack || String(err));
    process.exit(1);
});
