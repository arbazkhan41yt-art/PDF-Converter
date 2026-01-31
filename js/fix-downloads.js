// Master Download Fix Script - Apply to all tools
document.addEventListener('DOMContentLoaded', function() {
    fixAllDownloadButtons();
});

function fixAllDownloadButtons() {
    // Fix download buttons in all tools
    const downloadButtons = document.querySelectorAll('[id*="downloadBtn"], .download-btn');
    
    downloadButtons.forEach(button => {
        // Add click event listener if not already present
        if (!button.hasAttribute('data-download-fixed')) {
            button.setAttribute('data-download-fixed', 'true');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleDownloadClick(this);
            });
        }
    });
}

function handleDownloadClick(button) {
    // Get the tool type from the page URL or body class
    const toolType = getToolType();
    const downloadData = getDownloadData(toolType);
    
    if (downloadData && downloadData.blob) {
        const filename = downloadData.filename || generateFilename(toolType);
        
        // Use universal downloader
        try {
            window.universalDownloader.downloadFile(downloadData.blob, filename);
            
            // Show success notification
            showSuccessNotification(filename);
            
        } catch (error) {
            console.error('Download failed:', error);
            
            // Fallback methods
            tryFallbackDownload(downloadData.blob, filename);
        }
    } else {
        // Try to get blob from global variables
        tryGlobalDownload(button);
    }
}

function getToolType() {
    // Get tool type from URL or body class
    const url = window.location.pathname;
    const bodyClass = document.body.className;
    
    if (url.includes('protect-pdf')) return 'protect-pdf';
    if (url.includes('jpg-to-pdf')) return 'jpg-to-pdf';
    if (url.includes('pdf-to-word')) return 'pdf-to-word';
    if (url.includes('pdf-to-excel')) return 'pdf-to-excel';
    if (url.includes('pdf-to-ppt')) return 'pdf-to-ppt';
    if (url.includes('pdf-to-jpg')) return 'pdf-to-jpg';
    if (url.includes('word-to-pdf')) return 'word-to-pdf';
    if (url.includes('excel-to-pdf')) return 'excel-to-pdf';
    if (url.includes('ppt-to-pdf')) return 'ppt-to-pdf';
    if (url.includes('html-to-pdf')) return 'html-to-pdf';
    if (url.includes('pdf-to-pdfa')) return 'pdf-to-pdfa';
    
    // Try body class
    if (bodyClass.includes('protect-pdf')) return 'protect-pdf';
    if (bodyClass.includes('jpg-to-pdf')) return 'jpg-to-pdf';
    
    return 'unknown';
}

function getDownloadData(toolType) {
    // Get download data based on tool type
    switch (toolType) {
        case 'protect-pdf':
            return {
                blob: window.protectedPdfBlob,
                filename: generateFilename('protected')
            };
        case 'jpg-to-pdf':
            return {
                blob: window.convertedPdfBlob,
                filename: generateFilename('images')
            };
        case 'pdf-to-word':
            return {
                blob: window.convertedWordBlob,
                filename: generateFilename('word')
            };
        case 'pdf-to-excel':
            return {
                blob: window.convertedExcelBlob,
                filename: generateFilename('excel')
            };
        case 'pdf-to-ppt':
            return {
                blob: window.convertedPPTBlob,
                filename: generateFilename('presentation')
            };
        case 'pdf-to-jpg':
            return {
                blob: window.convertedImagesBlob,
                filename: generateFilename('images')
            };
        default:
            return null;
    }
}

function generateFilename(type) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    switch (type) {
        case 'protected':
            return `protected_${timestamp}.pdf`;
        case 'images':
            return `converted_${timestamp}.pdf`;
        case 'word':
            return `converted_${timestamp}.docx`;
        case 'excel':
            return `converted_${timestamp}.xlsx`;
        case 'presentation':
            return `converted_${timestamp}.pptx`;
        default:
            return `converted_${timestamp}.pdf`;
    }
}

function tryFallbackDownload(blob, filename) {
    // Try FileSaver.js first
    if (typeof saveAs !== 'undefined') {
        try {
            saveAs(blob, filename);
            showSuccessNotification(filename);
            return;
        } catch (error) {
            console.error('FileSaver.js failed:', error);
        }
    }
    
    // Try direct download
    try {
        directDownload(blob, filename);
        showSuccessNotification(filename);
    } catch (error) {
        console.error('Direct download failed:', error);
        showErrorNotification(filename);
    }
}

function directDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
}

function tryGlobalDownload(button) {
    // Try to find blob in global variables
    const possibleBlobs = [
        'protectedPdfBlob',
        'convertedPdfBlob',
        'convertedWordBlob',
        'convertedExcelBlob',
        'convertedPPTBlob',
        'convertedImagesBlob'
    ];
    
    for (const blobName of possibleBlobs) {
        if (window[blobName]) {
            const filename = generateFilename(blobName.replace('Blob', '').toLowerCase());
            tryFallbackDownload(window[blobName], filename);
            return;
        }
    }
    
    // If no blob found, show error
    showErrorNotification('No file to download');
}

function showSuccessNotification(filename) {
    showNotification('Download Started', `Downloading ${filename}...`, 'success');
}

function showErrorNotification(filename) {
    showNotification('Download Failed', `Failed to download ${filename}`, 'error');
}

function showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `download-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Auto-fix download buttons every 2 seconds (for dynamic content)
setInterval(fixAllDownloadButtons, 2000);

// Export for manual use
window.fixDownloads = fixAllDownloadButtons;
