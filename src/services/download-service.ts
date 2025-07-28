export class DownloadService {
	/**
	 * Downloads the currently viewed project as a zip file
	 * @param projectName The name of the project to download
	 */
	async downloadProject(projectName: string): Promise<void> {
		try {
			// Download the pre-packaged zip file
			const zipUrl = `${import.meta.env.BASE_URL}downloads/${projectName}.zip`;

			// Create a link element and trigger the download
			const link = document.createElement('a');
			link.href = zipUrl;
			link.download = `${projectName}.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Hide loading indicator

		} catch (error) {
			alert('Failed to download the project. Please try again.');
		}
	}
}
