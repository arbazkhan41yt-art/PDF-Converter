// HTML to PDF Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeHTMLToPDF();
});

function initializeHTMLToPDF() {
    const fileHandler = new FileHandler();
    let currentInputMethod = 'url';
    let htmlContent = '';
    let selectedFile = null;
    let progressBar = null;

    // Initialize progress bar
    progressBar = new ProgressBar('progressSection', {
        height: '8px',
        fillColor: '#3b82f6',
        showPercentage: true
    });

    // Setup tab switching
    setupTabSwitching();

    // Setup URL input
    setupURLInput();

    // Setup file upload
    setupFileUpload();

    // Setup HTML code input
    setupCodeInput();

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

    function setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                switchTab(tabName);
            });
        });
    }

    function switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Hide all sections
        document.querySelectorAll('.input-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('previewSection').style.display = 'none';
        document.getElementById('optionsSection').style.display = 'none';

        // Show selected section
        document.getElementById(`${tabName}Section`).style.display = 'block';
        
        currentInputMethod = tabName;
        resetConverter();
    }

    function setupURLInput() {
        const urlInput = document.getElementById('urlInput');
        const fetchBtn = document.getElementById('fetchBtn');
        
        if (fetchBtn) {
            fetchBtn.addEventListener('click', fetchURL);
        }
        
        if (urlInput) {
            urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    fetchURL();
                }
            });
        }
    }

    async function fetchURL() {
        const urlInput = document.getElementById('urlInput');
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a URL');
            return;
        }

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            alert('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        try {
            const fetchBtn = document.getElementById('fetchBtn');
            fetchBtn.textContent = 'Fetching...';
            fetchBtn.disabled = true;

            // Note: Due to CORS restrictions, we can't directly fetch external URLs
            // In a real implementation, you'd use a proxy server or CORS-enabled endpoint
            // For this demo, we'll show a message and allow user to proceed
            
            htmlContent = `
                <html>
                <head>
                    <title>${url}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 40px; 
                            line-height: 1.6;
                            text-align: center;
                        }
                        .notice {
                            background: #f3f4f6;
                            padding: 20px;
                            border-radius: 8px;
                            border-left: 4px solid #3b82f6;
                        }
                    </style>
                </head>
                <body>
                    <div class="notice">
                        <h2>URL: ${url}</h2>
                        <p>Due to browser security restrictions, direct URL fetching is not available in this demo.</p>
                        <p>Please use the "HTML Code" tab to paste the HTML content manually.</p>
                        <p>Or upload an HTML file using the "HTML File" tab.</p>
                    </div>
                </body>
                </html>
            `;
            
            showPreview();
            showOptionsSection();
            
        } catch (error) {
            console.error('Error fetching URL:', error);
            alert('Failed to fetch URL. Please check the URL and try again.');
        } finally {
            fetchBtn.textContent = 'Fetch Page';
            fetchBtn.disabled = false;
        }
    }

    function setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileHandler.setupFileInput(fileInput, handleFileSelect, 'html');
        }

        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            fileHandler.setupDragAndDrop(uploadArea, handleFileSelect, 'html');
            
            uploadArea.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON') {
                    fileInput.click();
                }
            });
        }
    }

    async function handleFileSelect(files) {
        if (files.length === 0) return;
        
        selectedFile = files[0];
        
        try {
            const fileContent = await fileHandler.readFileAsText(selectedFile);
            htmlContent = fileContent;
            
            showPreview();
            showOptionsSection();
            
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to read HTML file');
        }
    }

    function setupCodeInput() {
        const htmlCode = document.getElementById('htmlCode');
        const previewBtn = document.getElementById('previewBtn');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                htmlContent = htmlCode.value;
                if (htmlContent.trim()) {
                    showPreview();
                    showOptionsSection();
                } else {
                    alert('Please enter HTML code');
                }
            });
        }
    }

    function showPreview() {
        const previewSection = document.getElementById('previewSection');
        const previewFrame = document.getElementById('previewFrame');
        
        if (previewSection && previewFrame) {
            // Hide input sections
            document.querySelectorAll('.input-section').forEach(section => {
                section.style.display = 'none';
            });
            
            previewSection.style.display = 'block';
            previewFrame.innerHTML = htmlContent;
        }
    }

    function showOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'block';
    }

    async function convertToPDF() {
        if (!htmlContent) {
            alert('No HTML content to convert');
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
            const margins = document.getElementById('margins').value;
            const scale = parseFloat(document.getElementById('scale').value);
            const includeBackgrounds = document.getElementById('includeBackgrounds').checked;
            const includeLinks = document.getElementById('includeLinks').checked;
            const includeImages = document.getElementById('includeImages').checked;
            const waitForLoad = document.getElementById('waitForLoad').checked;
            
            progressBar.setProgress(10, 'Preparing HTML content...');
            
            // Create a temporary container for rendering
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '800px';
            tempContainer.style.backgroundColor = 'white';
            tempContainer.style.fontFamily = 'Arial, sans-serif';
            
            // Set page size
            let pageWidth, pageHeight;
            switch(pageSize) {
                case 'a4':
                    pageWidth = 794; // A4 width in pixels at 96 DPI
                    pageHeight = 1123;
                    break;
                case 'letter':
                    pageWidth = 816;
                    pageHeight = 1056;
                    break;
                case 'legal':
                    pageWidth = 816;
                    pageHeight = 1344;
                    break;
                default:
                    pageWidth = 794;
                    pageHeight = 1123;
            }
            
            // Swap for landscape
            if (orientation === 'landscape') {
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
            }
            
            // Apply scale
            pageWidth *= scale;
            pageHeight *= scale;
            
            // Calculate margins
            let marginSize = 96; // 1 inch in pixels
            switch(margins) {
                case 'narrow': marginSize = 48; break; // 0.5 inch
                case 'wide': marginSize = 192; break; // 2 inches
            }
            
            tempContainer.style.width = (pageWidth - marginSize * 2) + 'px';
            
            // Add HTML content
            tempContainer.innerHTML = htmlContent;
            document.body.appendChild(tempContainer);
            
            progressBar.setProgress(30, 'Rendering HTML content...');
            
            // Wait for images to load if requested
            if (waitForLoad && includeImages) {
                await waitForImages(tempContainer);
            }
            
            progressBar.setProgress(50, 'Creating PDF document...');
            
            // Use html2canvas to convert HTML to canvas
            const canvas = await html2canvas(tempContainer, {
                width: pageWidth - marginSize * 2,
                height: pageHeight - marginSize * 2,
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: includeBackgrounds ? null : '#ffffff',
                logging: false
            });
            
            progressBar.setProgress(70, 'Generating PDF...');
            
            // Create PDF
            const pdf = await PDFLib.PDFDocument.create();
            const page = pdf.addPage([pageWidth, pageHeight]);
            
            // Convert canvas to image and embed in PDF
            const imageBytes = canvas.toDataURL('image/png');
            const image = await pdf.embedPng(imageBytes);
            
            // Draw image on page
            page.drawImage(image, {
                x: marginSize,
                y: marginSize,
                width: pageWidth - marginSize * 2,
                height: pageHeight - marginSize * 2
            });
            
            progressBar.setProgress(90, 'Saving PDF...');
            
            // Save the PDF
            const pdfBytes = await pdf.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            // Store for download
            window.convertedPdfBlob = pdfBlob;
            
            // Clean up
            document.body.removeChild(tempContainer);
            
            progressBar.setSuccess('HTML converted to PDF successfully!');
            
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

    function waitForImages(container) {
        return new Promise((resolve) => {
            const images = container.querySelectorAll('img');
            if (images.length === 0) {
                resolve();
                return;
            }
            
            let loadedCount = 0;
            const totalImages = images.length;
            
            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve();
                    }
                } else {
                    img.addEventListener('load', () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    });
                    img.addEventListener('error', () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    });
                }
            });
            
            // Fallback timeout
            setTimeout(resolve, 5000);
        });
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

        let filename = 'converted.pdf';
        
        if (currentInputMethod === 'url') {
            const url = document.getElementById('urlInput').value;
            filename = `url_${new URL(url).hostname}.pdf`;
        } else if (currentInputMethod === 'file' && selectedFile) {
            filename = selectedFile.name.replace(/\.(html|htm)$/i, '.pdf');
        }
        
        const success = downloadManager.downloadFile(window.convertedPdfBlob, filename);
        
        if (success) {
            trackConversionCompletion(currentInputMethod);
        }
    }

    function resetConverter() {
        // Reset all states
        htmlContent = '';
        selectedFile = null;
        window.convertedPdfBlob = null;
        
        // Reset UI
        const previewSection = document.getElementById('previewSection');
        const optionsSection = document.getElementById('optionsSection');
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (previewSection) previewSection.style.display = 'none';
        if (optionsSection) optionsSection.style.display = 'none';
        if (progressSection) progressSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'none';
        
        // Reset input fields
        const urlInput = document.getElementById('urlInput');
        const htmlCode = document.getElementById('htmlCode');
        const fileInput = document.getElementById('fileInput');
        
        if (urlInput) urlInput.value = '';
        if (htmlCode) htmlCode.value = '';
        if (fileInput) fileInput.value = '';
        
        // Reset progress bar
        if (progressBar) {
            progressBar.reset();
        }
        
        // Show current input section
        document.getElementById(`${currentInputMethod}Section`).style.display = 'block';
    }

    function trackConversionCompletion(inputMethod) {
        // Analytics tracking (placeholder)
        console.log(`HTML to PDF conversion completed: ${inputMethod}`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'html_to_pdf_completed', {
        //     input_method: inputMethod
        // });
    }
}
