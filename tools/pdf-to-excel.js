// PDF to Excel Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePDFToExcel();
});

function initializePDFToExcel() {
    const fileHandler = new FileHandler();
    let selectedFile = null;
    let extractedData = null;
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

    // Setup extract button
    const extractBtn = document.getElementById('extractBtn');
    if (extractBtn) {
        extractBtn.addEventListener('click', extractTables);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadExcel);
    }

    // Setup extract another button
    const extractAnotherBtn = document.getElementById('extractAnotherBtn');
    if (extractAnotherBtn) {
        extractAnotherBtn.addEventListener('click', resetExtractor);
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
        
        // Get page count
        getPageCount();
    }

    async function getPageCount() {
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const pageCount = document.getElementById('pageCount');
            if (pageCount) pageCount.textContent = pdf.numPages;
        } catch (error) {
            console.error('Error getting page count:', error);
        }
    }

    function showOptionsSection() {
        const optionsSection = document.getElementById('optionsSection');
        if (optionsSection) optionsSection.style.display = 'block';
    }

    async function extractTables() {
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
            
            // Get extraction options
            const extractionMode = document.getElementById('extractionMode').value;
            const tableDetection = document.getElementById('tableDetection').value;
            const outputFormat = document.getElementById('outputFormat').value;
            const includeFormatting = document.getElementById('includeFormatting').value;
            
            progressBar.setProgress(10, 'Loading PDF document...');
            
            // Load PDF
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            progressBar.setProgress(20, 'Analyzing document structure...');
            
            // Extract data from all pages
            const allTables = [];
            let totalRows = 0;
            let totalColumns = 0;
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const progress = 20 + (60 * pageNum / pdf.numPages);
                progressBar.setProgress(progress, `Processing page ${pageNum} of ${pdf.numPages}...`);
                
                try {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    
                    // Extract structured data based on mode
                    const pageData = await extractPageData(page, textContent, extractionMode, tableDetection);
                    
                    if (pageData.tables && pageData.tables.length > 0) {
                        allTables.push(...pageData.tables);
                        totalRows += pageData.totalRows;
                        totalColumns = Math.max(totalColumns, pageData.maxColumns);
                    }
                    
                } catch (error) {
                    console.error(`Error processing page ${pageNum}:`, error);
                }
            }
            
            progressBar.setProgress(85, 'Creating Excel file...');
            
            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            
            if (allTables.length > 0) {
                // Add each table as a separate sheet
                allTables.forEach((table, index) => {
                    const worksheet = XLSX.utils.aoa_to_sheet(table.data);
                    
                    // Apply formatting if requested
                    if (includeFormatting === 'yes') {
                        applyWorksheetFormatting(worksheet, table.data);
                    }
                    
                    const sheetName = `Table_${index + 1}`;
                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                });
            } else {
                // Create a sheet with extracted text if no tables found
                const textData = await extractAllText(pdf);
                const worksheet = XLSX.utils.aoa_to_sheet([['Extracted Text'], ...textData.map(line => [line])]);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted_Text');
            }
            
            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            // Store for download
            extractedData = {
                blob: excelBlob,
                tablesFound: allTables.length,
                rowsExtracted: totalRows,
                columnsFound: totalColumns,
                tables: allTables
            };
            
            progressBar.setSuccess('Tables extracted successfully!');
            
            // Show preview section
            setTimeout(() => {
                showPreviewSection();
            }, 1000);
            
        } catch (error) {
            console.error('Extraction failed:', error);
            progressBar.setError('Extraction failed: ' + error.message);
            
            setTimeout(() => {
                resetExtractor();
            }, 3000);
        }
    }

    async function extractPageData(page, textContent, mode, detection) {
        const tables = [];
        let totalRows = 0;
        let maxColumns = 0;
        
        if (mode === 'structured') {
            // Structured data extraction
            const items = textContent.items;
            const lines = [];
            let currentLine = [];
            let lastY = null;
            
            items.forEach(item => {
                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                    if (currentLine.length > 0) {
                        lines.push(currentLine);
                        currentLine = [];
                    }
                }
                currentLine.push(item.str);
                lastY = item.transform[5];
            });
            
            if (currentLine.length > 0) {
                lines.push(currentLine);
            }
            
            // Try to detect table structure
            if (detection === 'grid' || detection === 'smart') {
                const table = detectTableFromLines(lines);
                if (table) {
                    tables.push(table);
                    totalRows = table.data.length;
                    maxColumns = Math.max(...table.data.map(row => row.length));
                }
            }
            
        } else if (mode === 'text') {
            // Text only extraction
            const text = textContent.items.map(item => item.str).join(' ');
            tables.push({
                data: [[text]],
                type: 'text'
            });
            totalRows = 1;
            maxColumns = 1;
            
        } else {
            // Auto detect (default)
            const items = textContent.items;
            const gridData = [];
            
            // Simple grid-based detection
            items.forEach(item => {
                const x = Math.round(item.transform[4]);
                const y = Math.round(item.transform[5]);
                const text = item.str;
                
                // Group by similar Y coordinates (rows)
                let rowFound = false;
                for (let row of gridData) {
                    if (Math.abs(row.y - y) < 5) {
                        row.cells.push({ x, text });
                        rowFound = true;
                        break;
                    }
                }
                
                if (!rowFound) {
                    gridData.push({ y, cells: [{ x, text }] });
                }
            });
            
            // Sort rows and cells
            gridData.sort((a, b) => b.y - a.y);
            gridData.forEach(row => {
                row.cells.sort((a, b) => a.x - b.x);
            });
            
            // Create table data
            const tableData = gridData.map(row => row.cells.map(cell => cell.text));
            
            if (tableData.length > 0) {
                tables.push({
                    data: tableData,
                    type: 'detected'
                });
                totalRows = tableData.length;
                maxColumns = Math.max(...tableData.map(row => row.length));
            }
        }
        
        return {
            tables,
            totalRows,
            maxColumns
        };
    }

    function detectTableFromLines(lines) {
        if (lines.length === 0) return null;
        
        // Simple table detection - look for consistent column patterns
        const columnCounts = lines.map(line => line.length);
        const mostCommonCount = getMostFrequent(columnCounts);
        
        if (mostCommonCount < 2) return null;
        
        // Filter lines with the most common column count
        const tableLines = lines.filter(line => line.length === mostCommonCount);
        
        if (tableLines.length < 2) return null;
        
        return {
            data: tableLines,
            type: 'detected'
        };
    }

    function getMostFrequent(arr) {
        const frequency = {};
        let maxCount = 0;
        let mostFrequent = arr[0];
        
        arr.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
            if (frequency[item] > maxCount) {
                maxCount = frequency[item];
                mostFrequent = item;
            }
        });
        
        return mostFrequent;
    }

    async function extractAllText(pdf) {
        const textLines = [];
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            textLines.push(`Page ${pageNum}: ${pageText}`);
        }
        
        return textLines;
    }

    function applyWorksheetFormatting(worksheet, data) {
        // Apply basic formatting to the worksheet
        if (!worksheet['!ref']) return;
        
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        
        // Auto-size columns
        const colWidths = [];
        for (let C = range.s.c; C <= range.e.c; C++) {
            let maxWidth = 10;
            for (let R = range.s.r; R <= range.e.r; R++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (cell && cell.v) {
                    maxWidth = Math.max(maxWidth, cell.v.toString().length);
                }
            }
            colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
        }
        
        worksheet['!cols'] = colWidths;
    }

    function showPreviewSection() {
        const progressSection = document.getElementById('progressSection');
        const previewSection = document.getElementById('previewSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (previewSection) previewSection.style.display = 'block';
        
        // Update stats
        const tablesFound = document.getElementById('tablesFound');
        const rowsExtracted = document.getElementById('rowsExtracted');
        const columnsFound = document.getElementById('columnsFound');
        
        if (tablesFound) tablesFound.textContent = extractedData.tablesFound;
        if (rowsExtracted) rowsExtracted.textContent = extractedData.rowsExtracted;
        if (columnsFound) columnsFound.textContent = extractedData.columnsFound;
        
        // Show preview
        showTablePreview();
    }

    function showTablePreview() {
        const previewGrid = document.getElementById('tablePreview');
        if (!previewGrid || !extractedData.tables) return;
        
        previewGrid.innerHTML = '';
        
        extractedData.tables.forEach((table, index) => {
            const tableDiv = document.createElement('div');
            tableDiv.className = 'table-preview-item';
            
            const title = document.createElement('h4');
            title.textContent = `Table ${index + 1}`;
            tableDiv.appendChild(title);
            
            const tableElement = document.createElement('table');
            tableElement.className = 'preview-table';
            
            // Show first 10 rows max for preview
            const previewData = table.data.slice(0, 10);
            
            previewData.forEach((row, rowIndex) => {
                const tr = document.createElement('tr');
                
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                
                tableElement.appendChild(tr);
            });
            
            tableDiv.appendChild(tableElement);
            
            if (table.data.length > 10) {
                const moreInfo = document.createElement('p');
                moreInfo.textContent = `... and ${table.data.length - 10} more rows`;
                moreInfo.className = 'more-rows-info';
                tableDiv.appendChild(moreInfo);
            }
            
            previewGrid.appendChild(tableDiv);
        });
    }

    function downloadExcel() {
        if (!extractedData || !extractedData.blob) {
            alert('No Excel file to download');
            return;
        }

        const originalName = selectedFile.name.replace('.pdf', '');
        const filename = `${originalName}_extracted.xlsx`;
        
        const success = downloadManager.downloadFile(extractedData.blob, filename);
        
        if (success) {
            trackExtractionCompletion(selectedFile.name, extractedData.tablesFound, extractedData.rowsExtracted);
        }
    }

    function resetExtractor() {
        // Reset all states
        selectedFile = null;
        extractedData = null;
        
        // Reset UI
        const uploadArea = document.getElementById('uploadArea');
        const fileInfoSection = document.getElementById('fileInfoSection');
        const optionsSection = document.getElementById('optionsSection');
        const progressSection = document.getElementById('progressSection');
        const previewSection = document.getElementById('previewSection');
        
        if (uploadArea) {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('.upload-content').innerHTML = `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect width="80" height="80" rx="16" fill="rgba(34, 197, 94, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select PDF File</h3>
                <p>or drop PDF file containing tables here</p>
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
        if (optionsSection) optionsSection.style.display = 'none';
        if (progressSection) progressSection.style.display = 'none';
        if (previewSection) previewSection.style.display = 'none';
        
        // Reset progress bar
        if (progressBar) {
            progressBar.reset();
        }
        
        // Reset file input
        if (fileInput) {
            fileInput.value = '';
        }
    }

    function trackExtractionCompletion(fileName, tablesFound, rowsExtracted) {
        // Analytics tracking (placeholder)
        console.log(`PDF to Excel extraction completed: ${fileName}, tables: ${tablesFound}, rows: ${rowsExtracted}`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'pdf_to_excel_completed', {
        //     file_name: fileName,
        //     tables_found: tablesFound,
        //     rows_extracted: rowsExtracted
        // });
    }
}
