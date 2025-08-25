import fs from 'fs-extra';

/**
 * Rewrites premium package imports to community equivalents in TS/JS sources.
 */
export function modifyContentForCommunity(content: string): string {
    return content
    .replace(/from ['"]@infragistics\/igniteui-dockmanager\/loader['"]/g, `from 'igniteui-dockmanager/loader'`)
    .replace(/from ['"]@infragistics\/igniteui-dockmanager['"]/g, `from 'igniteui-dockmanager'`);
}

/**
 * Removes TS path aliases to simplify standalone project configuration.
 * On failure, returns the original content.
 */
export function stripTsconfigPaths(jsonStr: string): string {
    try {
        const tsconfig = JSON.parse(jsonStr) as Record<string, any>;
        if (tsconfig.compilerOptions?.paths) {
            delete tsconfig.compilerOptions.paths;
        }
        return JSON.stringify(tsconfig, null, 2);
    } catch {
        return jsonStr;
    }
}

/** Reads a UTF-8 file. Separated for easier testing and mocking. */
export async function readFileUtf8(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf8');
}
