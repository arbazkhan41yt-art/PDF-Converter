// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize application
    initializeApp();
    
    // Setup tool card interactions
    setupToolCards();
    
    // Setup category pills
    setupCategoryPills();
    
    // Setup file upload handlers
    setupFileUpload();
    
    // Setup newsletter form
    setupNewsletter();
});

function initializeApp() {
    console.log('FileFlex Converter initialized');
    
    // Add loading states
    setupLoadingStates();
    
    // Setup analytics (placeholder)
    setupAnalytics();
    
    // Setup error handling
    setupErrorHandling();
}

function setupToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.querySelector('h3').textContent;
            const toolUrl = getToolUrl(toolName);
            
            if (toolUrl) {
                // Navigate to tool page
                window.location.href = toolUrl;
            } else {
                // Show coming soon message
                showComingSoon(toolName);
            }
        });
        
        // Add hover effect with ripple
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function getToolUrl(toolName) {
    const toolUrls = {
        'Merge PDF': 'tools/merge-pdf.html',
        'Split PDF': 'tools/split-pdf.html',
        'Compress PDF': 'tools/compress-pdf.html',
        'PDF to Word': 'tools/pdf-to-word.html',
        'JPG to PDF': 'tools/jpg-to-pdf.html',
        'Word to PDF': 'tools/word-to-pdf.html',
        'PDF to Excel': 'tools/pdf-to-excel.html',
        'Protect PDF': 'tools/protect-pdf.html'
    };
    
    return toolUrls[toolName] || null;
}

function showComingSoon(toolName) {
    const modal = createModal(`
        <h2>${toolName}</h2>
        <p>This tool is coming soon! We're working hard to bring you the best ${toolName.toLowerCase()} experience.</p>
        <p>Sign up for our newsletter to get notified when it's ready.</p>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn-primary" onclick="showNewsletterSignup()">Get Notified</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function setupCategoryPills() {
    const pills = document.querySelectorAll('.pill');
    const toolCards = document.querySelectorAll('.tool-card');
    
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active class from all pills
            pills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            this.classList.add('active');
            
            const category = this.textContent.trim();
            filterTools(category, toolCards);
        });
    });
}

function filterTools(category, toolCards) {
    const categories = {
        'All': ['merge', 'split', 'compress', 'convert', 'protect'],
        'Workflows': ['merge', 'split', 'compress'],
        'Organize PDF': ['merge', 'split'],
        'Optimize PDF': ['compress'],
        'Convert PDF': ['pdf-to-word', 'jpg-to-pdf', 'word-to-pdf', 'pdf-to-excel'],
        'Edit PDF': ['edit'],
        'PDF Security': ['protect']
    };
    
    const activeCategories = categories[category] || categories['All'];
    
    toolCards.forEach(card => {
        const toolName = card.querySelector('h3').textContent.toLowerCase();
        const shouldShow = activeCategories.some(cat => toolName.includes(cat));
        
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function setupFileUpload() {
    // Global drag and drop functionality
    let dragCounter = 0;
    
    document.addEventListener('dragenter', function(e) {
        e.preventDefault();
        dragCounter++;
        
        if (dragCounter === 1) {
            showDropZone();
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dragCounter--;
        
        if (dragCounter === 0) {
            hideDropZone();
        }
    });
    
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        dragCounter = 0;
        hideDropZone();
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
}

function showDropZone() {
    const existingDropZone = document.querySelector('.global-drop-zone');
    if (existingDropZone) return;
    
    const dropZone = document.createElement('div');
    dropZone.className = 'global-drop-zone';
    dropZone.innerHTML = `
        <div class="drop-zone-content">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="12" fill="rgba(220, 38, 38, 0.1)"/>
                <path d="M32 20v24m-12-12h24" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>Drop your files here</h3>
            <p>Support PDF, DOCX, JPG, PNG and more</p>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .global-drop-zone {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        }
        .drop-zone-content {
            background-color: white;
            padding: 48px;
            border-radius: 16px;
            text-align: center;
            border: 2px dashed var(--accent-red);
        }
        .drop-zone-content h3 {
            margin-top: 16px;
            margin-bottom: 8px;
            color: var(--primary-text);
        }
        .drop-zone-content p {
            color: var(--secondary-text);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(dropZone);
}

function hideDropZone() {
    const dropZone = document.querySelector('.global-drop-zone');
    if (dropZone) {
        dropZone.remove();
    }
}

function handleFiles(files) {
    // For now, just show file info
    // In real implementation, this would route to appropriate tool
    const file = files[0];
    const fileType = file.type;
    const fileName = file.name;
    
    let suggestedTool = '';
    
    if (fileType === 'application/pdf') {
        suggestedTool = 'PDF tools';
    } else if (fileType.includes('image/')) {
        suggestedTool = 'Image tools';
    } else if (fileType.includes('word') || fileName.endsWith('.docx')) {
        suggestedTool = 'Word to PDF';
    }
    
    const modal = createModal(`
        <h2>File Uploaded</h2>
        <p><strong>${fileName}</strong></p>
        <p>File type: ${fileType || 'Unknown'}</p>
        <p>Suggested tool: ${suggestedTool}</p>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn-primary" onclick="closeModal()">Choose Tool</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter');
    if (!newsletterForm) return;
    
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = input.value.trim();
        if (!email) {
            showError(input, 'Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError(input, 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.textContent = 'Subscribed!';
            button.style.backgroundColor = '#22c55e';
            input.value = '';
            
            setTimeout(() => {
                button.textContent = 'Subscribe';
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 3000);
        }, 1500);
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            button.click();
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#dc2626';
    error.style.fontSize = '12px';
    error.style.marginTop = '4px';
    
    input.parentNode.appendChild(error);
    input.style.borderColor = '#dc2626';
    
    setTimeout(() => {
        error.remove();
        input.style.borderColor = '';
    }, 3000);
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        }
        .modal {
            background-color: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .modal h2 {
            margin-bottom: 16px;
            color: var(--primary-text);
        }
        .modal p {
            margin-bottom: 16px;
            color: var(--secondary-text);
        }
        .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
        }
        .btn-primary, .btn-secondary {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }
        .btn-primary {
            background-color: var(--accent-red);
            color: white;
        }
        .btn-primary:hover {
            background-color: var(--hover-red);
        }
        .btn-secondary {
            background-color: var(--secondary-bg);
            color: var(--primary-text);
            border: 1px solid var(--border-color);
        }
        .btn-secondary:hover {
            background-color: var(--border-color);
        }
    `;
    document.head.appendChild(style);
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showNewsletterSignup() {
    closeModal();
    const newsletterInput = document.querySelector('.newsletter input');
    if (newsletterInput) {
        newsletterInput.focus();
        newsletterInput.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupLoadingStates() {
    // Add loading spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid var(--accent-red);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function setupAnalytics() {
    // Placeholder for analytics setup
    // In real implementation, this would initialize Google Analytics or similar
    console.log('Analytics initialized');
}

function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Application error:', e.error);
        // In production, this would send error to analytics service
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // In production, this would send error to analytics service
    });
}

// Global utility functions
window.closeModal = closeModal;
window.showNewsletterSignup = showNewsletterSignup;
