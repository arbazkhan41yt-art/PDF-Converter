/**
 * Universal File Upload Handler - All 20 PDF Tools
 * Handles file upload, drag & drop, validation, and preview for all tools
 */

class UniversalUploadHandler {
    constructor(options = {}) {
        this.options = {
            maxFileSize: options.maxFileSize || 50 * 1024 * 1024, // 50MB default
            allowedTypes: options.allowedTypes || ['image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            multipleFiles: options.multipleFiles || false,
            showPreview: options.showPreview !== false,
            ...options
        };
        
        this.selectedFiles = [];
        this.init();
    }

    init() {
        console.log('🚀 Universal Upload Handler Initialized');
        this.setupEventListeners();
        this.createHiddenFileInput();
    }

    createHiddenFileInput() {
        // Create hidden file input if it doesn't exist
        if (!document.getElementById('universal-file-input')) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'universal-file-input';
            fileInput.style.display = 'none';
            fileInput.multiple = this.options.multipleFiles;
            fileInput.accept = this.options.allowedTypes.join(',');
            document.body.appendChild(fileInput);
        }
    }

    setupEventListeners() {
        console.log('📝 Setting up upload event listeners...');
        
        // Browse button click events
        this.addClickListeners('.browse-btn', () => this.openFilePicker());
        this.addClickListeners('.upload-btn', () => this.openFilePicker());
        this.addClickListeners('.select-files-btn', () => this.openFilePicker());
        this.addClickListeners('.choose-file-btn', () => this.openFilePicker());
        this.addClickListeners('.browse-files-btn', () => this.openFilePicker());
        
        // Upload area click events
        this.addClickListeners('.upload-box', () => this.openFilePicker());
        this.addClickListeners('.upload-area', () => this.openFilePicker());
        this.addClickListeners('.drop-zone', () => this.openFilePicker());
        this.addClickListeners('.file-drop-area', () => this.openFilePicker());
        this.addClickListeners('.tool-upload-box', () => this.openFilePicker());
        
        // Drag and drop events
        this.setupDragAndDrop();
        
        // File input change event
        const fileInput = document.getElementById('universal-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        console.log('✅ Upload event listeners setup complete');
    }

    addClickListeners(selector, callback) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                callback();
            });
        });
    }

    setupDragAndDrop() {
        const dropZones = document.querySelectorAll('.upload-box, .upload-area, .drop-zone, .file-drop-area, .tool-upload-box');
        
        dropZones.forEach(zone => {
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, this.preventDefaults, false);
            });
            
            // Highlight drop zone when item is dragged over it
            ['dragenter', 'dragover'].forEach(eventName => {
                zone.addEventListener(eventName, () => this.highlight(zone), false);
            });
            
            // Remove highlight when item leaves
            ['dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, () => this.unhighlight(zone), false);
            });
            
            // Handle dropped files
            zone.addEventListener('drop', (e) => this.handleDrop(e), false);
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(element) {
        element.classList.add('dragover');
        element.style.borderColor = '#dc2626';
        element.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
    }

    unhighlight(element) {
        element.classList.remove('dragover');
        element.style.borderColor = '#d1d5db';
        element.style.backgroundColor = '#ffffff';
    }

    openFilePicker() {
        console.log('📂 Opening file picker...');
        const fileInput = document.getElementById('universal-file-input');
        if (fileInput) {
            fileInput.click();
        } else {
            console.error('❌ File input not found');
        }
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        console.log('📁 Files selected:', files);
        this.processFiles(files);
    }

    handleDrop(event) {
        console.log('🎯 Files dropped');
        const dt = event.dataTransfer;
        const files = Array.from(dt.files);
        this.processFiles(files);
    }

    processFiles(files) {
        console.log('🔄 Processing files:', files);
        
        // Clear previous files if not multiple
        if (!this.options.multipleFiles) {
            this.selectedFiles = [];
        }
        
        // Validate and process each file
        const validFiles = [];
        const invalidFiles = [];
        
        files.forEach(file => {
            console.log(`📋 Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);
            
            if (this.validateFile(file)) {
                validFiles.push(file);
                this.selectedFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });
        
        // Show feedback
        if (validFiles.length > 0) {
            this.showSuccessFeedback(validFiles);
            if (this.options.showPreview) {
                this.displayFilePreview(validFiles);
            }
            this.onFilesSelected(validFiles);
        }
        
        if (invalidFiles.length > 0) {
            this.showErrorFeedback(invalidFiles);
        }
        
        console.log('✅ File processing complete');
        console.log('Valid files:', validFiles);
        console.log('Invalid files:', invalidFiles);
    }

    validateFile(file) {
        console.log(`🔍 Validating file: ${file.name}`);
        
        // Check file size
        if (file.size > this.options.maxFileSize) {
            console.error(`❌ File too large: ${file.name} (${this.formatFileSize(file.size)} > ${this.formatFileSize(this.options.maxFileSize)})`);
            return false;
        }
        
        // Check file type
        if (this.options.allowedTypes.length > 0 && !this.options.allowedTypes.includes(file.type)) {
            console.error(`❌ Invalid file type: ${file.name} (${file.type})`);
            return false;
        }
        
        console.log(`✅ File valid: ${file.name}`);
        return true;
    }

    showSuccessFeedback(files) {
        // Update file info display
        const fileInfoElements = document.querySelectorAll('.file-info, .file-size-info, .upload-limit, .max-size-info');
        fileInfoElements.forEach(element => {
            if (files.length === 1) {
                element.textContent = `${files[0].name} (${this.formatFileSize(files[0].size)})`;
            } else {
                element.textContent = `${files.length} files selected`;
            }
        });
        
        // Show success message
        this.showNotification('Files uploaded successfully!', 'success');
    }

    showErrorFeedback(files) {
        const errorMessages = files.map(file => {
            if (file.size > this.options.maxFileSize) {
                return `${file.name}: File too large (max ${this.formatFileSize(this.options.maxFileSize)})`;
            }
            if (!this.options.allowedTypes.includes(file.type)) {
                return `${file.name}: Invalid file type`;
            }
            return `${file.name}: Invalid file`;
        });
        
        this.showNotification(errorMessages.join('\n'), 'error');
    }

    displayFilePreview(files) {
        console.log('🖼️ Displaying file preview...');
        
        // Create or update preview container
        let previewContainer = document.querySelector('.file-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'file-preview-container';
            previewContainer.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            `;
            
            // Insert after upload area
            const uploadArea = document.querySelector('.upload-box, .upload-area, .drop-zone');
            if (uploadArea) {
                uploadArea.parentNode.insertBefore(previewContainer, uploadArea.nextSibling);
            }
        }
        
        previewContainer.innerHTML = '';
        
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            `;
            
            fileItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span style="margin-right: 10px;">📄</span>
                    <div>
                        <div style="font-weight: 600; color: #1f2937;">${file.name}</div>
                        <div style="font-size: 12px; color: #6b7280;">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="remove-file-btn" data-index="${index}" style="
                    background: #dc2626;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                ">Remove</button>
            `;
            
            previewContainer.appendChild(fileItem);
        });
        
        // Add remove button event listeners
        previewContainer.querySelectorAll('.remove-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeFile(index);
            });
        });
    }

    removeFile(index) {
        console.log(`🗑️ Removing file at index ${index}`);
        this.selectedFiles.splice(index, 1);
        
        if (this.selectedFiles.length > 0) {
            this.displayFilePreview(this.selectedFiles);
        } else {
            // Clear preview
            const previewContainer = document.querySelector('.file-preview-container');
            if (previewContainer) {
                previewContainer.remove();
            }
            
            // Reset file info
            const fileInfoElements = document.querySelectorAll('.file-info, .file-size-info, .upload-limit, .max-size-info');
            fileInfoElements.forEach(element => {
                element.textContent = 'Maximum file size: 50MB';
            });
        }
        
        this.onFilesRemoved();
    }

    showNotification(message, type = 'info') {
        console.log(`🔔 ${type.toUpperCase()}: ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getSelectedFiles() {
        return this.selectedFiles;
    }

    clearFiles() {
        this.selectedFiles = [];
        const fileInput = document.getElementById('universal-file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clear preview
        const previewContainer = document.querySelector('.file-preview-container');
        if (previewContainer) {
            previewContainer.remove();
        }
        
        // Reset file info
        const fileInfoElements = document.querySelectorAll('.file-info, .file-size-info, .upload-limit, .max-size-info');
        fileInfoElements.forEach(element => {
            element.textContent = 'Maximum file size: 50MB';
        });
    }

    // Callback methods to be overridden by individual tools
    onFilesSelected(files) {
        console.log('🎉 Files selected callback:', files);
        // Override in individual tool implementations
    }

    onFilesRemoved() {
        console.log('🗑️ Files removed callback');
        // Override in individual tool implementations
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .dragover {
        border-color: #dc2626 !important;
        background-color: rgba(220, 38, 38, 0.05) !important;
        transform: scale(1.02);
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);

// Initialize universal upload handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM ready - Initializing Universal Upload Handler');
    
    // Auto-initialize with default settings
    window.universalUploadHandler = new UniversalUploadHandler();
    
    console.log('✅ Universal Upload Handler ready for all tools');
});

// Export for use in individual tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalUploadHandler;
}
