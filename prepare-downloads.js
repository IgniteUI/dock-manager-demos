import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import {fileURLToPath} from 'url';
import { log } from './console-color-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadsDir = path.join(__dirname, 'public', 'downloads');

// Get community package version dynamically from individual project
function getCommunityVersion(projectDir) {
    try {
        const projectPackageJson = fs.readJsonSync(path.join(projectDir, 'package.json'));

        if (projectPackageJson.dependencies?.['igniteui-dockmanager']) {
            return projectPackageJson.dependencies['igniteui-dockmanager'];
        }

        if (projectPackageJson.dependencies?.['@infragistics/igniteui-dockmanager']) {
            return projectPackageJson.dependencies['@infragistics/igniteui-dockmanager'];
        }

        log.warning('No dock manager dependency found in project package.json, using fallback version');
        return '^1.16.1';
    } catch (error) {
        log.warning(`Could not read project package.json, using fallback version: ${error.message}`);
        return '^1.16.1';
    }
}

// Get premium package version dynamically from individual project
function getPremiumVersion(projectDir) {
    try {
        const projectPackageJson = fs.readJsonSync(path.join(projectDir, 'package.json'));

        if (projectPackageJson.dependencies?.['@infragistics/igniteui-dockmanager']) {
            return projectPackageJson.dependencies['@infragistics/igniteui-dockmanager'];
        }

        if (projectPackageJson.dependencies?.['igniteui-dockmanager']) {
            return projectPackageJson.dependencies['igniteui-dockmanager'];
        }

        log.warning('No dock manager dependency found in project package.json, using fallback version');
        return '^1.16.1';
    } catch (error) {
        log.warning(`Could not read project package.json, using fallback version: ${error.message}`);
        return '^1.16.1';
    }
}

// Ensure downloads directory exists
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, {recursive: true});
    log.success('Created downloads directory');
}

// Get all project directories
const projectsDir = path.join(__dirname, 'projects');
const projects = fs.readdirSync(projectsDir).filter(item => {
    return fs.statSync(path.join(projectsDir, item)).isDirectory();
});

log.title('Dock Manager Demos');
log.subtitle(`Found ${projects.length} projects: ${projects.join(', ')}`);

async function createProjectVersions() {
    for (const project of projects) {
        log.header(`📦 ${project.toUpperCase()}`);

        try {
            await createProjectZip(project, 'premium');
            await createProjectZip(project, 'community');
            log.success(`Completed ${project} (both versions created)\n`);
        } catch (error) {
            log.error(`Failed to process ${project}: ${error.message}\n`);
        }
    }
}

