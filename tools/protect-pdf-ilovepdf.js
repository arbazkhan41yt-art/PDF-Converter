// Protect PDF Tool JavaScript - iLovePDF Style
document.addEventListener('DOMContentLoaded', function() {
    initializeProtectPDF();
});

function initializeProtectPDF() {
    const fileHandler = new FileHandler();
    let selectedFile = null;
    let protectedPdfBlob = null;

    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const previewContent = document.getElementById('previewContent');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const filePreview = document.getElementById('filePreview');
    const previewImage = document.getElementById('previewImage');
    const pdfPreview = document.getElementById('pdfPreview');
    const addMoreFilesBtn = document.getElementById('addMoreFilesBtn');
    const protectBtn = document.getElementById('protectBtn');
    const successSection = document.getElementById('successSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

    // Setup file input
    fileHandler.setupFileInput(fileInput, handleFileSelect, 'pdf');

    // Setup drag and drop
    fileHandler.setupDragAndDrop(previewContent, handleFileSelect, 'pdf');

    // Event Listeners
    addMoreFilesBtn.addEventListener('click', () => fileInput.click());
    protectBtn.addEventListener('click', protectPDF);
    downloadBtn.addEventListener('click', downloadProtectedPDF);
    
    // Password toggle functionality
    passwordToggle.addEventListener('click', () => togglePasswordVisibility(password, passwordToggle));
    confirmPasswordToggle.addEventListener('click', () => togglePasswordVisibility(confirmPassword, confirmPasswordToggle));

    // Password validation
    password.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);

    function handleFileSelect(files) {
        if (files.length === 0) return;
        
        selectedFile = files[0];
        showFilePreview();
        updateProtectButton();
    }

    function showFilePreview() {
        // Hide placeholder, show preview
        previewPlaceholder.style.display = 'none';
        filePreview.style.display = 'flex';
        
        // Generate PDF preview
        generatePDFPreview(selectedFile);
    }

    async function generatePDFPreview(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            
            // Load PDF using pdf.js
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const page = await pdf.getPage(1);
            
            // Create canvas for preview
            const canvas = pdfPreview;
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.5 });
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Render PDF page
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            // Show canvas, hide image
            canvas.style.display = 'block';
            previewImage.style.display = 'none';
            
        } catch (error) {
            console.error('Error generating PDF preview:', error);
            // Fallback to generic PDF icon
            showGenericPreview();
        }
    }

    function showGenericPreview() {
        previewImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiByeD0iMTYiIGZpbGw9IiNGOEY5RkEiLz4KPHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTYiIGZpbGw9InJnYmEoMjIsIDM4LCAyNDYsIDAuMSkiLz4KPHBhdGggZD0iTTQwIDIwdjQwbS0yMC0yMGg0MCIgc3Ryb2tlPSIjOGI1Y2Y2IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4KPHN2ZyB4PSI2MCIgeT0iNjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxNiIgZmlsbD0icmdiYSgyMiwgMzgsIDI0NiwgMC4xKSIvPgo8cGF0aCBkPSJNNDAgMjB2NDBtLTIwLTIwaDQwIiBzdHJva2U9IiM4YjVjZjYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
        previewImage.style.display = 'block';
        pdfPreview.style.display = 'none';
    }

    function togglePasswordVisibility(input, toggle) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        // Update icon
        if (type === 'text') {
            toggle.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10c-1.274 4.057-5.064 7-9.542 7-.628 0-1.245-.058-1.844-.164l-2.52-2.52C3.732 10.943 1.732 8.943.458 10l2.52 2.52c-.018.34-.018.68 0 1.02zM10 3c-1.537 0-2.988.36-4.278 1.01l3.268 3.268A2 2 0 0110 9a2 2 0 012 2 2 2 0 01-.722 1.537l3.268 3.268A9.98 9.98 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7z"/>
                </svg>
            `;
        } else {
            toggle.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            `;
        }
    }

    function validatePasswords() {
        const isValid = password.value.length >= 6 && password.value === confirmPassword.value;
        protectBtn.disabled = !isValid || !selectedFile;
        
        // Update button appearance
        if (isValid && selectedFile) {
            protectBtn.classList.add('active');
        } else {
            protectBtn.classList.remove('active');
        }
    }

    function updateProtectButton() {
        validatePasswords();
    }

    async function protectPDF() {
        if (!selectedFile) {
            alert('Please select a PDF file');
            return;
        }

        if (password.value.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Show loading state
            protectBtn.textContent = 'Protecting...';
            protectBtn.disabled = true;

            // Get options
            const encryptionLevel = document.getElementById('encryptionLevel').value;
            const preventPrinting = document.getElementById('preventPrinting').checked;
            const preventCopying = document.getElementById('preventCopying').checked;
            const preventModifying = document.getElementById('preventModifying').checked;

            // Read PDF file
            const arrayBuffer = await selectedFile.arrayBuffer();
            
            // Load PDF with PDF-lib
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            
            // Set permissions
            const permissions = {
                printing: !preventPrinting,
                modifying: !preventModifying,
                copying: !preventCopying,
                annotating: true
            };
            
            // Encrypt the PDF
            const encryptionAlgorithm = encryptionLevel === '256' 
                ? PDFLib.PDFEncryptionAlgorithm.AES256 
                : PDFLib.PDFEncryptionAlgorithm.AES128;
            
            pdf.encrypt({
                userPassword: password.value,
                ownerPassword: password.value,
                permissions: permissions,
                algorithm: encryptionAlgorithm
            });
            
            // Save the protected PDF
            const protectedPdfBytes = await pdf.save();
            protectedPdfBlob = new Blob([protectedPdfBytes], { type: 'application/pdf' });
            
            // Show success section
            showSuccessSection();
            
        } catch (error) {
            console.error('Protection failed:', error);
            alert('Failed to protect PDF: ' + error.message);
            
            // Reset button
            protectBtn.textContent = 'Protect PDF';
            protectBtn.disabled = false;
        }
    }

    function showSuccessSection() {
        // Hide options, show success
        document.querySelector('.options-header').style.display = 'none';
        document.querySelectorAll('.form-group').forEach(group => group.style.display = 'none');
        protectBtn.style.display = 'none';
        
        successSection.style.display = 'block';
    }

    function downloadProtectedPDF() {
        if (!protectedPdfBlob) {
            alert('No protected PDF to download');
            return;
        }

        const originalName = selectedFile.name.replace('.pdf', '');
        const filename = `${originalName}_protected.pdf`;
        
        // Download using FileSaver.js
        saveAs(protectedPdfBlob, filename);
        
        // Track completion
        trackProtectionCompletion(selectedFile.name);
    }

    function trackProtectionCompletion(fileName) {
        // Analytics tracking (placeholder)
        console.log(`PDF protection completed: ${fileName}`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'pdf_protection_completed', {
        //     file_name: fileName
        // });
    }

    // Initialize
    protectBtn.disabled = true;
}
