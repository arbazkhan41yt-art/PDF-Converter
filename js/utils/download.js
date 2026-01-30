// Download Utility
class DownloadManager {
    constructor() {
        this.downloadQueue = [];
        this.isProcessing = false;
    }

    // Download single file
    downloadFile(blob, filename, options = {}) {
        const defaultOptions = {
            openInNewTab: false,
            replaceExisting: true,
            showNotification: true,
            ...options
        };

        try {
            // Create download URL
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            
            if (defaultOptions.openInNewTab) {
                a.target = '_blank';
            }
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up URL
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
            
            // Show notification if enabled
            if (defaultOptions.showNotification) {
                this.showNotification(`Downloaded: ${filename}`, 'success');
            }
            
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            if (defaultOptions.showNotification) {
                this.showNotification(`Download failed: ${filename}`, 'error');
            }
            return false;
        }
    }

    // Download multiple files as ZIP
    async downloadAsZip(files, zipFilename, options = {}) {
        try {
            // Check if JSZip is available
            if (typeof JSZip === 'undefined') {
                // Load JSZip dynamically
                await this.loadJSZip();
            }

            const zip = new JSZip();
            
            // Add files to ZIP
            for (const file of files) {
                if (file.blob) {
                    zip.file(file.filename, file.blob);
                } else if (file.url) {
                    // Download file from URL and add to ZIP
                    const response = await fetch(file.url);
                    const blob = await response.blob();
                    zip.file(file.filename, blob);
                }
            }
            
            // Generate ZIP file
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            
            // Download ZIP
            return this.downloadFile(zipBlob, zipFilename, options);
        } catch (error) {
            console.error('ZIP download failed:', error);
            this.showNotification('Failed to create ZIP file', 'error');
            return false;
        }
    }

    // Load JSZip library dynamically
    loadJSZip() {
        return new Promise((resolve, reject) => {
            if (typeof JSZip !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Queue multiple downloads
    queueDownload(files, options = {}) {
        const defaultOptions = {
            delayBetweenDownloads: 500,
            maxConcurrent: 1,
            ...options
        };

        files.forEach(file => {
            this.downloadQueue.push({
                ...file,
                options: defaultOptions
            });
        });

        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    // Process download queue
    async processQueue() {
        if (this.downloadQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const file = this.downloadQueue.shift();

        try {
            if (file.blob) {
                await this.downloadFile(file.blob, file.filename, file.options);
            } else if (file.url) {
                const response = await fetch(file.url);
                const blob = await response.blob();
                await this.downloadFile(blob, file.filename, file.options);
            }
        } catch (error) {
            console.error('Queue download failed:', error);
        }

        // Delay before next download
        setTimeout(() => {
            this.processQueue();
        }, file.options.delayBetweenDownloads);
    }

    // Download from Canvas (for images)
    downloadCanvas(canvas, filename, format = 'png', quality = 0.9) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const success = this.downloadFile(blob, filename);
                resolve(success);
            }, `image/${format}`, quality);
        });
    }

    // Download text content as file
    downloadText(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        return this.downloadFile(blob, filename);
    }

    // Download JSON content
    downloadJSON(data, filename, pretty = true) {
        const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        const blob = new Blob([content], { type: 'application/json' });
        return this.downloadFile(blob, filename);
    }

    // Download CSV content
    downloadCSV(data, filename) {
        let csvContent = '';
        
        if (Array.isArray(data)) {
            if (data.length > 0 && typeof data[0] === 'object') {
                // Array of objects - create headers
                const headers = Object.keys(data[0]);
                csvContent += headers.join(',') + '\n';
                
                // Add data rows
                data.forEach(row => {
                    const values = headers.map(header => {
                        const value = row[header];
                        // Escape quotes and wrap in quotes if needed
                        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    });
                    csvContent += values.join(',') + '\n';
                });
            } else {
                // Simple array
                csvContent = data.join('\n');
            }
        } else {
            csvContent = data.toString();
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        return this.downloadFile(blob, filename);
    }

    // Generate unique filename
    generateUniqueFilename(originalFilename, prefix = '', suffix = '') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const extension = originalFilename.split('.').pop();
        const baseName = originalFilename.split('.').slice(0, -1).join('.');
        
        const parts = [prefix, baseName, suffix, timestamp].filter(Boolean);
        return `${parts.join('_')}.${extension}`;
    }

    // Show download notification
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.download-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `download-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add styles
        this.addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    addNotificationStyles() {
        const styleId = 'download-notification-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .download-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 10000;
                    min-width: 300px;
                    border-left: 4px solid #3b82f6;
                    animation: slideIn 0.3s ease;
                }
                .download-notification.success {
                    border-left-color: #22c55e;
                }
                .download-notification.error {
                    border-left-color: #dc2626;
                }
                .download-notification.warning {
                    border-left-color: #f59e0b;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-icon {
                    font-size: 18px;
                    font-weight: bold;
                }
                .notification-message {
                    font-size: 14px;
                    color: #1f2937;
                }
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
            `;
            document.head.appendChild(style);
        }
    }

    // Check if browser supports file downloads
    isDownloadSupported() {
        return 'download' in document.createElement('a');
    }

    // Get file size from blob
    getFileSize(blob) {
        const bytes = blob.size;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Clear download queue
    clearQueue() {
        this.downloadQueue = [];
        this.isProcessing = false;
    }

    // Get queue status
    getQueueStatus() {
        return {
            queueLength: this.downloadQueue.length,
            isProcessing: this.isProcessing
        };
    }
}

// Create global instance
window.downloadManager = new DownloadManager();

// Export for use in other modules
window.DownloadManager = DownloadManager;