// Helper function to modify TypeScript/JavaScript content for community version
function modifyContentForCommunity(content) {
    return content
    .replace(/from ['"]@infragistics\/igniteui-dockmanager\/loader['"]/g, `from 'igniteui-dockmanager/loader'`)
    .replace(/from ['"]@infragistics\/igniteui-dockmanager['"]/g, `from 'igniteui-dockmanager'`);
}

// Helper function to process directory files recursively
function processDirectoryFiles(dirPath, basePath, archive, version, modifiedFiles) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const relativePath = path.relative(basePath, itemPath);

        // Skip unwanted items
        if (item.includes('node_modules') ||
            item.includes('.git') ||
            item.includes('dist') ||
            item.includes('build') ||
            item.startsWith('.DS_Store')) {
            continue;
        }

        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            processDirectoryFiles(itemPath, basePath, archive, version, modifiedFiles);
        } else if (stats.isFile()) {
            if (version === 'community' && (item.endsWith('.ts') || item.endsWith('.js'))) {
                try {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    const modifiedContent = modifyContentForCommunity(content);

                    if (content !== modifiedContent) {
                        modifiedFiles.push(relativePath);
                        archive.append(modifiedContent, {name: relativePath});
                    } else {
                        archive.file(itemPath, {name: relativePath});
                    }
                } catch (error) {
                    log.warning(`Could not modify ${relativePath}: ${error.message}`);
                    archive.file(itemPath, {name: relativePath});
                }
            } else {
                archive.file(itemPath, {name: relativePath});
            }
        }
    }
}

function createProjectZip(projectName, version) {
    return new Promise((resolve, reject) => {
        const versionIcon = version === 'premium' ? '💎' : '🌟';
        log.step(`${versionIcon} Building ${version} version...`);

        const projectDir = path.join(__dirname, 'projects', projectName);
        const outputZip = path.join(downloadsDir, `${projectName}-${version}.zip`);

        if (!fs.existsSync(projectDir)) {
            log.error(`Project directory does not exist: ${projectDir}`);
            reject(new Error(`Project directory not found: ${projectName}`));
            return;
        }

        const communityVersion = getCommunityVersion(projectDir);
        const premiumVersion = getPremiumVersion(projectDir);

        if (fs.existsSync(outputZip)) {
            fs.unlinkSync(outputZip);
        }

        const output = fs.createWriteStream(outputZip);
        const archive = archiver('zip', {
            zlib: {level: 6},
            forceLocalTime: true,
        });

        let finished = false;
        const modifiedFiles = [];

        output.on('close', () => {
            if (!finished) {
                finished = true;
                log.size(`${projectName}-${version}.zip`, archive.pointer());
                resolve();
            }
        });

        output.on('error', (err) => {
            if (!finished) {
                finished = true;
                log.error(`Error writing ${projectName}-${version}.zip: ${err}`);
                reject(err);
            }
        });

        archive.on('error', (err) => {
            if (!finished) {
                finished = true;
                log.error(`Error creating archive for ${projectName}-${version}: ${err}`);
                reject(err);
            }
        });

        try {
            archive.pipe(output);

            const projectFiles = fs.readdirSync(projectDir).filter(file => {
                const skipItems = [
                    'node_modules', 'dist', 'build', '.git', '.gitignore',
                    '.DS_Store', 'Thumbs.db', '.env', '.env.local', '.vscode', '.idea',
                ];
                return !skipItems.includes(file) && !file.endsWith('.zip') && !file.startsWith('.DS_Store');
            });

            // Process each file/directory
            projectFiles.forEach(file => {
                const filePath = path.join(projectDir, file);

                if (!fs.existsSync(filePath)) {
                    return;
                }

                const stats = fs.statSync(filePath);

                if (file === 'package.json') {
                    const packageJson = fs.readJsonSync(filePath);

                    if (version === 'community') {
                        if (packageJson.dependencies?.['@infragistics/igniteui-dockmanager']) {
                            delete packageJson.dependencies['@infragistics/igniteui-dockmanager'];
                            packageJson.dependencies['igniteui-dockmanager'] = communityVersion;
                            log.version('community', 'igniteui-dockmanager', communityVersion);
                        } else if (packageJson.dependencies?.['igniteui-dockmanager']) {
                            packageJson.dependencies['igniteui-dockmanager'] = communityVersion;
                            log.version('community', 'igniteui-dockmanager', communityVersion);
                        }
                        packageJson.name = `${packageJson.name}-community`;
                    } else {
                        if (packageJson.dependencies?.['@infragistics/igniteui-dockmanager']) {
                            packageJson.dependencies['@infragistics/igniteui-dockmanager'] = premiumVersion;
                            log.version('premium', '@infragistics/igniteui-dockmanager', premiumVersion);
                        } else if (packageJson.dependencies?.['igniteui-dockmanager']) {
                            delete packageJson.dependencies['igniteui-dockmanager'];
                            packageJson.dependencies['@infragistics/igniteui-dockmanager'] = premiumVersion;
                            log.version('premium', '@infragistics/igniteui-dockmanager', premiumVersion);
                        }
                        packageJson.name = `${packageJson.name}-premium`;
                    }

                    archive.append(JSON.stringify(packageJson, null, 2), {name: 'package.json'});

                } else if ((file.endsWith('.ts') || file.endsWith('.js')) && version === 'community') {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const modifiedContent = modifyContentForCommunity(content);
                    archive.append(modifiedContent, {name: file});

                } else if (stats.isDirectory()) {
                    processDirectoryFiles(filePath, projectDir, archive, version, modifiedFiles);
                } else {
                    archive.file(filePath, {name: file});
                }
            });

            // Show modified files summary
            if (version === 'community' && modifiedFiles.length > 0) {
                log.info(`Modified ${modifiedFiles.length} files for community version:`, 2);
                modifiedFiles.forEach(file => {
                    log.info(file, 4);
                });
            }

            // Add version-specific README
            const readmeContent = `# ${projectName} Project (${version.toUpperCase()} Version)

This project was downloaded from the Dock Manager Demos.

## Version Information
- **Version**: ${version.toUpperCase()}
- **Dock Manager Package**: ${version === 'community' ?
                `igniteui-dockmanager (Community) ${communityVersion}` :
                `@infragistics/igniteui-dockmanager (Premium) ${premiumVersion}`}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open your browser to http://localhost:5173

## Project Structure

This project uses:
- TypeScript 5.x
- Lit 3.x
- Vite for build tooling
- ${version === 'community' ?
                'Ignite UI Dock Manager (Community Edition)' :
                'Ignite UI Dock Manager (Premium Edition)'}

${version === 'premium' ? `
## Premium Features
This version includes access to all premium features of the Ignite UI Dock Manager.
` : `
## Community Version
This is the community version with basic dock manager functionality.
`}

## Support

For questions or issues, please visit the Infragistics website.
---
*Generated on ${new Date().toISOString()}*
`;

            archive.append(readmeContent, {name: 'README.md'});
            archive.finalize();

        } catch (error) {
            if (!finished) {
                finished = true;
                log.error(`Error processing project ${projectName}-${version}: ${error}`);
                reject(error);
            }
        }
    });
}

// Run the script
createProjectVersions().then(() => {
    log.finalSuccess('ALL PROJECTS COMPLETED SUCCESSFULLY!');
    log.subtitle(`📁 Check the downloads folder: ${downloadsDir}`);
}).catch((error) => {
    log.finalError(`Script failed: ${error}`);
    process.exit(1);
});
