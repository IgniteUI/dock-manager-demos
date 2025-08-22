import { readdirSync } from 'fs';
import { spawn, ChildProcess, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectsDir = join(__dirname, '../projects');

interface ProjectProcess {
    name: string;
    process: ChildProcess;
    port: number;
}

// Auto-discover projects
const projects: string[] = readdirSync(projectsDir, { withFileTypes: true })
.filter(d => d.isDirectory())
.map(d => d.name);

// Port management
const BASE_PORT = 3001;
const portMap = new Map<string, number>();
projects.forEach((project, index) => {
    portMap.set(project, BASE_PORT + index);
});

export const PROJECT_PORTS: Record<string, number> = Object.fromEntries(portMap);

console.log(`🚀 Discovered ${projects.length} projects:`, projects);
console.log('📍 Port mapping:', PROJECT_PORTS);

// Function to install dependencies for all projects
export function installProjects(): void {
    console.log('\n📦 Installing dependencies for all projects...');
    projects.forEach(project => {
        console.log(`Installing dependencies for ${project}...`);
        try {
            execSync('npm install', {
                cwd: join(projectsDir, project),
                stdio: 'inherit'
            });
            console.log(`✅ ${project} dependencies installed`);
        } catch (error) {
            console.error(`❌ Failed to install dependencies for ${project}:`, error);
        }
    });
    console.log('📦 All dependencies installed\n');
}

// Function to start all dev servers
export function startDevServers(): void {
    const processes: ProjectProcess[] = [];

    projects.forEach(project => {
        const port = portMap.get(project)!;
        console.log(`📦 Starting ${project} on port ${port}...`);

        const childProcess = spawn('npm', ['run', 'dev'], {
            cwd: join(projectsDir, project),
            stdio: ['ignore', 'inherit', 'inherit'], // Change this to see all output
            env: {
                ...process.env,
                PORT: port.toString(),
                VITE_PORT: port.toString(),
                NODE_ENV: 'development'
            }
        });

        processes.push({ name: project, process: childProcess, port });
    });

    // Graceful cleanup
    const shutdownSignals = ['SIGINT', 'SIGTERM'] as const;
    shutdownSignals.forEach(signal => {
        process.on(signal, () => {
            console.log(`\n🛑 Received ${signal}, shutting down...`);
            processes.forEach(({ name, process: childProcess }) => {
                console.log(`   Stopping ${name}...`);
                childProcess.kill();
            });
            process.exit(0);
        });
    });

    console.log('✅ All projects started. Press Ctrl+C to stop.');
}

// If run directly, perform both operations
if (import.meta.url === `file://${process.argv[1]}`) {
    const command = process.argv[2];

    switch (command) {
        case 'install':
            installProjects();
            break;
        case 'dev':
            startDevServers();
            break;
        case 'setup':
            installProjects();
            startDevServers();
            break;
        default:
            console.log('Usage: npm run projects [install|dev|setup]');
            console.log('  install - Install dependencies for all projects');
            console.log('  dev     - Start dev servers for all projects');
            console.log('  setup   - Install dependencies and start dev servers');
    }
}
