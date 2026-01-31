/**
 * Tool Upload Integration - All 20 PDF Tools
 * Integrates universal upload handler with individual tools
 */

class ToolUploadIntegration {
    constructor() {
        this.toolConfigs = {
            // Convert to PDF tools
            'word-to-pdf': {
                allowedTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'excel-to-pdf': {
                allowedTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'powerpoint-to-pdf': {
                allowedTypes: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'html-to-pdf': {
                allowedTypes: ['text/html', 'text/plain'],
                multipleFiles: false,
                maxFileSize: 10 * 1024 * 1024
            },
            'jpg-to-pdf': {
                allowedTypes: ['image/jpeg', 'image/jpg'],
                multipleFiles: true,
                maxFileSize: 50 * 1024 * 1024
            },
            
            // Convert from PDF tools
            'pdf-to-word': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'pdf-to-excel': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'pdf-to-powerpoint': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'pdf-to-jpg': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'pdf-to-html': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            
            // Organize PDF tools
            'merge-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: true,
                maxFileSize: 50 * 1024 * 1024
            },
            'split-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'crop-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'rotate-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            
            // Optimize PDF tools
            'compress-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'optimize-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            
            // Edit & Secure PDF tools
            'protect-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'unlock-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'add-watermark': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'edit-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            },
            'sign-pdf': {
                allowedTypes: ['application/pdf'],
                multipleFiles: false,
                maxFileSize: 50 * 1024 * 1024
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🔧 Tool Upload Integration Initialized');
        this.detectCurrentTool();
        this.setupToolSpecificHandlers();
    }
    
    detectCurrentTool() {
        // Detect current tool based on URL or page title
        const currentPath = window.location.pathname;
        const pageTitle = document.title;
        
        console.log('🔍 Detecting current tool...');
        console.log('Path:', currentPath);
        console.log('Title:', pageTitle);
        
        // Try to detect tool from path
        for (const [toolName, config] of Object.entries(this.toolConfigs)) {
            if (currentPath.includes(toolName) || pageTitle.toLowerCase().includes(toolName.replace('-', ' '))) {
                this.currentTool = toolName;
                this.currentConfig = config;
                console.log(`✅ Detected tool: ${toolName}`);
                return;
            }
        }
        
        // Default fallback
        this.currentTool = 'default';
        this.currentConfig = {
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg'],
            multipleFiles: false,
            maxFileSize: 50 * 1024 * 1024
        };
        console.log('⚠️ Using default tool configuration');
    }
    
    setupToolSpecificHandlers() {
        if (!window.universalUploadHandler) {
            console.error('❌ Universal Upload Handler not found');
            return;
        }
        
        console.log(`🛠️ Setting up handlers for ${this.currentTool}`);
        
        // Create tool-specific upload handler
        const toolHandler = new UniversalUploadHandler(this.currentConfig);
        
        // Set up tool-specific callbacks
        toolHandler.onFilesSelected = (files) => {
            console.log(`📁 Files selected for ${this.currentTool}:`, files);
            this.handleFilesSelected(files);
        };
        
        toolHandler.onFilesRemoved = () => {
            console.log(`🗑️ Files removed from ${this.currentTool}`);
            this.handleFilesRemoved();
        };
        
        // Store handler reference
        window.currentToolUploadHandler = toolHandler;
        
        // Set up tool-specific UI updates
        this.setupToolUI();
        
        console.log(`✅ ${this.currentTool} upload handlers ready`);
    }
    
    handleFilesSelected(files) {
        // Update tool-specific state
        this.updateToolState(files);
        
        // Enable tool-specific actions
        this.enableToolActions();
        
        // Show file-specific information
        this.displayFileInfo(files);
        
        // Trigger tool-specific processing if needed
        this.triggerToolProcessing(files);
    }
    
    handleFilesRemoved() {
        // Clear tool-specific state
        this.clearToolState();
        
        // Disable tool-specific actions
        this.disableToolActions();
        
        // Clear file information
        this.clearFileInfo();
    }
    
    updateToolState(files) {
        // Store files in tool-specific variable
        window.currentToolFiles = files;
        
        // Update any tool-specific counters or displays
        const fileCountElements = document.querySelectorAll('.file-count, .selected-files-count');
        fileCountElements.forEach(element => {
            element.textContent = files.length;
        });
        
        // Update file type specific displays
        this.updateFileTypeDisplay(files);
    }
    
    updateFileTypeDisplay(files) {
        const fileTypeElements = document.querySelectorAll('.file-type-display, .selected-file-type');
        
        if (files.length === 1) {
            const file = files[0];
            let fileType = 'Unknown';
            
            if (file.type.includes('pdf')) fileType = 'PDF';
            else if (file.type.includes('jpeg') || file.type.includes('jpg')) fileType = 'JPG';
            else if (file.type.includes('word')) fileType = 'Word';
            else if (file.type.includes('excel') || file.type.includes('spreadsheet')) fileType = 'Excel';
            else if (file.type.includes('powerpoint') || file.type.includes('presentation')) fileType = 'PowerPoint';
            else if (file.type.includes('html')) fileType = 'HTML';
            
            fileTypeElements.forEach(element => {
                element.textContent = fileType;
            });
        } else {
            fileTypeElements.forEach(element => {
                element.textContent = `${files.length} files`;
            });
        }
    }
    
    enableToolActions() {
        // Enable convert, process, or action buttons
        const actionButtons = document.querySelectorAll('.convert-btn, .process-btn, .action-btn, .next-step-btn');
        actionButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
        
        // Show next step or options section
        const nextSteps = document.querySelectorAll('.step-2, .options-section, .process-section');
        nextSteps.forEach(section => {
            section.style.display = 'block';
        });
    }
    
    disableToolActions() {
        // Disable action buttons
        const actionButtons = document.querySelectorAll('.convert-btn, .process-btn, .action-btn, .next-step-btn');
        actionButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
        
        // Hide next steps
        const nextSteps = document.querySelectorAll('.step-2, .options-section, .process-section');
        nextSteps.forEach(section => {
            section.style.display = 'none';
        });
    }
    
    displayFileInfo(files) {
        // Update file information displays
        const infoElements = document.querySelectorAll('.file-info-display, .selected-file-info');
        infoElements.forEach(element => {
            if (files.length === 1) {
                element.innerHTML = `
                    <div style="font-weight: 600; color: #1f2937;">${files[0].name}</div>
                    <div style="font-size: 12px; color: #6b7280;">${this.formatFileSize(files[0].size)}</div>
                `;
            } else {
                element.innerHTML = `
                    <div style="font-weight: 600; color: #1f2937;">${files.length} files selected</div>
                    <div style="font-size: 12px; color: #6b7280;">Total: ${this.formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}</div>
                `;
            }
        });
    }
    
    clearFileInfo() {
        // Clear file information displays
        const infoElements = document.querySelectorAll('.file-info-display, .selected-file-info');
        infoElements.forEach(element => {
            element.innerHTML = '<div style="color: #6b7280;">No files selected</div>';
        });
    }
    
    clearToolState() {
        window.currentToolFiles = [];
        
        // Clear counters
        const fileCountElements = document.querySelectorAll('.file-count, .selected-files-count');
        fileCountElements.forEach(element => {
            element.textContent = '0';
        });
        
        // Clear file type displays
        const fileTypeElements = document.querySelectorAll('.file-type-display, .selected-file-type');
        fileTypeElements.forEach(element => {
            element.textContent = 'None';
        });
    }
    
    setupToolUI() {
        // Set up tool-specific UI elements
        this.setupDragAndDropUI();
        this.setupProgressBar();
        this.setupErrorHandling();
    }
    
    setupDragAndDropUI() {
        // Enhance drag and drop with tool-specific messaging
        const dropZones = document.querySelectorAll('.upload-box, .upload-area, .drop-zone');
        
        dropZones.forEach(zone => {
            // Add tool-specific drag messages
            zone.addEventListener('dragover', () => {
                const message = this.getDragMessage();
                this.updateDragMessage(zone, message);
            });
        });
    }
    
    getDragMessage() {
        const messages = {
            'word-to-pdf': 'Drop Word document here',
            'excel-to-pdf': 'Drop Excel spreadsheet here',
            'powerpoint-to-pdf': 'Drop PowerPoint presentation here',
            'html-to-pdf': 'Drop HTML file here',
            'jpg-to-pdf': 'Drop JPG images here',
            'pdf-to-word': 'Drop PDF to convert to Word',
            'pdf-to-excel': 'Drop PDF to convert to Excel',
            'pdf-to-powerpoint': 'Drop PDF to convert to PowerPoint',
            'pdf-to-jpg': 'Drop PDF to convert to JPG',
            'pdf-to-html': 'Drop PDF to convert to HTML',
            'merge-pdf': 'Drop PDFs to merge',
            'split-pdf': 'Drop PDF to split',
            'crop-pdf': 'Drop PDF to crop',
            'rotate-pdf': 'Drop PDF to rotate',
            'compress-pdf': 'Drop PDF to compress',
            'optimize-pdf': 'Drop PDF to optimize',
            'protect-pdf': 'Drop PDF to protect',
            'unlock-pdf': 'Drop PDF to unlock',
            'add-watermark': 'Drop PDF to add watermark',
            'edit-pdf': 'Drop PDF to edit',
            'sign-pdf': 'Drop PDF to sign'
        };
        
        return messages[this.currentTool] || 'Drop files here';
    }
    
    updateDragMessage(zone, message) {
        const messageElement = zone.querySelector('.drag-message, .drop-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
    
    setupProgressBar() {
        // Set up progress bar for file processing
        const progressBars = document.querySelectorAll('.progress-bar, .upload-progress');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 0.3s ease';
        });
    }
    
    setupErrorHandling() {
        // Set up tool-specific error handling
        window.addEventListener('unhandledrejection', (event) => {
            console.error(`❌ ${this.currentTool} upload error:`, event.reason);
            this.showUploadError('An error occurred during file upload. Please try again.');
        });
    }
    
    showUploadError(message) {
        // Show tool-specific error message
        const errorElements = document.querySelectorAll('.upload-error, .error-message');
        errorElements.forEach(element => {
            element.textContent = message;
            element.style.display = 'block';
            element.style.color = '#ef4444';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElements.forEach(element => {
                element.style.display = 'none';
            });
        }, 5000);
    }
    
    triggerToolProcessing(files) {
        // Trigger tool-specific processing if auto-processing is enabled
        if (this.shouldAutoProcess()) {
            console.log(`🔄 Auto-processing ${this.currentTool}...`);
            
            // Show progress
            this.showProgress();
            
            // Simulate processing (replace with actual tool processing)
            setTimeout(() => {
                this.hideProgress();
                this.showProcessingComplete();
            }, 2000);
        }
    }
    
    shouldAutoProcess() {
        // Define which tools should auto-process
        const autoProcessTools = ['compress-pdf', 'optimize-pdf', 'rotate-pdf'];
        return autoProcessTools.includes(this.currentTool);
    }
    
    showProgress() {
        const progressContainers = document.querySelectorAll('.progress-container, .upload-progress-container');
        progressContainers.forEach(container => {
            container.style.display = 'block';
        });
        
        const progressBars = document.querySelectorAll('.progress-bar, .upload-progress');
        progressBars.forEach(bar => {
            bar.style.width = '100%';
        });
    }
    
    hideProgress() {
        const progressContainers = document.querySelectorAll('.progress-container, .upload-progress-container');
        progressContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        const progressBars = document.querySelectorAll('.progress-bar, .upload-progress');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }
    
    showProcessingComplete() {
        // Show completion message
        const completionElements = document.querySelectorAll('.processing-complete, .upload-complete');
        completionElements.forEach(element => {
            element.textContent = `${this.currentTool.replace('-', ' ').toUpperCase()} processing complete!`;
            element.style.display = 'block';
            element.style.color = '#10b981';
        });
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize tool upload integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM ready - Initializing Tool Upload Integration');
    
    // Wait for universal upload handler to be ready
    if (window.universalUploadHandler) {
        window.toolUploadIntegration = new ToolUploadIntegration();
        console.log('✅ Tool Upload Integration ready');
    } else {
        console.warn('⚠️ Universal Upload Handler not found, retrying...');
        setTimeout(() => {
            if (window.universalUploadHandler) {
                window.toolUploadIntegration = new ToolUploadIntegration();
                console.log('✅ Tool Upload Integration ready (delayed)');
            }
        }, 1000);
    }
});

// Export for use in individual tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolUploadIntegration;
}
