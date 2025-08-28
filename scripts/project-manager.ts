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

function buildPortMap(ids: string[], base = 3001): Map<string, number> {
    const sorted = [...ids].sort((a, b) => a.localeCompare(b));
    const map = new Map<string, number>();
    sorted.forEach((id, idx) => map.set(id, base + idx));
    return map;
}

function npmCmd(): string {
    return /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
}

async function runInstall() {
    const projects = listProjects(projectsDir);
    console.log('🚀 Discovered %d projects:', projects.length, projects);

    const portMap = buildPortMap(projects);
    console.log('📍 Port mapping:', Object.fromEntries(portMap));

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

async function runDev() {
    const projects = listProjects(projectsDir);
    console.log('🚀 Discovered %d projects:', projects.length, projects);

    const portMap = buildPortMap(projects);
    console.log('📍 Port mapping:', Object.fromEntries(portMap));

    // Write a plain object ports map for the main app proxy
    try {
        const mapPath = join(process.cwd(), 'projects.ports.json');
        const plain = Object.fromEntries(portMap);
        writeFileSync(mapPath, JSON.stringify(plain, null, 2), 'utf-8');
        console.log(`🗺️  Wrote ports map to ${mapPath}:`, plain);
    } catch (e) {
        console.warn('⚠️ Failed to write projects.ports.json:', e);
    }

    // Start child dev servers WITH BASE_PATH and PORT
    for (const id of projects) {
        const port = portMap.get(id);
        const cwd = join(process.cwd(), 'projects', id);

        const env = {
            ...process.env,
            PORT: String(port),
            BASE_PATH: `/projects/${id}/`,
        };

        console.log(`📦 Starting ${id} on port ${port} with BASE_PATH=${env.BASE_PATH}...`);

        const child = spawn(npmCmd(), ['run', 'dev'], {
            cwd,
            stdio: 'inherit',
            env
        });

        child.on('exit', (code) => {
            console.log(`ℹ️  ${id} dev exited with code ${code}`);
        });
    }

    console.log('✅ All projects started. Press Ctrl+C to stop.');
}

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
