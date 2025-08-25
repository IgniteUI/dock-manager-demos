import type { Archiver } from 'archiver';
import type fsExtra from 'fs-extra';

/**
 * Finalization helper for archiver pipelines.
 * Ensures errors and completion are resolved/rejected as a single promise.
 */
export function finalizeArchive(archive: Archiver, outputStream: fsExtra.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
        let done = false;

        outputStream.on('close', () => {
            if (!done) {
                done = true;
                resolve();
            }
        });

        outputStream.on('error', (err) => {
            if (!done) {
                done = true;
                reject(err);
            }
        });

        archive.on('error', (err) => {
            if (!done) {
                done = true;
                reject(err);
            }
        });

        archive.finalize().catch(reject);
    });
}
