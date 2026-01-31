// JPG to PDF - iLovePDF Redesign JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeJPGToPDF();
});

function initializeJPGToPDF() {
    // State management
    let selectedFiles = [];
    let currentStep = 1;
    let convertedPdfBlob = null;
    let conversionOptions = {
        orientation: 'portrait',
        pageSize: 'a4',
        margin: 'medium',
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

    document.getElementById('margin').addEventListener('change', (e) => {
        conversionOptions.margin = e.target.value;
        updatePreview();
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
    uploadArea.classList.add('dragover');
}

function unhighlight(e) {
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
        file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
        alert('Please select image files only');
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
    // Hide all steps
    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'none';
    
    // Show current step
    document.getElementById(`step${step}`).style.display = 'block';
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
            const image = await pdf.embedJpg(imageDataUrl);
            
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
        convertBtn.textContent = 'Convert to PDF';
        convertBtn.disabled = false;
        
        // Auto-advance to success page
        setTimeout(() => goToStep(3), 1000);
        
    } catch (error) {
        console.error('Conversion failed:', error);
        alert('Failed to convert images to PDF: ' + error.message);
        convertBtn.textContent = 'Convert to PDF';
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
        medium: 72,
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
    document.getElementById('fileSize').textContent = `${fileSize} MB`;
    
    // Update page count
    document.getElementById('pageCount').textContent = selectedFiles.length;
    
    // Update image count
    document.getElementById('imageCount').textContent = selectedFiles.length;
}

function downloadPDF() {
    if (!convertedPdfBlob) {
        alert('No PDF to download');
        return;
    }

    const filename = `images_to_pdf_${selectedFiles.length}_files.pdf`;
    
    // Use universal downloader
    try {
        window.universalDownloader.downloadFile(convertedPdfBlob, filename);
        trackConversionCompletion(selectedFiles.length);
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback
        if (typeof saveAs !== 'undefined') {
            saveAs(convertedPdfBlob, filename);
            trackConversionCompletion(selectedFiles.length);
        } else {
            alert('Download failed. Please try again.');
        }
    }
}

function trackConversionCompletion(imageCount) {
    // Analytics tracking (placeholder)
    console.log(`JPG to PDF conversion completed: ${imageCount} images`);
}

function resetAll() {
    // Reset state
    selectedFiles = [];
    currentStep = 1;
    convertedPdfBlob = null;
    conversionOptions = {
        orientation: 'portrait',
        pageSize: 'a4',
        margin: 'medium',
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
    document.getElementById('margin').value = 'medium';
    document.getElementById('mergeAllImages').checked = true;
    
    // Reset file input
    fileInput.value = '';
}
