// PDF to Word Converter
document.addEventListener('DOMContentLoaded', function() {
    initializePDFToWordConverter();
});

function initializePDFToWordConverter() {
    const fileHandler = new FileHandler();
    let currentFile = null;
    let progressBar = null;

    // Initialize progress bar
    progressBar = new ProgressBar('progressSection', {
        height: '8px',
        fillColor: '#8b5cf6',
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

    // Setup convert button
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertPDFToWord);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadWordFile);
    }

    // Setup convert another button
    const convertAnotherBtn = document.getElementById('convertAnotherBtn');
    if (convertAnotherBtn) {
        convertAnotherBtn.addEventListener('click', resetConverter);
    }

    async function handleFileSelect(files) {
        if (files.length === 0) return;
        
        currentFile = files[0];
        
        // Show file info
        showFileInfo(currentFile);
        
        // Show options section
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) {
            optionsSection.style.display = 'block';
        }
        
        // Hide upload area
        if (uploadArea) {
            uploadArea.style.display = 'none';
        }
    }

    function showFileInfo(file) {
        const uploadContent = uploadArea.querySelector('.upload-content');
        const fileMetadata = fileHandler.getFileMetadata(file);
        
        uploadContent.innerHTML = `
            <div class="file-item">
                <div class="file-info">
                    <div class="file-icon">${fileHandler.getFileIcon(file.type)}</div>
                    <div class="file-details">
                        <h4>${fileMetadata.name}</h4>
                        <p>${fileMetadata.sizeFormatted}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="remove-file-btn" onclick="resetConverter()">✕</button>
                </div>
            </div>
        `;
    }

    async function convertPDFToWord() {
        if (!currentFile) {
            alert('Please select a PDF file first');
            return;
        }

        try {
            // Show progress section
            const progressSection = document.getElementById('progressSection');
            const optionsSection = document.getElementById('optionsSection');
            
            if (progressSection) progressSection.style.display = 'block';
            if (optionsSection) optionsSection.style.display = 'none';
            
            // Start progress
            progressBar.setIndeterminate('Reading PDF file...');
            
            // Read PDF file
            const arrayBuffer = await fileHandler.readFileAsArrayBuffer(currentFile);
            progressBar.setProgress(20, 'Processing PDF content...');
            
            // Get conversion options
            const conversionType = document.querySelector('input[name="conversionType"]:checked').value;
            
            // Convert PDF to Word
            let wordBlob;
            
            if (conversionType === 'preserve') {
                wordBlob = await convertWithPreservedFormatting(arrayBuffer);
            } else {
                wordBlob = await convertStandard(arrayBuffer);
            }
            
            progressBar.setProgress(80, 'Creating Word document...');
            
            // Store the result for download
            window.currentWordBlob = wordBlob;
            
            // Show success
            progressBar.setSuccess('Conversion complete!');
            
            // Show download section
            setTimeout(() => {
                showDownloadSection();
            }, 1000);
            
        } catch (error) {
            console.error('Conversion failed:', error);
            progressBar.setError('Conversion failed: ' + error.message);
            
            // Show error message
            setTimeout(() => {
                resetConverter();
            }, 3000);
        }
    }

    async function convertStandard(arrayBuffer) {
        // This is a simplified conversion
        // In a real implementation, you would use a proper PDF parsing library
        
        progressBar.setProgress(40, 'Extracting text content...');
        
        // For demo purposes, we'll create a simple Word document
        // In production, you would use libraries like:
        // - PDF.js for text extraction
        // - docx.js for Word document creation
        
        const extractedText = await extractTextFromPDF(arrayBuffer);
        
        progressBar.setProgress(60, 'Creating Word document...');
        
        // Create a simple RTF document (which Word can open)
        const rtfContent = createRTFDocument(extractedText);
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        
        return blob;
    }

    async function convertWithPreservedFormatting(arrayBuffer) {
        progressBar.setProgress(40, 'Analyzing PDF structure...');
        
        // This would preserve more formatting in a real implementation
        const extractedContent = await extractFormattedContentFromPDF(arrayBuffer);
        
        progressBar.setProgress(60, 'Preserving formatting...');
        
        // Create enhanced document with formatting
        const enhancedContent = createEnhancedDocument(extractedContent);
        const blob = new Blob([enhancedContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        
        return blob;
    }

    async function extractTextFromPDF(arrayBuffer) {
        // This is a placeholder implementation
        // In production, you would use PDF.js or similar
        
        // Simulate text extraction
        return new Promise((resolve) => {
            setTimeout(() => {
                const sampleText = `
This is a sample document converted from PDF to Word.

In a real implementation, this would contain the actual text content extracted from your PDF file.

The conversion process would:
1. Parse the PDF structure
2. Extract text from each page
3. Preserve paragraphs and line breaks
4. Maintain basic formatting
5. Create a Word-compatible document

Page 1 content would appear here...
Page 2 content would appear here...
And so on for all pages in the PDF.

Thank you for using FileFlex Converter!
                `.trim();
                
                resolve(sampleText);
            }, 1000);
        });
    }

    async function extractFormattedContentFromPDF(arrayBuffer) {
        // Enhanced extraction with formatting preservation
        return new Promise((resolve) => {
            setTimeout(() => {
                const formattedContent = {
                    title: 'Converted PDF Document',
                    pages: [
                        {
                            pageNumber: 1,
                            content: 'This is page 1 with preserved formatting',
                            headings: ['Heading 1', 'Heading 2'],
                            paragraphs: ['Paragraph 1', 'Paragraph 2']
                        },
                        {
                            pageNumber: 2,
                            content: 'This is page 2 with preserved formatting',
                            headings: ['Heading 3'],
                            paragraphs: ['Paragraph 3', 'Paragraph 4']
                        }
                    ]
                };
                
                resolve(formattedContent);
            }, 1500);
        });
    }

    function createRTFDocument(text) {
        // Create a simple RTF document that Word can open
        const rtfHeader = '{\\rtf1\\ansi\\deff0';
        const fontTable = '{\\fonttbl{\\f0 Times New Roman;}}';
        const colorTable = '{\\colortbl;\\red0\\green0\\blue0;}';
        const documentInfo = '{\\info{\\title PDF to Word Conversion}}';
        
        // Convert text to RTF format
        const rtfText = text
            .replace(/\n/g, '\\par ')
            .replace(/\\/g, '\\\\')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}');
        
        const rtfContent = `${rtfHeader}${fontTable}${colorTable}${documentInfo}\\f0\\fs24 ${rtfText}}`;
        
        return rtfContent;
    }

    function createEnhancedDocument(content) {
        // This would create a proper .docx file in production
        // For now, we'll create an enhanced RTF
        let rtfContent = '{\\rtf1\\ansi\\deff0';
        rtfContent += '{\\fonttbl{\\f0 Times New Roman;\\f1 Arial;}}';
        rtfContent += '{\\colortbl;\\red0\\green0\\blue0;\\red0\\green0\\blue255;}';
        rtfContent += '{\\info{\\title ' + content.title + '}}';
        
        content.pages.forEach(page => {
            rtfContent += '\\pard\\f1\\fs28\\b Page ' + page.pageNumber + '\\b0\\par\\par';
            rtfContent += '\\f0\\fs24 ';
            
            page.headings.forEach(heading => {
                rtfContent += '\\pard\\b ' + heading + '\\b0\\par\\par';
            });
            
            page.paragraphs.forEach(paragraph => {
                rtfContent += '\\pard ' + paragraph + '\\par\\par';
            });
        });
        
        rtfContent += '}';
        
        return rtfContent;
    }

    function showDownloadSection() {
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'block';
    }

    function downloadWordFile() {
        if (!window.currentWordBlob) {
            alert('No file to download');
            return;
        }

        const originalFilename = currentFile.name;
        const baseName = originalFilename.replace('.pdf', '');
        const wordFilename = `${baseName}_converted.docx`;
        
        const success = downloadManager.downloadFile(window.currentWordBlob, wordFilename);
        
        if (success) {
            // Track conversion completion (analytics)
            trackConversionCompletion('pdf-to-word', currentFile.size);
        }
    }

    function resetConverter() {
        // Reset all states
        currentFile = null;
        window.currentWordBlob = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const progressSection = document.getElementById('progressSection');
        const optionsSection = document.getElementById('optionsSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(139, 92, 246, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select PDF file</h3>
                <p>or drop PDF here</p>
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
        
        if (progressSection) progressSection.style.display = 'none';
        if (optionsSection) optionsSection.style.display = 'none';
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

    function trackConversionCompletion(tool, fileSize) {
        // Analytics tracking (placeholder)
        console.log(`Conversion completed: ${tool}, file size: ${fileSize}`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'conversion_completed', {
        //     tool: tool,
        //     file_size: fileSize
        // });
    }
}

// Make resetConverter available globally
window.resetConverter = resetConverter;
