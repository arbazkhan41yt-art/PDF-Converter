// Protect PDF Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProtectPDF();
});

function initializeProtectPDF() {
    const fileHandler = new FileHandler();
    let selectedFile = null;
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

    // Setup password fields
    setupPasswordValidation();

    // Setup protect button
    const protectBtn = document.getElementById('protectBtn');
    if (protectBtn) {
        protectBtn.addEventListener('click', protectPDF);
    }

    // Setup download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadProtectedPDF);
    }

    // Setup protect another button
    const protectAnotherBtn = document.getElementById('protectAnotherBtn');
    if (protectAnotherBtn) {
        protectAnotherBtn.addEventListener('click', resetProtector);
    }

    function setupPasswordValidation() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password) {
            password.addEventListener('input', function() {
                updatePasswordStrength(this.value);
                checkPasswordMatch();
            });
        }
        
        if (confirmPassword) {
            confirmPassword.addEventListener('input', checkPasswordMatch);
        }
    }

    function updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthFill || !strengthText) return;
        
        let strength = 0;
        let strengthLabel = '';
        let strengthColor = '';
        
        if (password.length === 0) {
            strength = 0;
            strengthLabel = 'Enter password';
            strengthColor = '#e5e7eb';
        } else if (password.length < 6) {
            strength = 25;
            strengthLabel = 'Weak (too short)';
            strengthColor = '#ef4444';
        } else {
            // Calculate strength based on various criteria
            let score = 0;
            
            // Length
            if (password.length >= 8) score += 1;
            if (password.length >= 12) score += 1;
            
            // Contains lowercase
            if (/[a-z]/.test(password)) score += 1;
            
            // Contains uppercase
            if (/[A-Z]/.test(password)) score += 1;
            
            // Contains numbers
            if (/\d/.test(password)) score += 1;
            
            // Contains special characters
            if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
            
            if (score <= 2) {
                strength = 25;
                strengthLabel = 'Weak';
                strengthColor = '#ef4444';
            } else if (score <= 4) {
                strength = 50;
                strengthLabel = 'Medium';
                strengthColor = '#f59e0b';
            } else {
                strength = 100;
                strengthLabel = 'Strong';
                strengthColor = '#22c55e';
            }
        }
        
        strengthFill.style.width = strength + '%';
        strengthFill.style.backgroundColor = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
    }

    function checkPasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const matchText = document.getElementById('matchText');
        
        if (!password || !confirmPassword || !matchText) return;
        
        if (confirmPassword.value === '') {
            matchText.textContent = 'Confirm password';
            matchText.style.color = '#6b7280';
        } else if (password.value === confirmPassword.value) {
            matchText.textContent = 'Passwords match';
            matchText.style.color = '#22c55e';
        } else {
            matchText.textContent = 'Passwords don\'t match';
            matchText.style.color = '#ef4444';
        }
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

    async function protectPDF() {
        if (!selectedFile) {
            alert('Please select a PDF file');
            return;
        }

        // Validate password
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!password || password.length < 6) {
            alert('Please enter a password with at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Show progress
            const optionsSection = document.getElementById('optionsSection');
            const progressSection = document.getElementById('progressSection');
            
            if (optionsSection) optionsSection.style.display = 'none';
            if (progressSection) progressSection.style.display = 'block';
            
            // Get protection options
            const encryptionLevel = document.querySelector('input[name="encryption"]:checked').value;
            const preventPrinting = document.getElementById('preventPrinting').checked;
            const preventCopying = document.getElementById('preventCopying').checked;
            const preventModifying = document.getElementById('preventModifying').checked;
            const preventAnnotations = document.getElementById('preventAnnotations').checked;
            
            progressBar.setProgress(10, 'Loading PDF document...');
            
            // Read PDF file
            const arrayBuffer = await selectedFile.arrayBuffer();
            progressBar.setProgress(30, 'Analyzing document structure...');
            
            // Load PDF
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            progressBar.setProgress(50, 'Applying security settings...');
            
            // Set permissions based on user selection
            const permissions = {
                printing: !preventPrinting,
                modifying: !preventModifying,
                copying: !preventCopying,
                annotating: !preventAnnotations
            };
            
            // Encrypt the PDF
            const encryptionAlgorithm = encryptionLevel === '256' 
                ? PDFLib.PDFEncryptionAlgorithm.AES256 
                : PDFLib.PDFEncryptionAlgorithm.AES128;
            
            pdf.encrypt({
                userPassword: password,
                ownerPassword: password, // Use same password for simplicity
                permissions: permissions,
                algorithm: encryptionAlgorithm
            });
            
            progressBar.setProgress(80, 'Saving protected PDF...');
            
            // Save the protected PDF
            const protectedPdfBytes = await pdf.save();
            const protectedPdfBlob = new Blob([protectedPdfBytes], { type: 'application/pdf' });
            
            // Store for download
            window.protectedPdfBlob = protectedPdfBlob;
            
            progressBar.setSuccess('PDF protected successfully!');
            
            // Show download section
            setTimeout(() => {
                showDownloadSection();
            }, 1000);
            
        } catch (error) {
            console.error('Protection failed:', error);
            progressBar.setError('Protection failed: ' + error.message);
            
            setTimeout(() => {
                resetProtector();
            }, 3000);
        }
    }

    function showDownloadSection() {
        const progressSection = document.getElementById('progressSection');
        const downloadSection = document.getElementById('downloadSection');
        
        if (progressSection) progressSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'block';
    }

    function downloadProtectedPDF() {
        if (!window.protectedPdfBlob) {
            alert('No protected PDF to download');
            return;
        }

        const originalName = selectedFile.name.replace('.pdf', '');
        const filename = `${originalName}_protected.pdf`;
        
        // Use universal downloader for better experience
        try {
            window.universalDownloader.downloadFile(window.protectedPdfBlob, filename);
            trackProtectionCompletion(selectedFile.name);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to FileSaver.js
            if (typeof saveAs !== 'undefined') {
                saveAs(window.protectedPdfBlob, filename);
                trackProtectionCompletion(selectedFile.name);
            } else {
                alert('Download failed. Please try again.');
            }
        }
    }

    function resetProtector() {
        // Reset all states
        selectedFile = null;
        window.protectedPdfBlob = null;
        
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
                    <rect width="80" height="80" rx="16" fill="rgba(139, 92, 246, 0.1)"/>
                    <path d="M40 20v40m-20-20h40" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>Select PDF File</h3>
                <p>or drop PDF file to protect</p>
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
        if (downloadSection) downloadSection.style.display = 'none';
        
        // Reset progress bar
        if (progressBar) {
            progressBar.reset();
        }
        
        // Reset form fields
        if (fileInput) {
            fileInput.value = '';
        }
        
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        if (password) password.value = '';
        if (confirmPassword) confirmPassword.value = '';
        
        // Reset password strength indicator
        updatePasswordStrength('');
        checkPasswordMatch();
        
        // Reset checkboxes
        const checkboxes = ['preventPrinting', 'preventCopying', 'preventModifying', 'preventAnnotations'];
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        });
        
        // Reset encryption level
        const defaultEncryption = document.querySelector('input[name="encryption"][value="128"]');
        if (defaultEncryption) defaultEncryption.checked = true;
    }

    function trackProtectionCompletion(fileName) {
        // Analytics tracking (placeholder)
        console.log(`PDF protection completed: ${fileName}`);
        
        // In production, you would send this to your analytics service
        // Example: gtag('event', 'pdf_protection_completed', {
        //     file_name: fileName
        // });
    }
}
