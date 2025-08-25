import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolve absolute paths used by the downloads pipeline.
 * This module centralizes location awareness relative to the repo root.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to the repository root (scripts/downloads -> go up one)
const repoRoot = path.join(__dirname, '..', '..');

/**
 * Collection of important absolute paths for the build pipeline.
 * - repoRoot: project repository root
 * - projectsDir: source projects to package
 * - downloadsDir: output directory for generated zips
 */
export const paths = {
    repoRoot,
    projectsDir: path.join(repoRoot, 'projects'),
    downloadsDir: path.join(repoRoot, 'public', 'downloads'),
};
