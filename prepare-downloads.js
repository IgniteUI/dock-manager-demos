// prepare-downloads.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

console.log('Preparing downloadable project packages...');

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
    console.log('Created downloads directory');
}

// Get all project directories
const projectsDir = path.join(__dirname, 'projects');
const projects = fs.readdirSync(projectsDir)
.filter(dir => fs.statSync(path.join(projectsDir, dir)).isDirectory());

console.log(`Found ${projects.length} projects to package: ${projects.join(', ')}`);

// Process each project
for (const project of projects) {
    console.log(`Packaging ${project}...`);

    const projectDir = path.join(projectsDir, project);
    const outputZip = path.join(downloadsDir, `${project}.zip`);

    // Create a write stream for the zip file
    const output = fs.createWriteStream(outputZip);
    const archive = archiver('zip', {
        zlib: { level: 6 }, // Compression level
        forceUTC: true // For cross-platform compatibility
    });

    // Listen for archive events
    output.on('close', () => {
        console.log(`✓ ${project}.zip created (${archive.pointer()} total bytes)`);
    });

    archive.on('error', (err) => {
        console.error(`Error creating ${project}.zip:`, err);
        process.exit(1);
    });

    // Pipe the archive to the file
    archive.pipe(output);

    // Add files to the archive (excluding node_modules and other unnecessary files)
    const projectFiles = fs.readdirSync(projectDir).filter(file =>
        file !== 'node_modules' &&
        file !== 'dist' &&
        !file.endsWith('.zip') &&
        !file.startsWith('.')
    );

    // Add each file/directory to the archive
    projectFiles.forEach(file => {
        const filePath = path.join(projectDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            archive.directory(filePath, file);
            console.log(`  Adding directory: ${file}`);
        } else {
            archive.file(filePath, { name: file });
            console.log(`  Adding file: ${file}`);
        }
    });

    // Add a custom README for downloaded projects
    const readmeContent = `# ${project} Project
This project was downloaded from the Dock Manager Demos.

## Getting Started

1. Install dependencies:

npm install

2. Run the development server:

npm run dev


3. Open your browser to http://localhost:5173

## Support

For questions or issues, please visit the Infragistics website.
`;

    // Add the README to the archive (or update the existing one)
    archive.append(readmeContent, { name: 'README.md' });

    // Finalize the archive
    archive.finalize();
}
