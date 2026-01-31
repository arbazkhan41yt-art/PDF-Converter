// Universal Download Utility - Works with all tools
class UniversalDownloader {
    constructor() {
        this.downloadManager = null;
        this.initDownloadManager();
    }

    async initDownloadManager() {
        // Wait for download manager to be available
        if (typeof downloadManager !== 'undefined') {
            this.downloadManager = downloadManager;
        } else {
            // Fallback to direct download
            this.downloadManager = {
                downloadFile: (blob, filename) => {
                    this.directDownload(blob, filename);
                    return true;
                }
            };
        }
    }

    directDownload(blob, filename) {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    downloadFile(blob, filename, options = {}) {
        try {
            const success = this.downloadManager.downloadFile(blob, filename);
            
            if (options.showNotification !== false) {
                this.showDownloadNotification(filename, success);
            }
            
            return success;
        } catch (error) {
            console.error('Download failed:', error);
            this.showDownloadNotification(filename, false);
            return false;
        }
    }

    showDownloadNotification(filename, success) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `download-notification ${success ? 'success' : 'error'}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${success ? '✓' : '✗'}
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    ${success ? 'Download Started' : 'Download Failed'}
                </div>
                <div class="notification-message">
                    ${success ? `Downloading ${filename}...` : `Failed to download ${filename}`}
                </div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${success ? '#10b981' : '#ef4444'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            font-family: 'Inter', sans-serif;
            animation: slideIn 0.3s ease;
        `;

        // Add internal styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 2px;
            }
            
            .notification-message {
                font-size: 13px;
                opacity: 0.9;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        `;

        // Add to page
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Enhanced download with progress tracking
    downloadWithProgress(blob, filename, onProgress) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate progress for large files
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += 10;
                    if (onProgress) {
                        onProgress(progress);
                    }
                    
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                        this.downloadFile(blob, filename);
                        resolve(true);
                    }
                }, 100);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    // Batch download multiple files
    downloadMultipleFiles(files, zipName = 'download.zip') {
        if (files.length === 1) {
            // Single file - download directly
            return this.downloadFile(files[0].blob, files[0].name);
        }

        // Multiple files - create ZIP
        if (typeof JSZip !== 'undefined') {
            const zip = new JSZip();
            
            files.forEach(file => {
                zip.file(file.name, file.blob);
            });

            zip.generateAsync({ type: 'blob' })
                .then(zipBlob => {
                    this.downloadFile(zipBlob, zipName);
                })
                .catch(error => {
                    console.error('Failed to create ZIP:', error);
                    this.showDownloadNotification(zipName, false);
                });
        } else {
            // Fallback: download files individually
            files.forEach((file, index) => {
                setTimeout(() => {
                    this.downloadFile(file.blob, file.name);
                }, index * 500);
            });
        }
    }

    // Download with custom options
    downloadWithOptions(blob, filename, options = {}) {
        const defaultOptions = {
            showNotification: true,
            openInNewTab: false,
            addToHistory: true
        };

        const finalOptions = { ...defaultOptions, ...options };

        if (finalOptions.openInNewTab) {
            // Open in new tab instead of downloading
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            window.URL.revokeObjectURL(url);
            return true;
        }

        return this.downloadFile(blob, filename, {
            showNotification: finalOptions.showNotification
        });
    }
}

// Create global instance
window.universalDownloader = new UniversalDownloader();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalDownloader;
}
