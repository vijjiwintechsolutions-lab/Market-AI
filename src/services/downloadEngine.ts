// =====================================================================
// MARKET1 UNIVERSAL DOWNLOAD ENGINE (MUTE)
// Securely handles all file downloads across the platform.
// =====================================================================

export const UniversalDownloadEngine = {
  async download(url: string, baseFilename: string, extension: string) {
    const filename = `${baseFilename}-output.${extension}`;

    try {
      // Step 1: Attempt to fetch and convert to Blob (Solves cross-origin issues)
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      this.triggerDownload(blobUrl, filename);
      
      // Cleanup memory
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.warn('[MUTE Download Engine] Blob fetch failed, falling back to direct link.', error);
      // Step 2: Fallback to direct anchor download
      this.triggerDownload(url, filename);
    }
  },

  triggerDownload(href: string, filename: string) {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.target = '_blank'; // Fallback for external URLs
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
