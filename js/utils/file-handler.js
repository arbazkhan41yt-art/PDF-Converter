// File Handler Utility
class FileHandler {
    constructor() {
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.supportedTypes = {
            'pdf': ['application/pdf'],
            'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            'word': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
            'excel': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
            'powerpoint': ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint']
        };
    }

    // Validate file type and size
    validateFile(file, allowedTypes = 'all') {
        const errors = [];

        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push(`File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`);
        }

        // Check file type
        if (allowedTypes !== 'all') {
            const allowedMimeTypes = this.getAllowedMimeTypes(allowedTypes);
            if (!allowedMimeTypes.includes(file.type)) {
                errors.push(`File type ${file.type} is not supported`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Get allowed MIME types based on category
    getAllowedMimeTypes(category) {
        if (category === 'all') {
            return Object.values(this.supportedTypes).flat();
        }
        return this.supportedTypes[category] || [];
    }

    // Read file as ArrayBuffer
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    // Read file as Data URL
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Read file as Text
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get file extension
    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    // Setup drag and drop
    setupDragAndDrop(element, onDrop, allowedTypes = 'all') {
        let dragCounter = 0;

        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const highlight = () => {
            element.classList.add('dragover');
        };

        const unhighlight = () => {
            element.classList.remove('dragover');
        };

        const handleDrop = (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;

            this.handleFiles(files, onDrop, allowedTypes);
        };

        // Drag events
        element.addEventListener('dragenter', (e) => {
            preventDefaults(e);
            dragCounter++;
            highlight();
        });

        element.addEventListener('dragleave', (e) => {
            preventDefaults(e);
            dragCounter--;
            if (dragCounter === 0) {
                unhighlight();
            }
        });

        element.addEventListener('dragover', preventDefaults);

        element.addEventListener('drop', (e) => {
            preventDefaults(e);
            unhighlight();
            dragCounter = 0;
            handleDrop(e);
        });
    }

    // Handle multiple files
    async handleFiles(files, onDrop, allowedTypes = 'all') {
        const validFiles = [];
        const errors = [];

        for (let file of files) {
            const validation = this.validateFile(file, allowedTypes);
            
            if (validation.isValid) {
                validFiles.push(file);
            } else {
                errors.push({
                    file: file.name,
                    errors: validation.errors
                });
            }
        }

        // Show errors if any
        if (errors.length > 0) {
            this.showFileErrors(errors);
        }

        // Process valid files
        if (validFiles.length > 0) {
            onDrop(validFiles);
        }
    }

    // Show file errors
    showFileErrors(errors) {
        const errorHtml = errors.map(error => 
            `<div>
                <strong>${error.file}:</strong> ${error.errors.join(', ')}
            </div>`
        ).join('');

        this.showError(errorHtml);
    }

    // Show error message
    showError(message) {
        const existingError = document.querySelector('.file-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'file-error error-message';
        errorDiv.innerHTML = message;

        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.parentNode.insertBefore(errorDiv, uploadArea.nextSibling);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Create file item element
    createFileItem(file, onRemove = null) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = this.getFileIcon(file.type);
        const fileSize = this.formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${fileIcon}</div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${fileSize}</p>
                </div>
            </div>
            <div class="file-actions">
                ${onRemove ? `<button class="remove-file-btn" title="Remove file">✕</button>` : ''}
            </div>
        `;

        if (onRemove) {
            const removeBtn = fileItem.querySelector('.remove-file-btn');
            removeBtn.addEventListener('click', () => onRemove(file, fileItem));
        }

        return fileItem;
    }

    // Get file icon based on type
    getFileIcon(mimeType) {
        const iconMap = {
            'application/pdf': '📄',
            'image/jpeg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🖼️',
            'image/webp': '🖼️',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📽️',
            'application/vnd.ms-powerpoint': '📽️'
        };

        return iconMap[mimeType] || '📄';
    }

    // Setup file input
    setupFileInput(inputElement, onChange, allowedTypes = 'all') {
        inputElement.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.handleFiles(files, onChange, allowedTypes);
            }
            // Clear input value to allow selecting same file again
            e.target.value = '';
        });
    }

    // Download file
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Create blob from data URL
    dataURLToBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], {type:mime});
    }

    // Check if file is password protected (for PDFs)
    async isPasswordProtectedPDF(file) {
        try {
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            return false; // If loaded successfully, not password protected
        } catch (error) {
            if (error.name === 'PasswordException') {
                return true;
            }
            throw error;
        }
    }

    // Get file metadata
    getFileMetadata(file) {
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            extension: this.getFileExtension(file.name),
            sizeFormatted: this.formatFileSize(file.size)
        };
    }
}

// Export for use in other modules
window.FileHandler = FileHandler;
