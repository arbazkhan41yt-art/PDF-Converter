// JPG to PDF Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeJPGToPDF();
});

function initializeJPGToPDF() {
    const fileHandler = new FileHandler();
    let selectedFiles = [];
    let progressBar = null;

    // Initialize progress bar
    progressBar = new ProgressBar('progressSection', {
        height: '8px',
        fillColor: '#eab308',
        showPercentage: true
    });

    // Setup file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileHandler.setupFileInput(fileInput, handleFileSelect, 'image');
    }

    // Setup drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        fileHandler.setupDragAndDrop(uploadArea, handleFileSelect, 'image');
        
        // Make entire area clickable
        uploadArea.addEventListener('click', function(e) {
            if (e.target.tagName !== 'BUTTON') {
                fileInput.click();
            }
        });
    }

    // Setup convert button
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertToPDF);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }

    // Setup convert another button
    const convertAnotherBtn = document.getElementById('convertAnotherBtn');
    if (convertAnotherBtn) {
        convertAnotherBtn.addEventListener('click', resetConverter);
    }

    async function handleFileSelect(files) {
        if (files.length === 0) return;
        
        // Add files to selected files array
        for (const file of files) {
            // Check if file already exists
            if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        }
        
        updateFilesList();
        showFilesSection();
        showOptionsSection();
    }

    function updateFilesList() {
        const filesList = document.getElementById('filesList');
        const fileCount = document.getElementById('fileCount');
        
        if (!filesList || !fileCount) return;
        
        fileCount.textContent = selectedFiles.length;
        
        filesList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = createFileItem(file, index);
            filesList.appendChild(fileItem);
        });
        
        // Make files draggable for reordering
        makeFilesDraggable();
    }

    function createFileItem(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.index = index;
        fileItem.draggable = true;
        
        const fileMetadata = fileHandler.getFileMetadata(file);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-preview">
                    <img src="${URL.createObjectURL(file)}" alt="${file.name}" class="preview-image">
                </div>
                <div class="file-details">
                    <h4>${fileMetadata.name}</h4>
                    <p>${fileMetadata.sizeFormatted}</p>
                </div>
            </div>
            <div class="file-actions">
                <button class="remove-file-btn" onclick="removeFile(${index})" title="Remove file">✕</button>
            </div>
        `;
        
        return fileItem;
    }

    function makeFilesDraggable() {
        const fileItems = document.querySelectorAll('.file-item');
        let draggedItem = null;

        fileItems.forEach(item => {
            item.addEventListener('dragstart', function(e) {
                draggedItem = this;
                this.style.opacity = '0.5';
            });

            item.addEventListener('dragend', function(e) {
                this.style.opacity = '';
            });

            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.backgroundColor = 'rgba(234, 179, 8, 0.1)';
            });

            item.addEventListener('dragleave', function(e) {
                this.style.backgroundColor = '';
            });

            item.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '';
                
                if (this !== draggedItem) {
                    const draggedIndex = parseInt(draggedItem.dataset.index);
                    const targetIndex = parseInt(this.dataset.index);
                    
                    // Reorder files array
                    const draggedFile = selectedFiles[draggedIndex];
                    selectedFiles.splice(draggedIndex, 1);
                    selectedFiles.splice(targetIndex, 0, draggedFile);
                    
                    // Update display
                    updateFilesList();
                }
            });
        });
    }

    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFilesList();
        
        if (selectedFiles.length === 0) {
            hideFilesSection();
            hideOptionsSection();
        }
    };

    window.clearAllFiles = function() {
        selectedFiles = [];
        updateFilesList();
        hideFilesSection();
        hideOptionsSection();
    };

    function showFilesSection() {
        const uploadArea = document.getElementById('uploadArea');
        const filesSection = document.getElementById('filesSection');
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (filesSection) filesSection.style.display = 'block';
    }

    function hideFilesSection() {
        const uploadArea = document.getElementById('uploadArea');
        const filesSection = document.getElementById('filesSection');
        
        if (uploadArea) uploadArea.style.display = 'block';
        if (filesSection) filesSection.style.display = 'none';
    }

    function showOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'block';
    }

    function hideOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'none';
    }

    async function convertToPDF() {
        if (selectedFiles.length === 0) {
            alert('Please select at least one image file');
            return;
        }

        try {
            // Show progress
            const optionsSection = document.getElementById('optionsSection');
            const progressSection = document.getElementById('progressSection');
            
            if (optionsSection) optionsSection.style.display = 'none';
            if (progressSection) progressSection.style.display = 'block';
            
            // Get conversion options
            const pageSize = document.getElementById('pageSize').value;
            const orientation = document.getElementById('orientation').value;
            const margin = document.getElementById('margin').value;
            const imageFit = document.getElementById('imageFit').value;
            
            progressBar.setProgress(10, 'Creating PDF document...');
            
            // Create new PDF document
            const pdf = await PDFLib.PDFDocument.create();
            
            // Set page size based on selection
            let pageWidth, pageHeight;
            switch(pageSize) {
                case 'a4':
                    pageWidth = PDFLib.PageSize.A4.width;
                    pageHeight = PDFLib.PageSize.A4.height;
                    break;
                case 'letter':
                    pageWidth = PDFLib.PageSize.Letter.width;
                    pageHeight = PDFLib.PageSize.Letter.height;
                    break;
                case 'legal':
                    pageWidth = PDFLib.PageSize.Legal.width;
                    pageHeight = PDFLib.PageSize.Legal.height;
                    break;
                case 'a3':
                    pageWidth = PDFLib.PageSize.A3.width;
                    pageHeight = PDFLib.PageSize.A3.height;
                    break;
                default:
                    pageWidth = PDFLib.PageSize.A4.width;
                    pageHeight = PDFLib.PageSize.A4.height;
            }
            
            // Swap dimensions for landscape
            if (orientation === 'landscape') {
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
            }
            
            // Calculate margins
            let marginSize = 0;
            switch(margin) {
                case 'small': marginSize = 36; break; // 0.5 inch
                case 'medium': marginSize = 72; break; // 1 inch
                case 'large': marginSize = 144; break; // 2 inches
            }
            
            // Process each image
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const progress = 10 + (70 * (i + 1) / selectedFiles.length);
                
                progressBar.setProgress(progress, `Processing ${file.name}...`);
                
                try {
                    // Read image
                    const arrayBuffer = await file.arrayBuffer();
                    
                    // Add image to PDF
                    let image;
                    if (file.type === 'image/jpeg') {
                        image = await pdf.embedJpg(arrayBuffer);
                    } else if (file.type === 'image/png') {
                        image = await pdf.embedPng(arrayBuffer);
                    } else {
                        // For other formats, try to embed as PNG
                        image = await pdf.embedPng(arrayBuffer);
                    }
                    
                    // Create new page
                    const page = pdf.addPage([pageWidth, pageHeight]);
                    
                    // Calculate image dimensions and position
                    const availableWidth = pageWidth - (marginSize * 2);
                    const availableHeight = pageHeight - (marginSize * 2);
                    
                    let imageWidth, imageHeight, x, y;
                    
                    if (imageFit === 'original') {
                        imageWidth = image.width;
                        imageHeight = image.height;
                        x = (pageWidth - imageWidth) / 2;
                        y = (pageHeight - imageHeight) / 2;
                    } else if (imageFit === 'fill') {
                        imageWidth = availableWidth;
                        imageHeight = availableHeight;
                        x = marginSize;
                        y = marginSize;
                    } else { // contain
                        const imageAspect = image.width / image.height;
                        const pageAspect = availableWidth / availableHeight;
                        
                        if (imageAspect > pageAspect) {
                            imageWidth = availableWidth;
                            imageHeight = availableWidth / imageAspect;
                        } else {
                            imageHeight = availableHeight;
                            imageWidth = availableHeight * imageAspect;
                        }
                        
                        x = (pageWidth - imageWidth) / 2;
                        y = (pageHeight - imageHeight) / 2;
                    }
                    
                    // Draw image on page
                    page.drawImage(image, {
                        x: x,
                        y: y,
                        width: imageWidth,
                        height: imageHeight
                    });
                    
                } catch (error) {
                    console.error(`Error processing ${file.name}:`, error);
                    // Continue with other images
                }
            }
            
            progressBar.setProgress(85, 'Saving PDF...');
            
            // Save the PDF
            const pdfBytes = await pdf.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            // Store for download
            window.convertedPdfBlob = pdfBlob;
            
            progressBar.setSuccess('Images converted to PDF successfully!');
            
            // Show download section
            setTimeout(() => {
                showDownloadSection();
            }, 1000);
            
        } catch (error) {
            console.error('Conversion failed:', error);
            progressBar.setError('Conversion failed: ' + error.message);
            
            setTimeout(() => {
                resetConverter();
            }, 3000);
        }
    }

    function showDownloadSection() {
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'block';
    }

    function downloadPDF() {
        if (!window.convertedPdfBlob) {
            alert('No PDF to download');
            return;
        }

        const filename = `images_to_pdf_${selectedFiles.length}_files.pdf`;
        
        // Use universal downloader for better experience
        try {
            window.universalDownloader.downloadFile(window.convertedPdfBlob, filename);
            trackConversionCompletion(selectedFiles.length, selectedFiles.reduce((total, file) => total + file.size, 0));
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to FileSaver.js
            if (typeof saveAs !== 'undefined') {
                saveAs(window.convertedPdfBlob, filename);
                trackConversionCompletion(selectedFiles.length, selectedFiles.reduce((total, file) => total + file.size, 0));
            } else {
                alert('Download failed. Please try again.');
            }
        }
    }

    function resetConverter() {
        // Reset all states
        selectedFiles = [];
        window.convertedPdfBlob = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const filesSection = document.getElementById('filesSection');
        const optionsSection = document.getElementById('optionsSection');
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(234, 179, 8, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select Image Files</h3>
                <p>or drop JPG, PNG, BMP, GIF files here</p>
                <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
                    Browse Files
                </button>
                <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                <p class="file-size-limit">Maximum file size: 10MB per image</p>
            `;
            
            // Re-setup file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileHandler.setupFileInput(fileInput, handleFileSelect, 'image');
            }
        }
        
        if (filesSection) filesSection.style.display = 'none';
        if (optionsSection) optionsSection.style.display = 'none';
        if (progressSection) progressSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'none';
        
        // Reset progress bar
        if (progressBar) {
            progressBar.reset();
        }
        
        // Reset file input
        if (fileInput) {
            fileInput.value = '';
        }
    }

    function trackConversionCompletion(imageCount, totalSize) {
        // Analytics tracking (placeholder)
        console.log(`JPG to PDF conversion completed: ${imageCount} images, total size: ${totalSize} bytes`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'jpg_to_pdf_completed', {
        //     image_count: imageCount,
        //     total_size: totalSize
        // });
    }
}

// Make functions available globally
window.clearAllFiles = clearAllFiles;
