// Word to PDF Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeWordToPDF();
});

function initializeWordToPDF() {
    const fileHandler = new FileHandler();
    let selectedFile = null;
    let progressBar = null;

    // Initialize progress bar
    progressBar = new ProgressBar('progressSection', {
        height: '8px',
        fillColor: '#3b82f6',
        showPercentage: true
    });

    // Setup file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileHandler.setupFileInput(fileInput, handleFileSelect, 'word');
    }

    // Setup drag and drop
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        fileHandler.setupDragAndDrop(uploadArea, handleFileSelect, 'word');
        
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
        
        selectedFile = files[0];
        
        showFileInfo();
        showOptionsSection();
    }

    function showFileInfo() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (fileInfoSection) fileInfoSection.style.display = 'block';
        
        if (fileName) fileName.textContent = selectedFile.name;
        if (fileSize) fileSize.textContent = fileHandler.formatFileSize(selectedFile.size);
    }

    function showOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'block';
    }

    async function convertToPDF() {
        if (!selectedFile) {
            alert('Please select a Word document');
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
            const margin = document.getElementById('margin').value;
            const orientation = document.getElementById('orientation').value;
            const includeComments = document.getElementById('includeComments').value;
            
            progressBar.setProgress(10, 'Reading Word document...');
            
            // Read the Word document
            const arrayBuffer = await selectedFile.arrayBuffer();
            
            let htmlContent = '';
            
            // Check file type and process accordingly
            if (selectedFile.name.endsWith('.docx')) {
                // Use mammoth.js for DOCX files
                progressBar.setProgress(30, 'Extracting content from DOCX...');
                
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                htmlContent = result.value;
                
                if (result.messages.length > 0) {
                    console.log('Conversion warnings:', result.messages);
                }
            } else if (selectedFile.name.endsWith('.doc')) {
                // For DOC files, we'll need to use a different approach
                // For now, we'll create a simple text-based conversion
                progressBar.setProgress(30, 'Processing DOC file...');
                
                // Convert to text first (simplified approach)
                const textContent = await arrayBufferToText(arrayBuffer);
                htmlContent = `<div style="font-family: Arial, sans-serif; white-space: pre-wrap;">${escapeHtml(textContent)}</div>`;
            }
            
            progressBar.setProgress(50, 'Creating PDF document...');
            
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
                default:
                    pageWidth = PDFLib.PageSize.A4.width;
                    pageHeight = PDFLib.PageSize.A4.height;
            }
            
            // Swap dimensions for landscape
            if (orientation === 'landscape') {
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
            }
            
            // Calculate margins
            let marginSize = 72; // Default 1 inch
            switch(margin) {
                case 'narrow': marginSize = 36; break; // 0.5 inch
                case 'wide': marginSize = 144; break; // 2 inches
            }
            
            progressBar.setProgress(70, 'Rendering content to PDF...');
            
            // Create a temporary container to render HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.width = (pageWidth - marginSize * 2) + 'px';
            tempDiv.style.fontFamily = 'Arial, sans-serif';
            tempDiv.style.fontSize = '12px';
            tempDiv.style.lineHeight = '1.4';
            document.body.appendChild(tempDiv);
            
            try {
                // Use html2canvas to convert HTML to image
                if (typeof html2canvas !== 'undefined') {
                    const canvas = await html2canvas(tempDiv, {
                        width: pageWidth - marginSize * 2,
                        height: pageHeight - marginSize * 2,
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    });
                    
                    const imageBytes = canvas.toDataURL('image/png');
                    const image = await pdf.embedPng(imageBytes);
                    
                    // Add page with image
                    const page = pdf.addPage([pageWidth, pageHeight]);
                    page.drawImage(image, {
                        x: marginSize,
                        y: marginSize,
                        width: pageWidth - marginSize * 2,
                        height: pageHeight - marginSize * 2
                    });
                } else {
                    // Fallback: Create a simple text-based PDF
                    const textContent = tempDiv.textContent || tempDiv.innerText || '';
                    const lines = textContent.split('\n');
                    
                    const page = pdf.addPage([pageWidth, pageHeight]);
                    const { height } = page.getSize();
                    let yPosition = height - marginSize;
                    
                    for (const line of lines) {
                        if (yPosition < marginSize + 20) {
                            // Add new page if we run out of space
                            const newPage = pdf.addPage([pageWidth, pageHeight]);
                            yPosition = newPage.getSize().height - marginSize;
                        }
                        
                        page.drawText(line.substring(0, 80), {
                            x: marginSize,
                            y: yPosition,
                            size: 12,
                            font: await pdf.embedFont(PDFLib.StandardFonts.Helvetica)
                        });
                        
                        yPosition -= 20;
                    }
                }
            } finally {
                // Clean up temporary div
                document.body.removeChild(tempDiv);
            }
            
            progressBar.setProgress(90, 'Saving PDF...');
            
            // Save the PDF
            const pdfBytes = await pdf.save();
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            // Store for download
            window.convertedPdfBlob = pdfBlob;
            
            progressBar.setSuccess('Word document converted to PDF successfully!');
            
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

    function arrayBufferToText(arrayBuffer) {
        // Simple text extraction from array buffer
        // This is a basic implementation - in production, you'd use a proper DOC parser
        const uint8Array = new Uint8Array(arrayBuffer);
        let text = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
            const char = uint8Array[i];
            // Filter out non-printable characters
            if (char >= 32 && char <= 126 || char === 10 || char === 13) {
                text += String.fromCharCode(char);
            }
        }
        
        return text;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

        const originalName = selectedFile.name.replace(/\.(doc|docx)$/i, '');
        const filename = `${originalName}.pdf`;
        
        const success = downloadManager.downloadFile(window.convertedPdfBlob, filename);
        
        if (success) {
            trackConversionCompletion(selectedFile.name, selectedFile.size);
        }
    }

    function resetConverter() {
        // Reset all states
        selectedFile = null;
        window.convertedPdfBlob = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const optionsSection = document.getElementById('optionsSection');
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(59, 130, 246, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select Word Document</h3>
                <p>or drop DOC or DOCX file here</p>
                <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
                    Browse Files
                </button>
                <input type="file" id="fileInput" accept=".doc,.docx" style="display: none;">
                <p class="file-size-limit">Maximum file size: 20MB</p>
            `;
            
            // Re-setup file input
            const fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileHandler.setupFileInput(fileInput, handleFileSelect, 'word');
            }
        }
        
        if (fileInfoSection) fileInfoSection.style.display = 'none';
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

    function trackConversionCompletion(fileName, fileSize) {
        // Analytics tracking (placeholder)
        console.log(`Word to PDF conversion completed: ${fileName}, size: ${fileSize} bytes`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'word_to_pdf_completed', {
        //     file_name: fileName,
        //     file_size: fileSize
        // });
    }
}
