export class DownloadService {
	private getDownloadUrl(projectName: string, version: string): string {
		const basePath = this.getBasePath();
		return `${basePath}downloads/${projectName}-${version}.zip`;
	}

	private getBasePath(): string {
		// Get the current base path from the URL
		return document.querySelector('base')?.getAttribute('href') || './';
	}

	/**
	 * Downloads the currently viewed project as a zip file
	 * @param projectName The name of the project to download
	 * @param version The project version premium(paid) or community(free)
	 * @returns Promise<boolean> - true if successful, false if failed
	 */
	async downloadProject(projectName: string, version: string): Promise<boolean> {
		try {
			const downloadUrl = this.getDownloadUrl(projectName, version);

			// Create a download link
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = `${projectName}-${version}.zip`;
			link.style.display = 'none';

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			return true;
		} catch (error) {
			console.error('Download failed:', error);
			return false;
		}
	}
}
