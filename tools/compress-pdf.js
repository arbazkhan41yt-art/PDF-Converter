// Compress PDF Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCompressPDF();
});

function initializeCompressPDF() {
    const fileHandler = new FileHandler();
    let selectedFile = null;
    let originalSize = 0;
    let compressedSize = 0;
    let progressBar = null;

    // Initialize progress bar
    progressBar = new ProgressBar('progressSection', {
        height: '8px',
        fillColor: '#22c55e',
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

    // Setup compress button
    const compressBtn = document.getElementById('compressBtn');
    if (compressBtn) {
        compressBtn.addEventListener('click', compressPDF);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCompressedPDF);
    }

    // Setup compress another button
    const compressAnotherBtn = document.getElementById('compressAnotherBtn');
    if (compressAnotherBtn) {
        compressAnotherBtn.addEventListener('click', resetCompressTool);
    }

    async function handleFileSelect(files) {
        if (files.length === 0) return;
        
        selectedFile = files[0];
        originalSize = selectedFile.size;
        
        showFileInfo();
        showOptionsSection();
    }

    function showFileInfo() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const fileName = document.getElementById('fileName');
        const originalSizeEl = document.getElementById('originalSize');
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (fileInfoSection) fileInfoSection.style.display = 'block';
        
        if (fileName) fileName.textContent = selectedFile.name;
        if (originalSizeEl) originalSizeEl.textContent = fileHandler.formatFileSize(originalSize);
    }

    function showOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'block';
    }

    async function compressPDF() {
        if (!selectedFile) {
            alert('Please select a PDF file');
            return;
        }

        try {
            // Show progress
            const optionsSection = document.getElementById('optionsSection');
            const progressSection = document.getElementById('progressSection');
            
            if (optionsSection) optionsSection.style.display = 'none';
            if (progressSection) progressSection.style.display = 'block';
            
            // Get compression level
            const compressionLevel = document.querySelector('input[name="compressionLevel"]:checked').value;
            
            progressBar.setProgress(10, 'Loading PDF file...');
            
            // Read PDF file
            const arrayBuffer = await selectedFile.arrayBuffer();
            progressBar.setProgress(20, 'Analyzing PDF structure...');
            
            // Load PDF
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            progressBar.setProgress(40, 'Compressing PDF content...');
            
            // Create new PDF with compression
            const compressedPdf = await PDFLib.PDFDocument.create();
            
            // Copy pages with compression settings
            const pageCount = pdf.getPageCount();
            for (let i = 0; i < pageCount; i++) {
                const progress = 40 + (40 * (i + 1) / pageCount);
                progressBar.setProgress(progress, `Compressing page ${i + 1} of ${pageCount}...`);
                
                const [page] = await compressedPdf.copyPages(pdf, [i]);
                compressedPdf.addPage(page);
            }
            
            progressBar.setProgress(80, 'Applying compression settings...');
            
            // Apply compression based on level
            const compressionSettings = getCompressionSettings(compressionLevel);
            
            // Save with compression
            const compressedPdfBytes = await compressedPdf.save(compressionSettings);
            const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
            
            compressedSize = compressedBlob.size;
            
            // Store for download
            window.compressedPdfBlob = compressedBlob;
            
            progressBar.setProgress(100, 'Compression complete!');
            
            // Show results
            setTimeout(() => {
                showResultSection();
            }, 1000);
            
        } catch (error) {
            console.error('Compression failed:', error);
            progressBar.setError('Compression failed: ' + error.message);
            
            setTimeout(() => {
                resetCompressTool();
            }, 3000);
        }
    }

    function getCompressionSettings(level) {
        const settings = {
            low: {
                useObjectStreams: true,
                compress: true,
                updateFieldAppearances: false
            },
            medium: {
                useObjectStreams: true,
                compress: true,
                updateFieldAppearances: false,
                // Additional medium compression settings
                objectsPerTick: 50
            },
            high: {
                useObjectStreams: true,
                compress: true,
                updateFieldAppearances: false,
                objectsPerTick: 100,
                // Additional high compression settings
                forceDataObjectStreams: true
            }
        };
        
        return settings[level] || settings.medium;
    }

    function showResultSection() {
        const progressSection = document.getElementById('progressSection');
        const resultSection = document.getElementById('resultSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (resultSection) resultSection.style.display = 'block';
        
        // Update statistics
        updateCompressionStats();
    }

    function updateCompressionStats() {
        const statOriginalSize = document.getElementById('statOriginalSize');
        const statCompressedSize = document.getElementById('statCompressedSize');
        const statReduction = document.getElementById('statReduction');
        
        if (statOriginalSize) statOriginalSize.textContent = fileHandler.formatFileSize(originalSize);
        if (statCompressedSize) statCompressedSize.textContent = fileHandler.formatFileSize(compressedSize);
        
        if (statReduction) {
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            statReduction.textContent = `${reduction}%`;
        }
    }

    function downloadCompressedPDF() {
        if (!window.compressedPdfBlob) {
            alert('No compressed PDF to download');
            return;
        }

        const originalName = selectedFile.name.replace('.pdf', '');
        const filename = `${originalName}_compressed.pdf`;
        
        const success = downloadManager.downloadFile(window.compressedPdfBlob, filename);
        
        if (success) {
            trackCompressionCompletion(originalSize, compressedSize);
        }
    }

    function resetCompressTool() {
        // Reset all states
        selectedFile = null;
        originalSize = 0;
        compressedSize = 0;
        window.compressedPdfBlob = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const optionsSection = document.getElementById('optionsSection');
        const progressSection = document.getElementById('progressSection');
        const resultSection = document.getElementById('resultSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(34, 197, 94, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select PDF file</h3>
                <p>or drop PDF file here</p>
                <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
                    Browse Files
                </button>
                <input type="file" id="fileInput" accept=".pdf" style="display: none;">
                <p class="file-size-limit">Maximum file size: 50MB</p>
            `;
            
            // Re-setup file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileHandler.setupFileInput(fileInput, handleFileSelect, 'pdf');
            }
        }
        
        if (fileInfoSection) fileInfoSection.style.display = 'none';
        if (optionsSection) optionsSection.style.display = 'none';
        if (progressSection) progressSection.style.display = 'none';
        if (resultSection) resultSection.style.display = 'none';
        
        // Reset progress bar
        if (progressBar) {
            progressBar.reset();
        }
        
        // Reset file input
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Reset compression level to default
        const defaultRadio = document.querySelector('input[name="compressionLevel"][value="low"]');
        if (defaultRadio) {
            defaultRadio.checked = true;
        }
    }

    function trackCompressionCompletion(originalSize, compressedSize) {
        // Analytics tracking (placeholder)
        console.log(`PDF compression completed: original=${originalSize} bytes, compressed=${compressedSize} bytes`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'pdf_compress_completed', {
        //     original_size: originalSize,
        //     compressed_size: compressedSize,
        //     compression_ratio: (compressedSize / originalSize)
        // });
    }
}
