// PDF to PPT Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePDFToPPT();
});

function initializePDFToPPT() {
    const fileHandler = new FileHandler();
    let selectedFile = null;
    let pdfDocument = null;
    let selectedPages = [];
    let convertedPresentation = null;
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
        
        uploadArea.addEventListener('click', function(e) {
            if (e.target.tagName !== 'BUTTON') {
                fileInput.click();
            }
        });
    }

    // Setup page selection tabs
    setupPageSelection();

    // Setup convert button
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertToPPT);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPPT);
    }

    // Setup convert another button
    const convertAnotherBtn = document.getElementById('convertAnotherBtn');
    if (convertAnotherBtn) {
        convertAnotherBtn.addEventListener('click', resetConverter);
    }

    function setupPageSelection() {
        const tabButtons = document.querySelectorAll('.selection-tabs .tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const selection = this.dataset.selection;
                switchSelection(selection);
            });
        });
    }

    function switchSelection(selection) {
        // Update tab buttons
        document.querySelectorAll('.selection-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-selection="${selection}"]`).classList.add('active');

        // Hide all selection contents
        document.querySelectorAll('.selection-content').forEach(content => {
            content.style.display = 'none';
        });

        // Show selected content
        document.getElementById(`${selection}Selection`).style.display = 'block';
    }

    async function handleFileSelect(files) {
        if (files.length === 0) return;
        
        selectedFile = files[0];
        
        try {
            // Load PDF document
            const arrayBuffer = await selectedFile.arrayBuffer();
            pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            showFileInfo();
            showPageSelection();
            showOptionsSection();
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Failed to load PDF file');
        }
    }

    function showFileInfo() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const pageCount = document.getElementById('pageCount');
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (fileInfoSection) fileInfoSection.style.display = 'block';
        
        if (fileName) fileName.textContent = selectedFile.name;
        if (fileSize) fileSize.textContent = fileHandler.formatFileSize(selectedFile.size);
        if (pageCount) pageCount.textContent = pdfDocument.numPages;
    }

    function showPageSelection() {
        const pageSelectionSection = document.getElementById('pageSelectionSection');
        if (pageSelectionSection) pageSelectionSection.style.display = 'block';
        
        // Set range input limits
        const rangeStart = document.getElementById('rangeStart');
        const rangeEnd = document.getElementById('rangeEnd');
        
        if (rangeStart) {
            rangeStart.min = 1;
            rangeStart.max = pdfDocument.numPages;
            rangeStart.value = 1;
        }
        
        if (rangeEnd) {
            rangeEnd.min = 1;
            rangeEnd.max = pdfDocument.numPages;
            rangeEnd.value = pdfDocument.numPages;
        }
        
        // Generate page preview
        generatePagePreview();
    }

    async function generatePagePreview() {
        const pagePreview = document.getElementById('pagePreview');
        if (!pagePreview) return;
        
        pagePreview.innerHTML = '<p>Generating preview...</p>';
        
        try {
            // Create preview thumbnails for first few pages
            const previewCount = Math.min(6, pdfDocument.numPages);
            const previewHTML = [];
            
            for (let i = 1; i <= previewCount; i++) {
                const page = await pdfDocument.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                
                // Create canvas for thumbnail
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                previewHTML.push(`
                    <div class="page-thumbnail" data-page="${i}">
                        <img src="${canvas.toDataURL()}" alt="Page ${i}">
                        <span>Page ${i}</span>
                    </div>
                `);
            }
            
            if (pdfDocument.numPages > previewCount) {
                previewHTML.push(`<div class="more-pages">+${pdfDocument.numPages - previewCount} more pages</div>`);
            }
            
            pagePreview.innerHTML = previewHTML.join('');
            
        } catch (error) {
            console.error('Error generating preview:', error);
            pagePreview.innerHTML = '<p>Preview not available</p>';
        }
    }

    function showOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'block';
    }

    function getSelectedPages() {
        const activeSelection = document.querySelector('.selection-tabs .tab-btn.active').dataset.selection;
        const pages = [];
        
        if (activeSelection === 'all') {
            // All pages
            for (let i = 1; i <= pdfDocument.numPages; i++) {
                pages.push(i);
            }
        } else if (activeSelection === 'range') {
            // Page range
            const start = parseInt(document.getElementById('rangeStart').value);
            const end = parseInt(document.getElementById('rangeEnd').value);
            
            for (let i = start; i <= end && i <= pdfDocument.numPages; i++) {
                pages.push(i);
            }
        } else if (activeSelection === 'custom') {
            // Custom pages
            const customPages = document.getElementById('customPages').value;
            const pageNumbers = customPages.split(',');
            
            pageNumbers.forEach(pageNum => {
                if (pageNum.includes('-')) {
                    // Range
                    const [start, end] = pageNum.split('-').map(n => parseInt(n.trim()));
                    for (let i = start; i <= end && i <= pdfDocument.numPages; i++) {
                        pages.push(i);
                    }
                } else {
                    // Single page
                    const page = parseInt(pageNum.trim());
                    if (page > 0 && page <= pdfDocument.numPages) {
                        pages.push(page);
                    }
                }
            });
        }
        
        // Remove duplicates and sort
        return [...new Set(pages)].sort((a, b) => a - b);
    }

    async function convertToPPT() {
        if (!pdfDocument) {
            alert('Please select a PDF file');
            return;
        }

        try {
            // Show progress
            const optionsSection = document.getElementById('optionsSection');
            const progressSection = document.getElementById('progressSection');
            
            if (optionsSection) optionsSection.style.display = 'none';
            if (progressSection) progressSection.style.display = 'block';
            
            // Get selected pages
            selectedPages = getSelectedPages();
            
            if (selectedPages.length === 0) {
                alert('No pages selected for conversion');
                return;
            }
            
            // Get conversion options
            const slideLayout = document.getElementById('slideLayout').value;
            const slideSize = document.getElementById('slideSize').value;
            const textExtraction = document.getElementById('textExtraction').value;
            const imageQuality = document.getElementById('imageQuality').value;
            const extractImages = document.getElementById('extractImages').checked;
            const preserveLayout = document.getElementById('preserveLayout').checked;
            const addSlideNumbers = document.getElementById('addSlideNumbers').checked;
            const createTableOfContents = document.getElementById('createTableOfContents').checked;
            
            progressBar.setProgress(10, 'Creating PowerPoint presentation...');
            
            // Create PowerPoint presentation
            let pptx = new PptxGenJS();
            
            // Set slide size
            switch(slideSize) {
                case 'standard':
                    pptx.defineLayout({ name: 'A4', width: 10, height: 7.5 });
                    break;
                case 'widescreen':
                    pptx.defineLayout({ name: 'WIDESCREEN', width: 13.33, height: 7.5 });
                    break;
                case 'widescreen16x10':
                    pptx.defineLayout({ name: 'WIDESCREEN16X10', width: 13.33, height: 8.33 });
                    break;
            }
            
            let totalTextElements = 0;
            let totalImages = 0;
            
            // Add table of contents if requested
            if (createTableOfContents) {
                progressBar.setProgress(15, 'Creating table of contents...');
                
                const tocSlide = pptx.addSlide();
                tocSlide.addText('Table of Contents', {
                    x: 1,
                    y: 1,
                    fontSize: 24,
                    bold: true,
                    color: '363636'
                });
                
                selectedPages.forEach((pageNum, index) => {
                    tocSlide.addText(`Page ${pageNum}`, {
                        x: 1.5,
                        y: 2 + (index * 0.5),
                        fontSize: 14,
                        color: '666666'
                    });
                });
            }
            
            // Process each selected page
            for (let i = 0; i < selectedPages.length; i++) {
                const pageNum = selectedPages[i];
                const progress = 20 + (60 * (i + 1) / selectedPages.length);
                
                progressBar.setProgress(progress, `Processing page ${pageNum} of ${pdfDocument.numPages}...`);
                
                try {
                    const pageData = await processPage(pageNum, slideLayout, textExtraction, extractImages, imageQuality);
                    
                    // Create slide
                    const slide = pptx.addSlide();
                    
                    // Add background image if extracting images
                    if (extractImages && pageData.backgroundImage) {
                        slide.addImage({
                            data: `data:image/png;base64,${pageData.backgroundImage}`,
                            x: 0,
                            y: 0,
                            w: '100%',
                            h: '100%'
                        });
                    }
                    
                    // Add text content
                    if (pageData.textContent && pageData.textContent.length > 0) {
                        pageData.textContent.forEach((text, index) => {
                            slide.addText(text.content, {
                                x: text.x || 1,
                                y: text.y || (1 + (index * 0.8)),
                                fontSize: text.fontSize || 14,
                                bold: text.bold || false,
                                color: text.color || '363636',
                                w: text.width || 8
                            });
                            totalTextElements++;
                        });
                    }
                    
                    // Add slide number if requested
                    if (addSlideNumbers) {
                        slide.addText(`Page ${pageNum}`, {
                            x: 11,
                            y: 6.5,
                            fontSize: 10,
                            color: '999999'
                        });
                    }
                    
                    if (pageData.hasImage) {
                        totalImages++;
                    }
                    
                } catch (error) {
                    console.error(`Error processing page ${pageNum}:`, error);
                    // Continue with other pages
                }
            }
            
            progressBar.setProgress(85, 'Generating PowerPoint file...');
            
            // Generate the PowerPoint file
            const pptxBuffer = await pptx.writeFile({ outputType: 'blob' });
            
            // Store for download
            convertedPresentation = {
                blob: pptxBuffer,
                slidesCreated: selectedPages.length,
                textElements: totalTextElements,
                imagesExtracted: totalImages
            };
            
            progressBar.setSuccess('PDF converted to PowerPoint successfully!');
            
            // Show preview section
            setTimeout(() => {
                showPreviewSection();
            }, 1000);
            
        } catch (error) {
            console.error('Conversion failed:', error);
            progressBar.setError('Conversion failed: ' + error.message);
            
            setTimeout(() => {
                resetConverter();
            }, 3000);
        }
    }

    async function processPage(pageNum, slideLayout, textExtraction, extractImages, imageQuality) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 2 });
        
        const pageData = {
            textContent: [],
            backgroundImage: null,
            hasImage: false
        };
        
        // Extract text content
        if (textContent.items.length > 0) {
            const textItems = textContent.items;
            let currentLine = '';
            let lastY = null;
            let textElements = [];
            
            textItems.forEach(item => {
                const y = Math.round(item.transform[5]);
                const x = Math.round(item.transform[4]);
                
                if (lastY !== null && Math.abs(y - lastY) > 10) {
                    if (currentLine.trim()) {
                        textElements.push({
                            content: currentLine.trim(),
                            x: x / viewport.width * 10,
                            y: (viewport.height - y) / viewport.height * 7.5,
                            fontSize: Math.round(item.transform[0] * 0.75),
                            bold: item.fontName && item.fontName.includes('Bold'),
                            color: '363636'
                        });
                    }
                    currentLine = '';
                }
                
                currentLine += item.str;
                lastY = y;
            });
            
            // Add last line
            if (currentLine.trim()) {
                textElements.push({
                    content: currentLine.trim(),
                    x: 1,
                    y: 1,
                    fontSize: 14,
                    bold: false,
                    color: '363636'
                });
            }
            
            pageData.textContent = textElements;
        }
        
        // Extract image if requested
        if (extractImages) {
            try {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                const imageData = canvas.toDataURL('image/png', 0.8);
                const base64Data = imageData.split(',')[1];
                pageData.backgroundImage = base64Data;
                pageData.hasImage = true;
                
            } catch (error) {
                console.error('Error extracting image:', error);
            }
        }
        
        return pageData;
    }

    function showPreviewSection() {
        const progressSection = document.getElementById('progressSection');
        const previewSection = document.getElementById('previewSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (previewSection) previewSection.style.display = 'block';
        
        // Update stats
        const slidesCreated = document.getElementById('slidesCreated');
        const textElements = document.getElementById('textElements');
        const imagesExtracted = document.getElementById('imagesExtracted');
        
        if (slidesCreated) slidesCreated.textContent = convertedPresentation.slidesCreated;
        if (textElements) textElements.textContent = convertedPresentation.textElements;
        if (imagesExtracted) imagesExtracted.textContent = convertedPresentation.imagesExtracted;
        
        // Generate slide preview
        generateSlidePreview();
    }

    function generateSlidePreview() {
        const slidePreviewGrid = document.getElementById('slidePreviewGrid');
        if (!slidePreviewGrid || !convertedPresentation) return;
        
        slidePreviewGrid.innerHTML = '';
        
        // Create preview slides
        for (let i = 0; i < Math.min(6, convertedPresentation.slidesCreated); i++) {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide-preview-item';
            
            slideDiv.innerHTML = `
                <div class="slide-preview-content">
                    <div class="slide-preview-number">Slide ${i + 1}</div>
                    <div class="slide-preview-placeholder">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="#f97316">
                            <rect width="40" height="40" rx="4" fill="rgba(249, 115, 22, 0.1)"/>
                            <path d="M20 10v20m-10-10h20" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>Slide Content</span>
                    </div>
                </div>
            `;
            
            slidePreviewGrid.appendChild(slideDiv);
        }
        
        if (convertedPresentation.slidesCreated > 6) {
            const moreSlides = document.createElement('div');
            moreSlides.className = 'more-slides';
            moreSlides.textContent = `+${convertedPresentation.slidesCreated - 6} more slides`;
            slidePreviewGrid.appendChild(moreSlides);
        }
    }

    function downloadPPT() {
        if (!convertedPresentation || !convertedPresentation.blob) {
            alert('No PowerPoint file to download');
            return;
        }

        const originalName = selectedFile.name.replace('.pdf', '');
        const filename = `${originalName}_presentation.pptx`;
        
        const success = downloadManager.downloadFile(convertedPresentation.blob, filename);
        
        if (success) {
            trackConversionCompletion(selectedFile.name, convertedPresentation.slidesCreated);
        }
    }

    function resetConverter() {
        // Reset all states
        selectedFile = null;
        pdfDocument = null;
        selectedPages = [];
        convertedPresentation = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const pageSelectionSection = document.getElementById('pageSelectionSection');
        const optionsSection = document.getElementById('optionsSection');
        const progressSection = document.getElementById('progressSection');
        const previewSection = document.getElementById('previewSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(249, 115, 22, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select PDF File</h3>
                <p>or drop PDF file to convert to PowerPoint</p>
                <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
                    Browse Files
                </button>
                <input type="file" id="fileInput" accept=".pdf" style="display: none;">
                <p class="file-size-limit">Maximum file size: 20MB</p>
            `;
            
            // Re-setup file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileHandler.setupFileInput(fileInput, handleFileSelect, 'pdf');
            }
        }
        
        if (fileInfoSection) fileInfoSection.style.display = 'none';
        if (pageSelectionSection) pageSelectionSection.style.display = 'none';
        if (optionsSection) optionsSection.style.display = 'none';
        if (progressSection) progressSection.style.display = 'none';
        if (previewSection) previewSection.style.display = 'none';
        
        // Reset progress bar
        if (progressBar) {
            progressBar.reset();
        }
        
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Reset selection tabs
        switchSelection('all');
        
        // Reset form fields
        const rangeStart = document.getElementById('rangeStart');
        const rangeEnd = document.getElementById('rangeEnd');
        const customPages = document.getElementById('customPages');
        
        if (rangeStart) rangeStart.value = '1';
        if (rangeEnd) rangeEnd.value = '1';
        if (customPages) customPages.value = '';
    }

    function trackConversionCompletion(fileName, slidesCreated) {
        // Analytics tracking (placeholder)
        console.log(`PDF to PPT conversion completed: ${fileName}, slides: ${slidesCreated}`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'pdf_to_ppt_completed', {
        //     file_name: fileName,
        //     slides_created: slidesCreated
        // });
    }
}
