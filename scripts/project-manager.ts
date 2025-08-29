import { execSync, spawn } from 'node:child_process';
import { writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { cp } from 'node:fs/promises';

const projectsDir = join(process.cwd(), 'projects');

function listProjects(dir: string): string[] {
    const entries = readdirSync(dir);
    const result: string[] = [];

    for (const name of entries) {
        const full = join(dir, name);

        try {
            const st = statSync(full);
            if (st.isDirectory()) {
                result.push(name);
            }
        } catch {
            // ignore
        }
    }

    return result;
}


function npmCmd(): string {
    return /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
}

async function runInstall() {
    const projects = listProjects(projectsDir);
    console.log('🚀 Discovered %d projects:', projects.length, projects);
    console.log('\n📦 Installing dependencies for all projects...');

    for (const id of projects) {
        console.log(`Installing dependencies for ${id}...`);
        try {
            execSync('npm install', {
                cwd: join(projectsDir, id),
                stdio: 'inherit'
            });
            console.log(`✅ ${id} dependencies installed`);
        } catch (error) {
            console.error(`❌ Failed to install dependencies for ${id}:`, (error as Error).message ?? error);
        }
    }

    console.log('📦 All dependencies installed\n');
}

// Replace dev mode: instead of starting dev servers on specific ports,
// build each project and copy its dist into the main app's public/projects/<id>,
// so the main app can serve them statically without any proxy.
async function runDev() {
    const projects = listProjects(projectsDir);
    console.log('🚀 Discovered %d projects:', projects.length, projects);

// ... existing code ...
    const publicProjectsDir = join(process.cwd(), 'public', 'projects');
    if (!existsSync(publicProjectsDir)) {
        mkdirSync(publicProjectsDir, { recursive: true });
    }

    console.log('\n🏗️  Building and copying all projects for static serving...');
    for (const id of projects) {
        const projectPath = join(projectsDir, id);
        const projectDistPath = join(projectPath, 'dist');
        const targetPath = join(publicProjectsDir, id);

        console.log(`Building ${id}...`);
        try {
            // Force BASE_PATH for correct asset paths inside the iframe
            const env = {
                ...process.env,
                BASE_PATH: `/projects/${id}/`,
                NODE_ENV: 'development'
            };

            execSync('npm run build', {
                cwd: projectPath,
                stdio: 'inherit',
                env
            });

            if (existsSync(projectDistPath)) {
                // Ensure target exists and copy over
                if (!existsSync(targetPath)) {
                    mkdirSync(targetPath, { recursive: true });
                }
                await cp(projectDistPath, targetPath, { recursive: true });
                console.log(`✅ ${id} built and copied to public/projects/${id}`);
            } else {
                console.warn(`⚠️  ${id} build completed but no dist folder found at ${projectDistPath}`);
            }
        } catch (error) {
            console.error(`❌ Failed to build ${id}:`, (error as Error).message ?? error);
        }
    }

    console.log('✅ All projects are available statically under /projects/<id>/');
    console.log('ℹ️  Start the main app dev server separately: npm run dev:main');
}


// Keep build mode copying into dist/projects/<id> for production/preview
async function runBuild() {
    const projects = listProjects(projectsDir);
    console.log('🚀 Building %d projects:', projects.length, projects);

    const rootDistDir = join(process.cwd(), 'dist');
    const projectsDistDir = join(rootDistDir, 'projects');

    // Ensure root dist/projects directory exists
    if (!existsSync(rootDistDir)) {
        mkdirSync(rootDistDir, { recursive: true });
    }
    if (!existsSync(projectsDistDir)) {
        mkdirSync(projectsDistDir, { recursive: true });
    }

    console.log('\n🏗️  Building all projects...');
    for (const id of projects) {
        const projectPath = join(projectsDir, id);
        const projectDistPath = join(projectPath, 'dist');
        const targetPath = join(projectsDistDir, id);

        console.log(`Building ${id}...`);
        try {
            // Set BASE_PATH for the project build
            const env = {
                ...process.env,
                BASE_PATH: `/projects/${id}/`,
                NODE_ENV: 'production'
            };

            execSync('npm run build', {
                cwd: projectPath,
                stdio: 'inherit',
                env
            });

            // Copy built files to root dist/projects/{id}
            if (existsSync(projectDistPath)) {
                await cp(projectDistPath, targetPath, { recursive: true });
                console.log(`✅ ${id} built and copied to dist/projects/${id}`);
            } else {
                console.warn(`⚠️  ${id} build completed but no dist folder found at ${projectDistPath}`);
            }
        } catch (error) {
            console.error(`❌ Failed to build ${id}:`, (error as Error).message ?? error);
            process.exit(1);
        }
    }
    console.log('🏗️  All projects built successfully\n');
}


// Entry point
(async () => {
    const mode = process.argv[2]; // "install", "dev", or "build"
    if (mode === 'install') {
        await runInstall();   // DO NOT start dev servers here
    } else if (mode === 'dev') {
        await runDev();
    } else if (mode === 'build') {
        await runBuild();
    } else {
        console.error('Unknown mode. Use: tsx scripts/project-manager.ts install | dev | build');
        process.exit(1);
    }
})();

