// Merge PDF Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeMergePDF();
});

function initializeMergePDF() {
    const fileHandler = new FileHandler();
    let selectedFiles = [];
    let progressBar = null;

    // Initialize progress bar
    progressBar = new ProgressBar('progressSection', {
        height: '8px',
        fillColor: '#f97316',
        showPercentage: true
    });

    // Setup file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileHandler.setupFileInput(fileInput, handleFileSelect, 'pdf');
    }

    // Setup drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        fileHandler.setupDragAndDrop(uploadArea, handleFileSelect, 'pdf');
        
        // Make entire area clickable
        uploadArea.addEventListener('click', function(e) {
            if (e.target.tagName !== 'BUTTON') {
                fileInput.click();
            }
        });
    }

    // Setup merge button
    const mergeBtn = document.getElementById('mergeBtn');
    if (mergeBtn) {
        mergeBtn.addEventListener('click', mergePDFs);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadMergedPDF);
    }

    // Setup merge another button
    const mergeAnotherBtn = document.getElementById('mergeAnotherBtn');
    if (mergeAnotherBtn) {
        mergeAnotherBtn.addEventListener('click', resetMergeTool);
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
                <div class="file-icon">📄</div>
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
                this.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
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
        }
    };

    window.clearAllFiles = function() {
        selectedFiles = [];
        updateFilesList();
        hideFilesSection();
    };

    function showFilesSection() {
        const uploadArea = document.getElementById('uploadArea');
        const filesSection = document.getElementById('filesSection');
        const mergeSection = document.getElementById('mergeSection');
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (filesSection) filesSection.style.display = 'block';
        if (mergeSection) mergeSection.style.display = 'block';
    }

    function hideFilesSection() {
        const uploadArea = document.getElementById('uploadArea');
        const filesSection = document.getElementById('filesSection');
        const mergeSection = document.getElementById('mergeSection');
        
        if (uploadArea) uploadArea.style.display = 'block';
        if (filesSection) filesSection.style.display = 'none';
        if (mergeSection) mergeSection.style.display = 'none';
    }

    async function mergePDFs() {
        if (selectedFiles.length === 0) {
            alert('Please select at least one PDF file');
            return;
        }

        try {
            // Show progress
            const progressSection = document.getElementById('progressSection');
            const filesSection = document.getElementById('filesSection');
            const mergeSection = document.getElementById('mergeSection');
            
            if (progressSection) progressSection.style.display = 'block';
            if (filesSection) filesSection.style.display = 'none';
            if (mergeSection) mergeSection.style.display = 'none';
            
            // Start progress
            progressBar.setProgress(10, 'Loading PDF files...');
            
            // Create new PDF document
            const mergedPdf = await PDFLib.PDFDocument.create();
            progressBar.setProgress(20, 'Processing files...');
            
            // Process each file
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const progress = 20 + (60 * (i + 1) / selectedFiles.length);
                
                progressBar.setProgress(progress, `Processing ${file.name}...`);
                
                try {
                    // Read file
                    const arrayBuffer = await file.arrayBuffer();
                    
                    // Load PDF
                    const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                    
                    // Copy all pages
                    const pages = pdf.getPageCount();
                    for (let j = 0; j < pages; j++) {
                        const [page] = await mergedPdf.copyPages(pdf, [j]);
                        mergedPdf.addPage(page);
                    }
                    
                } catch (error) {
                    console.error(`Error processing ${file.name}:`, error);
                    // Continue with other files
                }
            }
            
            progressBar.setProgress(85, 'Creating merged PDF...');
            
            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();
            const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            
            // Store for download
            window.mergedPdfBlob = mergedBlob;
            
            progressBar.setSuccess('PDFs merged successfully!');
            
            // Show download section
            setTimeout(() => {
                showDownloadSection();
            }, 1000);
            
        } catch (error) {
            console.error('Merge failed:', error);
            progressBar.setError('Merge failed: ' + error.message);
            
            // Show error and reset
            setTimeout(() => {
                resetMergeTool();
            }, 3000);
        }
    }

    function showDownloadSection() {
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'block';
    }

    function downloadMergedPDF() {
        if (!window.mergedPdfBlob) {
            alert('No merged PDF to download');
            return;
        }

        const filename = `merged_${selectedFiles.length}_files.pdf`;
        const success = downloadManager.downloadFile(window.mergedPdfBlob, filename);
        
        if (success) {
            // Track merge completion
            trackMergeCompletion(selectedFiles.length, selectedFiles.reduce((total, file) => total + file.size, 0));
        }
    }

    function resetMergeTool() {
        // Reset all states
        selectedFiles = [];
        window.mergedPdfBlob = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const progressSection = document.getElementById('progressSection');
        const filesSection = document.getElementById('filesSection');
        const mergeSection = document.getElementById('mergeSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(249, 115, 22, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select PDF files</h3>
                <p>or drop PDF files here</p>
                <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
                    Browse Files
                </button>
                <input type="file" id="fileInput" accept=".pdf" multiple style="display: none;">
                <p class="file-size-limit">Maximum file size: 50MB per file</p>
            `;
            
            // Re-setup file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileHandler.setupFileInput(fileInput, handleFileSelect, 'pdf');
            }
        }
        
        if (progressSection) progressSection.style.display = 'none';
        if (filesSection) filesSection.style.display = 'none';
        if (mergeSection) mergeSection.style.display = 'none';
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

    function trackMergeCompletion(fileCount, totalSize) {
        // Analytics tracking (placeholder)
        console.log(`PDF merge completed: ${fileCount} files, total size: ${totalSize} bytes`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'pdf_merge_completed', {
        //     file_count: fileCount,
        //     total_size: totalSize
        // });
    }
}

// Make functions available globally
window.clearAllFiles = clearAllFiles;
