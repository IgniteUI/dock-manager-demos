import type { VersionType } from './types';

/**
 * Returns README content bundled in each zip.
 * Includes:
 * - Variant (Community/Premium)
 * - Package versions used
 * - Get started instructions
 */
export function createReadmeContent(
    projectName: string,
    version: VersionType,
    communityVersion: string,
    premiumVersion: string
): string {
    const dmPackageLine =
        version === 'community'
            ? `igniteui-dockmanager (Community) ${communityVersion}`
            : `@infragistics/igniteui-dockmanager (Premium) ${premiumVersion}`;

    const featuresSection =
        version === 'premium'
            ? [
                '## Premium Features',
                'Includes access to all premium features of the Ignite UI Dock Manager.',
                '',
            ].join('\n')
            : [
                '## Community Version',
                'This is the community version with basic dock manager functionality.',
                '',
            ].join('\n');

    return [
        `# ${projectName} Project (${version.toUpperCase()} Version)`,
        '',
        'This project was downloaded from the Dock Manager Demos.',
        '',
        '## Version Information',
        `- Version: ${version.toUpperCase()}`,
        `- Dock Manager Package: ${dmPackageLine}`,
        '',
        '## Getting Started',
        '',
        '1. Install dependencies:',
        '```bash',
        'npm install',
        '```',
        '',
        '2. Run the development server:',
        '```bash',
        'npm run dev',
        '```',
        '',
        '3. Open your browser to http://localhost:3000',
        '',
        '## Project Stack',
        '',
        '- TypeScript 5.x',
        '- Lit 3.x',
        '- Vite',
        `- ${version === 'community' ? 'Ignite UI Dock Manager (Community Edition)' : 'Ignite UI Dock Manager (Premium Edition)'}`,
        '',
        featuresSection,
        '## Support',
        '',
        'For questions or issues, please visit the Infragistics website.',
        '',
        '---',
        `Generated on ${new Date().toISOString()}`,
        '',
    ].join('\n');
}
