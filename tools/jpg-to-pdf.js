// JPG to PDF Tool - Complete Working Upload Functionality

class JPGToPDFTool {
    constructor() {
        this.selectedFiles = [];
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        this.isConverting = false;
        this.currentStep = 1;
        this.pdfBlob = null;
        this.pdfFileName = null;
        this.conversionOptions = {
            orientation: 'portrait',
            pageSize: 'a4',
            margin: 'no',
            mergeAll: true
        };
        
        this.init();
    }
    
    init() {
        console.log('🖼️ JPG to PDF Tool Initializing...');
        this.createHiddenFileInput();
        this.setupEventListeners();
        this.setupDragAndDrop();
        console.log('✅ JPG to PDF Tool Ready');
    }
    
    createHiddenFileInput() {
        // Create hidden file input if it doesn't exist
        if (!document.getElementById('jpg-file-input')) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'jpg-file-input';
            fileInput.accept = 'image/jpeg,image/jpg,image/png,image/webp';
            fileInput.multiple = true;
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            console.log('📁 Hidden file input created');
        }
    }
    
    setupEventListeners() {
        console.log('📝 Setting up event listeners...');
        
        // Browse button click event
        const browseBtn = document.getElementById('browseBtn');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                console.log('🔍 Browse button clicked');
                this.openFilePicker();
            });
        }
        
        // File input change event - Fixed auto-redirect
        const fileInput = document.getElementById('jpg-file-input');
        if (fileInput) {
            console.log('📁 File input found, adding change event listener');
            fileInput.addEventListener('change', (e) => {
                console.log('📂 Files selected via picker - Event fired!');
                console.log('📋 Selected files:', e.target.files);
                
                if (e.target.files && e.target.files.length > 0) {
                    // Use FileReader to read and validate the first file
                    const file = e.target.files[0];
                    console.log(`🔍 Processing file: ${file.name}, Type: ${file.type}, Size: ${this.formatFileSize(file.size)}`);
                    
                    // Validate file is image type
                    if (this.allowedTypes.includes(file.type)) {
                        console.log('✅ File type validated as image');
                        
                        // Show loading animation
                        this.showLoadingSpinner();
                        
                        // Use FileReader to read the image
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            console.log('📷 Image loaded successfully');
                            
                            // Use setTimeout for 500ms delay then show Step 2
                            setTimeout(() => {
                                console.log('🚀 Auto-redirecting to Step 2 after 500ms');
                                this.hideLoadingSpinner();
                                this.selectedFiles = Array.from(e.target.files);
                                this.goToStep2();
                                this.displayPreviewGrid();
                                this.showSuccess(`${e.target.files.length} image(s) loaded successfully!`);
                            }, 500);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        console.error('❌ Invalid file type:', file.type);
                        this.showError(`Invalid file type: ${file.type}. Only JPG, JPEG, PNG, WEBP allowed.`);
                    }
                } else {
                    console.log('⚠️ No files selected');
                }
            });
        } else {
            console.error('❌ File input not found!');
        }
        
        // Auto-redirect functionality - No Next button needed
        // File selection will automatically trigger Step 2
        
        // Convert button click event (Step 2)
        const convertBtn = document.getElementById('convertToPdfBtn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                console.log('🔄 Convert button clicked');
                this.convertToPDF();
            });
        }
        
        // Download button click event (Step 3)
        const downloadBtn = document.getElementById('downloadPdfBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                console.log('💾 Download button clicked');
                this.downloadPDF();
            });
        }
        
        // Back button click event (Step 3 to Step 1)
        const backBtn = document.getElementById('backToUploadBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('⬅️ Back button clicked');
                this.goToStep1();
            });
        }
        
        // Add more files button (Step 2)
        const addMoreBtn = document.getElementById('addMoreBtn');
        if (addMoreBtn) {
            addMoreBtn.addEventListener('click', () => {
                console.log('➕ Add more files clicked');
                this.openFilePicker();
            });
        }
        
        // Options event listeners
        this.setupOptionsListeners();
        
        console.log('✅ Event listeners setup complete');
    }
    
    setupDragAndDrop() {
        console.log('🎯 Setting up drag and drop...');
        
        const uploadBox = document.getElementById('uploadArea');
        if (!uploadBox) {
            console.error('❌ Upload box not found');
            return;
        }
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, this.preventDefaults, false);
        });
        
        // Highlight when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, () => this.highlight(uploadBox), false);
        });
        
        // Unhighlight when leaving
        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, () => this.unhighlight(uploadBox), false);
        });
        
        // Handle dropped files - Fixed auto-redirect
        uploadBox.addEventListener('drop', (e) => {
            console.log('📦 Files dropped - Event fired!');
            const files = e.dataTransfer.files;
            console.log('📋 Dropped files:', files);
            
            if (files && files.length > 0) {
                // Use FileReader to read and validate the first file
                const file = files[0];
                console.log(`🔍 Processing dropped file: ${file.name}, Type: ${file.type}, Size: ${this.formatFileSize(file.size)}`);
                
                // Validate file is image type
                if (this.allowedTypes.includes(file.type)) {
                    console.log('✅ Dropped file type validated as image');
                    
                    // Show loading animation
                    this.showLoadingSpinner();
                    
                    // Use FileReader to read the image
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        console.log('📷 Dropped image loaded successfully');
                        
                        // Use setTimeout for 500ms delay then show Step 2
                        setTimeout(() => {
                            console.log('🚀 Auto-redirecting to Step 2 after 500ms');
                            this.hideLoadingSpinner();
                            this.selectedFiles = Array.from(files);
                            this.goToStep2();
                            this.displayPreviewGrid();
                            this.showSuccess(`${files.length} image(s) loaded successfully!`);
                        }, 500);
                    };
                    reader.readAsDataURL(file);
                } else {
                    console.error('❌ Invalid dropped file type:', file.type);
                    this.showError(`Invalid file type: ${file.type}. Only JPG, JPEG, PNG, WEBP allowed.`);
                }
            } else {
                console.log('⚠️ No files dropped');
            }
        }, false);
        
        console.log('✅ Drag and drop setup complete');
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    highlight(element) {
        element.classList.add('dragover');
        element.style.borderColor = '#dc2626';
        element.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
        element.style.transform = 'scale(1.02)';
    }
    
    unhighlight(element) {
        element.classList.remove('dragover');
        element.style.borderColor = '#d1d5db';
        element.style.backgroundColor = '#ffffff';
        element.style.transform = 'scale(1)';
    }
    
    openFilePicker() {
        const fileInput = document.getElementById('jpg-file-input');
        if (fileInput) {
            fileInput.click();
        } else {
            console.error('❌ File input not found');
        }
    }
    
    handleFileSelect(files) {
        console.log('🔄 Handling file selection:', files);
        
        const validFiles = [];
        const errors = [];
        
        Array.from(files).forEach(file => {
            console.log(`📋 Processing: ${file.name}, Type: ${file.type}, Size: ${this.formatFileSize(file.size)}`);
            
            // Validate file type
            if (!this.allowedTypes.includes(file.type)) {
                errors.push(`${file.name}: Invalid file type. Only JPG, JPEG, PNG, WEBP allowed.`);
                return;
            }
            
            // Validate file size
            if (file.size > this.maxFileSize) {
                errors.push(`${file.name}: File too large. Maximum size is 50MB.`);
                return;
            }
            
            validFiles.push(file);
        });
        
        // Show errors if any
        if (errors.length > 0) {
            this.showError(errors.join('\n'));
            return;
        }
        
        if (validFiles.length > 0) {
            this.selectedFiles = validFiles;
            this.autoRedirectToOptions(validFiles);
        }
    }
    
    autoRedirectToOptions(files) {
        console.log('🚀 Auto-redirecting to options page...');
        
        // Show loading spinner
        this.showLoadingSpinner();
        
        // Simulate loading for 1 second, then go to Step 2
        setTimeout(() => {
            this.hideLoadingSpinner();
            this.goToStep2();
            this.showSuccess(`${files.length} file(s) loaded successfully!`);
        }, 1000);
    }
    
    showLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'block';
            setTimeout(() => {
                spinner.classList.add('show');
            }, 50);
        }
    }
    
    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.remove('show');
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 300);
        }
    }
    
    displayFilePreview(files) {
        console.log('🖼️ Displaying file preview...');
        
        const uploadBox = document.getElementById('uploadArea');
        if (!uploadBox) return;
        
        // Clear existing content
        const uploadContent = uploadBox.querySelector('.upload-content-centered');
        if (!uploadContent) return;
        
        // Create preview container
        let previewHTML = '<div class="file-preview-container">';
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imgSrc = e.target.result;
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 10px;
                    padding: 10px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    background: #f9fafb;
                `;
                
                previewItem.innerHTML = `
                    <img src="${imgSrc}" style="max-width: 150px; max-height: 150px; border-radius: 4px; margin-bottom: 8px;">
                    <div style="font-size: 12px; color: #1f2937; font-weight: 600; text-align: center;">${file.name}</div>
                    <div style="font-size: 10px; color: #6b7280;">${this.formatFileSize(file.size)}</div>
                    <button class="remove-file-btn" data-index="${index}" style="
                        margin-top: 8px;
                        background: #dc2626;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 11px;
                    ">Remove</button>
                `;
                
                // Add to preview container
                const container = uploadBox.querySelector('.file-preview-container') || uploadContent;
                container.appendChild(previewItem);
                
                // Add remove event listener
                previewItem.querySelector('.remove-file-btn').addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.removeFile(index);
                });
            };
            
            reader.readAsDataURL(file);
        });
        
        previewHTML += '</div>';
        
        // Update upload box content
        uploadContent.innerHTML = previewHTML;
        uploadContent.style.display = 'flex';
        uploadContent.style.flexWrap = 'wrap';
        uploadContent.style.justifyContent = 'center';
    }
    
    removeFile(index) {
        console.log(`🗑️ Removing file at index ${index}`);
        this.selectedFiles.splice(index, 1);
        
        if (this.selectedFiles.length === 0) {
            this.resetUploadBox();
            this.disableConvertButton();
        } else {
            this.displayFilePreview(this.selectedFiles);
        }
    }
    
    resetUploadBox() {
        const uploadBox = document.getElementById('uploadArea');
        if (!uploadBox) return;
        
        const uploadContent = uploadBox.querySelector('.upload-content-centered');
        if (!uploadContent) return;
        
        // Restore original content
        uploadContent.innerHTML = `
            <div class="folder-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
            <h3>Drop your images here</h3>
            <p>or click to browse</p>
            <button class="browse-btn" id="browseBtn">Browse Files</button>
            <div class="file-info">Maximum file size: 50MB</div>
        `;
        
        uploadContent.style.display = 'flex';
        uploadContent.style.flexDirection = 'column';
        
        // Re-attach browse button listener
        const newBrowseBtn = uploadContent.querySelector('#browseBtn');
        if (newBrowseBtn) {
            newBrowseBtn.addEventListener('click', () => this.openFilePicker());
        }
    }
    
    enableConvertButton() {
        const convertBtn = document.getElementById('convertBtn');
        const convertSection = document.getElementById('convertSection');
        
        if (convertBtn) {
            convertBtn.disabled = false;
            convertBtn.style.opacity = '1';
            convertBtn.style.cursor = 'pointer';
        }
        
        if (convertSection) {
            convertSection.style.display = 'block';
        }
    }
    
    disableConvertButton() {
        const convertBtn = document.getElementById('convertBtn');
        const convertSection = document.getElementById('convertSection');
        
        if (convertBtn) {
            convertBtn.disabled = true;
            convertBtn.style.opacity = '0.5';
            convertBtn.style.cursor = 'not-allowed';
        }
        
        if (convertSection) {
            convertSection.style.display = 'none';
        }
    }
    
    async convertToPDF() {
        console.log('🔄 Starting PDF conversion...');
        
        if (this.selectedFiles.length === 0) {
            this.showError('Please select at least one image file');
            return;
        }
        
        if (this.isConverting) {
            console.log('⏳ Conversion already in progress');
            return;
        }
        
        this.isConverting = true;
        this.showProgress();
        
        try {
            // Load jsPDF library
            if (typeof window.jspdf === 'undefined') {
                await this.loadJsPDF();
            }
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            let isFirstPage = true;
            
            for (const file of this.selectedFiles) {
                console.log(`📄 Converting: ${file.name}`);
                
                // Convert image to canvas
                const canvas = await this.imageToCanvas(file);
                
                if (!isFirstPage) {
                    pdf.addPage();
                }
                
                // Add canvas to PDF
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                // Calculate image dimensions to fit page
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const finalWidth = imgWidth * ratio;
                const finalHeight = imgHeight * ratio;
                
                const x = (pdfWidth - finalWidth) / 2;
                const y = (pdfHeight - finalHeight) / 2;
                
                pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
                isFirstPage = false;
            }
            
            // Save PDF blob
            this.pdfBlob = pdf.output('blob');
            this.pdfFileName = `converted_${Date.now()}.pdf`;
            
            console.log('✅ PDF conversion complete');
            this.hideProgress();
            this.showSuccess('Images converted to PDF successfully!');
            this.showDownloadSection();
            
        } catch (error) {
            console.error('❌ Conversion error:', error);
            this.hideProgress();
            this.showError('Failed to convert images to PDF. Please try again.');
        } finally {
            this.isConverting = false;
        }
    }
    
    async imageToCanvas(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas size to image size
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0);
                    
                    resolve(canvas);
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    
    async loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    downloadPDF() {
        if (!this.pdfBlob) {
            this.showError('No PDF to download');
            return;
        }
        
        console.log('💾 Downloading PDF...');
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(this.pdfBlob);
        link.download = this.pdfFileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up URL
        URL.revokeObjectURL(link.href);
        
        this.showSuccess('PDF downloaded successfully!');
    }
    
    showProgress() {
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        
        if (progressBar) {
            progressBar.style.width = '100%';
        }
    }
    
    hideProgress() {
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
        
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }
    
    showDownloadSection() {
        // Hide upload step
        const uploadStep = document.getElementById('uploadStep');
        if (uploadStep) {
            uploadStep.style.display = 'none';
        }
        
        // Show success step
        const successStep = document.getElementById('successStep');
        if (successStep) {
            successStep.style.display = 'block';
        }
    }
    
    showError(message) {
        console.error('❌ Error:', message);
        alert(message); // Simple error display - can be enhanced
    }
    
    showSuccess(message) {
        console.log('✅ Success:', message);
        // Can be enhanced with better UI
    }
    
    reset() {
        console.log('🔄 Resetting tool...');
        
        this.selectedFiles = [];
        this.pdfBlob = null;
        this.pdfFileName = null;
        this.isConverting = false;
        
        // Clear file input
        const fileInput = document.getElementById('jpg-file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Reset upload box
        this.resetUploadBox();
        this.disableConvertButton();
        
        // Hide progress
        this.hideProgress();
        
        // Show upload step, hide success step
        const uploadStep = document.getElementById('uploadStep');
        const successStep = document.getElementById('successStep');
        
        if (uploadStep) {
            uploadStep.style.display = 'block';
        }
        
        if (successStep) {
            successStep.style.display = 'none';
        }
        
        console.log('✅ Tool reset complete');
    }
    
    setupOptionsListeners() {
        console.log('⚙️ Setting up options listeners...');
        
        // Page orientation options
        const orientationOptions = document.querySelectorAll('.orientation-option');
        orientationOptions.forEach(option => {
            option.addEventListener('click', () => {
                const orientation = option.dataset.orientation;
                this.updateOrientationSelection(orientation);
                this.updateLivePreview(); // Update preview on orientation change
            });
        });
        
        // Page size dropdown - Live Preview
        const pageSizeDropdown = document.getElementById('pageSize');
        if (pageSizeDropdown) {
            pageSizeDropdown.addEventListener('change', (e) => {
                this.conversionOptions.pageSize = e.target.value;
                console.log('📄 Page size changed to:', e.target.value);
                this.updateLivePreview(); // Update preview on page size change
            });
        }
        
        // Margin options - Live Preview
        const marginOptions = document.querySelectorAll('.margin-option');
        marginOptions.forEach(option => {
            option.addEventListener('click', () => {
                const margin = option.dataset.margin;
                this.updateMarginSelection(margin);
                this.updateLivePreview(); // Update preview on margin change
            });
        });
        
        // Merge checkbox
        const mergeCheckbox = document.getElementById('mergeAllImages');
        if (mergeCheckbox) {
            mergeCheckbox.addEventListener('change', (e) => {
                this.conversionOptions.mergeAll = e.target.checked;
                console.log('🔗 Merge all images:', e.target.checked);
            });
        }
    }
    
    updateLivePreview() {
        console.log('🔄 Updating live preview...');
        
        const previewItems = document.querySelectorAll('.preview-item');
        const previewGrid = document.getElementById('previewGrid');
        
        if (!previewGrid || previewItems.length === 0) {
            console.log('⚠️ No preview items to update');
            return;
        }
        
        // Add updating animation
        previewItems.forEach(item => {
            item.classList.add('updating');
        });
        
        setTimeout(() => {
            // Update margin effects
            this.updateMarginPreview(previewItems);
            
            // Update page size effects
            this.updatePageSizePreview(previewGrid);
            
            // Update orientation effects
            this.updateOrientationPreview(previewGrid);
            
            // Remove updating animation and add updated animation
            previewItems.forEach(item => {
                item.classList.remove('updating');
                item.classList.add('updated');
            });
            
            setTimeout(() => {
                previewItems.forEach(item => {
                    item.classList.remove('updated');
                });
            }, 300);
            
        }, 150);
    }
    
    updateMarginPreview(previewItems) {
        const margin = this.conversionOptions.margin;
        console.log('🎨 Updating margin preview to:', margin);
        
        previewItems.forEach(item => {
            // Remove all margin classes
            item.classList.remove('no-margin', 'small-margin', 'big-margin');
            
            // Add current margin class
            item.classList.add(`${margin}-margin`);
        });
    }
    
    updatePageSizePreview(previewGrid) {
        const pageSize = this.conversionOptions.pageSize;
        console.log('📐 Updating page size preview to:', pageSize);
        
        // Remove all page size classes
        previewGrid.classList.remove('a4-size', 'letter-size', 'legal-size', 'a3-size', 'a5-size');
        
        // Add current page size class
        previewGrid.classList.add(`${pageSize}-size`);
    }
    
    updateOrientationPreview(previewGrid) {
        const orientation = this.conversionOptions.orientation;
        console.log('🔄 Updating orientation preview to:', orientation);
        
        // Remove landscape class
        previewGrid.classList.remove('landscape');
        
        // Add landscape class if needed
        if (orientation === 'landscape') {
            previewGrid.classList.add('landscape');
        }
    }
    
    updateMarginSelection(margin) {
        document.querySelectorAll('.margin-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-margin="${margin}"]`).classList.add('selected');
    }
    
    goToStep2() {
        console.log('➡️ Going to Step 2');
        
        if (this.selectedFiles.length === 0) {
            this.showError('Please select at least one image file');
            return;
        }
        
        this.currentStep = 2;
        this.showStep(2);
        this.displayPreviewGrid();
    }
    
    goToStep1() {
        console.log('⬅️ Going to Step 1');
        this.currentStep = 1;
        this.showStep(1);
    }
    
    goToStep3() {
        console.log('⬆️ Going to Step 3');
        this.currentStep = 3;
        this.showStep(3);
    }
    
    showStep(stepNumber) {
        console.log(`📍 Showing Step ${stepNumber}`);
        
        // Hide all steps
        document.querySelectorAll('.step-container').forEach(step => {
            console.log(`🙈 Hiding step: ${step.id}`);
            step.style.display = 'none';
        });
        
        // Show current step with fade in
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            console.log(`👁️ Showing step: ${currentStepElement.id}`);
            currentStepElement.style.display = 'block';
            currentStepElement.style.opacity = '0';
            currentStepElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                currentStepElement.style.transition = 'all 0.3s ease';
                currentStepElement.style.opacity = '1';
                currentStepElement.style.transform = 'translateY(0)';
                console.log(`✅ Step ${stepNumber} is now visible`);
            }, 50);
        } else {
            console.error(`❌ Step ${stepNumber} element not found!`);
        }
    }
    
    displayPreviewGrid() {
        const previewGrid = document.getElementById('previewGrid');
        if (!previewGrid) return;
        
        previewGrid.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="file-name">${file.name}</div>
                `;
                
                previewGrid.appendChild(previewItem);
                
                // Apply current settings to the new preview item
                this.updateLivePreview();
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    displayFileInfo(files) {
        console.log('🖼️ Displaying file info...');
        
        const fileInfoDisplay = document.getElementById('fileInfoDisplay');
        const selectedFilesDisplay = document.getElementById('selectedFilesDisplay');
        
        if (!fileInfoDisplay || !selectedFilesDisplay) return;
        
        if (files.length === 1) {
            fileInfoDisplay.innerHTML = `
                <div style="font-size: 16px; color: #1f2937; font-weight: 600; margin-bottom: 4px;">
                    ${files[0].name}
                </div>
                <div style="font-size: 14px; color: #6b7280;">
                    ${this.formatFileSize(files[0].size)}
                </div>
            `;
        } else {
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);
            fileInfoDisplay.innerHTML = `
                <div style="font-size: 16px; color: #1f2937; font-weight: 600; margin-bottom: 4px;">
                    ${files.length} images selected
                </div>
                <div style="font-size: 14px; color: #6b7280;">
                    Total size: ${this.formatFileSize(totalSize)}
                </div>
            `;
        }
        
        selectedFilesDisplay.style.display = 'block';
    }
    
    // Next button functionality removed - Auto-redirect enabled
    
    showDownloadSection() {
        this.goToStep3();
    }
    
    reset() {
        console.log('🔄 Resetting tool...');
        
        this.selectedFiles = [];
        this.pdfBlob = null;
        this.pdfFileName = null;
        this.isConverting = false;
        this.currentStep = 1;
        
        // Clear file input
        const fileInput = document.getElementById('jpg-file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Reset upload box
        this.resetUploadBox();
        
        // Hide file info display
        const selectedFilesDisplay = document.getElementById('selectedFilesDisplay');
        if (selectedFilesDisplay) {
            selectedFilesDisplay.style.display = 'none';
        }
        
        // Go back to step 1
        this.goToStep1();
        
        console.log('✅ Tool reset complete');
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded - Initializing JPG to PDF Tool');
    
    // Initialize the JPG to PDF tool
    window.jpgToPdfTool = new JPGToPDFTool();
    
    console.log('✅ JPG to PDF Tool initialization complete');
});

function initializeJPGToPDFTool() {
    // State management
    let selectedFiles = [];
    let currentStep = 1;
    let convertedPdfBlob = null;
    let conversionOptions = {
        orientation: 'portrait',
        pageSize: 'a4',
        margin: 'big',
        mergeAll: true
    };

    // DOM Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadArea = document.getElementById('uploadArea');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const filesGrid = document.getElementById('filesGrid');
    const nextToOptionsBtn = document.getElementById('nextToOptionsBtn');
    const backToUploadBtn = document.getElementById('backToUploadBtn');
    const nextToSuccessBtn = document.getElementById('nextToSuccessBtn');
    const backToOptionsBtn = document.getElementById('backToOptionsBtn');
    const startOverBtn = document.getElementById('startOverBtn');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const addMoreBtn = document.getElementById('addMoreBtn');

    // Initialize
    setupEventListeners();
    setupDragAndDrop();
}

function setupEventListeners() {
    // File selection
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    addMoreBtn.addEventListener('click', () => fileInput.click());

    // Side buttons (UI only for now)
    const driveBtn = document.querySelector('.drive-btn');
    const dropboxBtn = document.querySelector('.dropbox-btn');
    
    if (driveBtn) {
        driveBtn.addEventListener('click', () => {
            alert('Google Drive integration coming soon!');
        });
    }
    
    if (dropboxBtn) {
        dropboxBtn.addEventListener('click', () => {
            alert('Dropbox integration coming soon!');
        });
    }

    // Navigation
    nextToOptionsBtn.addEventListener('click', () => goToStep(2));
    backToUploadBtn.addEventListener('click', () => goToStep(1));
    nextToSuccessBtn.addEventListener('click', () => goToStep(3));
    backToOptionsBtn.addEventListener('click', () => goToStep(2));
    startOverBtn.addEventListener('click', resetAll);

    // Conversion
    convertBtn.addEventListener('click', convertToPDF);
    downloadBtn.addEventListener('click', downloadPDF);

    // Options
    document.querySelectorAll('input[name="orientation"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            conversionOptions.orientation = e.target.value;
            updatePreview();
        });
    });

    document.getElementById('pageSize').addEventListener('change', (e) => {
        conversionOptions.pageSize = e.target.value;
        updatePreview();
    });

    document.querySelectorAll('input[name="margin"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            conversionOptions.margin = e.target.value;
            updatePreview();
        });
    });

    document.getElementById('mergeAllImages').addEventListener('change', (e) => {
        conversionOptions.mergeAll = e.target.checked;
        updatePreview();
    });
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.add('dragover');
}

function unhighlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 50 * 1024 * 1024 // 50MB limit
    );
    
    if (imageFiles.length === 0) {
        alert('Please select image files only (max 50MB each)');
        return;
    }

    selectedFiles = [...selectedFiles, ...imageFiles];
    updateFilesDisplay();
    
    // Enable next button
    nextToOptionsBtn.disabled = false;
}

function updateFilesDisplay() {
    if (selectedFiles.length === 0) {
        uploadedFiles.style.display = 'none';
        uploadArea.style.display = 'block';
        return;
    }

    uploadedFiles.style.display = 'block';
    uploadArea.style.display = 'none';

    filesGrid.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        
        const name = document.createElement('div');
        name.className = 'file-item-name';
        name.textContent = file.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-item-remove';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', () => removeFile(index));
        
        fileItem.appendChild(img);
        fileItem.appendChild(name);
        fileItem.appendChild(removeBtn);
        filesGrid.appendChild(fileItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFilesDisplay();
    
    if (selectedFiles.length === 0) {
        nextToOptionsBtn.disabled = true;
    }
}

function goToStep(step) {
    // Hide all steps with animation
    [step1, step2, step3].forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.style.display = 'block';
        currentStepEl.style.opacity = '0';
        setTimeout(() => {
            currentStepEl.style.opacity = '1';
        }, 50);
    }
    
    currentStep = step;
    
    // Step-specific actions
    if (step === 2) {
        updatePreview();
    } else if (step === 3) {
        updateSuccessInfo();
    }
}

function updatePreview() {
    const previewGrid = document.getElementById('previewGrid');
    if (!previewGrid) return;
    
    previewGrid.innerHTML = '';
    
    selectedFiles.forEach(file => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        
        previewItem.appendChild(img);
        previewGrid.appendChild(previewItem);
    });
}

async function convertToPDF() {
    if (selectedFiles.length === 0) {
        alert('Please select images to convert');
        return;
    }

    try {
        // Show loading state
        convertBtn.textContent = 'Converting...';
        convertBtn.disabled = true;

        // Create PDF
        const pdf = await PDFLib.PDFDocument.create();
        
        // Get page dimensions based on options
        const pageDimensions = getPageDimensions(conversionOptions.pageSize, conversionOptions.orientation);
        
        for (const file of selectedFiles) {
            // Convert image to data URL
            const imageDataUrl = await fileToDataURL(file);
            
            // Add image to PDF
            let image;
            try {
                image = await pdf.embedJpg(imageDataUrl);
            } catch (error) {
                // Try as PNG if JPG fails
                image = await pdf.embedPng(imageDataUrl);
            }
            
            // Create page with image
            const page = pdf.addPage(pageDimensions);
            
            // Calculate image dimensions to fit page
            const { width, height } = image.scale(1);
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();
            
            // Calculate scale to fit image with margin
            const margin = getMarginValue(conversionOptions.margin);
            const availableWidth = pageWidth - (margin * 2);
            const availableHeight = pageHeight - (margin * 2);
            
            const scale = Math.min(availableWidth / width, availableHeight / height);
            const scaledWidth = width * scale;
            const scaledHeight = height * scale;
            
            // Center image on page
            const x = (pageWidth - scaledWidth) / 2;
            const y = (pageHeight - scaledHeight) / 2;
            
            page.drawImage(image, {
                x,
                y,
                width: scaledWidth,
                height: scaledHeight
            });
        }
        
        // Save PDF
        const pdfBytes = await pdf.save();
        convertedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        // Enable next button
        nextToSuccessBtn.disabled = false;
        convertBtn.textContent = 'Convert to PDF →';
        convertBtn.disabled = false;
        
        // Auto-advance to success page
        setTimeout(() => goToStep(3), 1000);
        
    } catch (error) {
        console.error('Conversion failed:', error);
        alert('Failed to convert images to PDF: ' + error.message);
        convertBtn.textContent = 'Convert to PDF →';
        convertBtn.disabled = false;
    }
}

function getPageDimensions(pageSize, orientation) {
    const sizes = {
        a4: { width: 595, height: 842 },
        letter: { width: 612, height: 792 },
        legal: { width: 612, height: 1008 },
        a3: { width: 842, height: 1191 }
    };
    
    let dimensions = sizes[pageSize] || sizes.a4;
    
    if (orientation === 'landscape') {
        return { width: dimensions.height, height: dimensions.width };
    }
    
    return dimensions;
}

function getMarginValue(margin) {
    const margins = {
        none: 0,
        small: 36,
        big: 72
    };
    
    return margins[margin] || 72;
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function updateSuccessInfo() {
    if (!convertedPdfBlob) return;
    
    // Update file size
    const fileSize = (convertedPdfBlob.size / (1024 * 1024)).toFixed(2);
    const fileSizeElement = document.getElementById('fileSize');
    if (fileSizeElement) {
        fileSizeElement.textContent = `${fileSize} MB`;
    }
    
    // Update page count
    const pageCountElement = document.getElementById('pageCount');
    if (pageCountElement) {
        pageCountElement.textContent = selectedFiles.length;
    }
    
    // Update image count
    const imageCountElement = document.getElementById('imageCount');
    if (imageCountElement) {
        imageCountElement.textContent = selectedFiles.length;
    }
}

function downloadPDF() {
    if (!convertedPdfBlob) {
        alert('No PDF to download');
        return;
    }

    const filename = `images_to_pdf_${selectedFiles.length}_files.pdf`;
    
    // Use universal downloader
    try {
        if (window.universalDownloader) {
            window.universalDownloader.downloadFile(convertedPdfBlob, filename);
        } else {
            // Fallback to direct download
            directDownload(convertedPdfBlob, filename);
        }
        trackConversionCompletion(selectedFiles.length);
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback to FileSaver.js
        if (typeof saveAs !== 'undefined') {
            saveAs(convertedPdfBlob, filename);
            trackConversionCompletion(selectedFiles.length);
        } else {
            alert('Download failed. Please try again.');
        }
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

function trackConversionCompletion(imageCount) {
    // Analytics tracking (placeholder)
    console.log(`JPG to PDF conversion completed: ${imageCount} images`);
    
    // In production, you would send this to your analytics service
    // Example: gtag('event', 'jpg_to_pdf_completed', {
    //     image_count: imageCount
    // });
}

function resetAll() {
    // Reset state
    selectedFiles = [];
    currentStep = 1;
    convertedPdfBlob = null;
    conversionOptions = {
        orientation: 'portrait',
        pageSize: 'a4',
        margin: 'big',
        mergeAll: true
    };
    
    // Reset UI
    goToStep(1);
    updateFilesDisplay();
    nextToOptionsBtn.disabled = true;
    nextToSuccessBtn.disabled = true;
    
    // Reset form
    document.querySelector('input[name="orientation"][value="portrait"]').checked = true;
    document.getElementById('pageSize').value = 'a4';
    document.querySelector('input[name="margin"][value="big"]').checked = true;
    document.getElementById('mergeAllImages').checked = true;
    
    // Reset file input
    fileInput.value = '';
}
