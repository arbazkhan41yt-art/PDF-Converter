// Main JavaScript - All functionality in one file
document.addEventListener('DOMContentLoaded', function() {
    console.log('FileFlex Converter - Main JS Loaded');
    
    // Initialize all functionality
    initializeNavigation();
    initializeToolCards();
    initializeFilterButtons();
    initializeDropdowns();
    initializeMobileMenu();
});

// Navigation functionality
function initializeNavigation() {
    // Handle nav item clicks
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // If it's a real link, let it work normally
            if (this.href && this.href !== '#') {
                console.log('Navigating to:', this.href);
                return;
            }
            
            // Prevent default for non-links
            e.preventDefault();
        });
    });
}

// Tool cards functionality
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // Add cursor pointer
        card.style.cursor = 'pointer';
        
        // Click handler
        card.addEventListener('click', function() {
            const url = this.dataset.url;
            if (url) {
                console.log('Opening tool:', url);
                window.location.href = url;
            } else {
                console.log('No URL defined for this tool');
                showComingSoon(this.querySelector('h3').textContent);
            }
        });
        
        // Hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        });
    });
}

// Filter buttons functionality
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.pill');
    const toolCards = document.querySelectorAll('.tool-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            console.log('Filtering by:', filter);
            
            // Filter tools
            filterTools(filter, toolCards);
        });
    });
}

function filterTools(filter, toolCards) {
    toolCards.forEach(card => {
        const category = card.dataset.category;
        
        let shouldShow = false;
        
        if (filter === 'all') {
            shouldShow = true;
        } else if (filter === 'workflows') {
            // Show organize and optimize tools for workflows
            shouldShow = category === 'organize' || category === 'optimize';
        } else {
            // Show tools matching the category
            shouldShow = category === filter;
        }
        
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

// Dropdown functionality
function initializeDropdowns() {
    // Convert PDF dropdown
    const convertDropdown = document.querySelector('.nav-dropdown');
    const convertToggle = document.querySelector('.dropdown-toggle');
    
    if (convertDropdown && convertToggle) {
        // Click to toggle
        convertToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            convertDropdown.classList.toggle('active');
        });
    }
    
    // All PDF Tools button
    const allToolsBtn = document.querySelector('.all-tools-btn');
    if (allToolsBtn) {
        allToolsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMegaMenu();
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
        
        if (!e.target.closest('.all-tools-btn') && !e.target.closest('.mega-menu')) {
            const megaMenu = document.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.remove();
            }
        }
    });
}

// Mega menu functionality
function toggleMegaMenu() {
    const existingMegaMenu = document.querySelector('.mega-menu');
    if (existingMegaMenu) {
        existingMegaMenu.remove();
        return;
    }
    
    const megaMenu = document.createElement('div');
    megaMenu.className = 'mega-menu';
    megaMenu.innerHTML = `
        <div class="mega-menu-content">
            <div class="mega-menu-section">
                <h3>ORGANIZE</h3>
                <a href="tools/merge-pdf.html">Merge PDF</a>
                <a href="tools/split-pdf.html">Split PDF</a>
                <a href="tools/remove-pages.html">Remove Pages</a>
                <a href="tools/organize-pdf.html">Organize PDF</a>
            </div>
            <div class="mega-menu-section">
                <h3>OPTIMIZE</h3>
                <a href="tools/compress-pdf.html">Compress</a>
                <a href="tools/repair-pdf.html">Repair</a>
                <a href="tools/ocr-pdf.html">OCR</a>
            </div>
            <div class="mega-menu-section">
                <h3>CONVERT TO</h3>
                <a href="tools/jpg-to-pdf.html">JPG to PDF</a>
                <a href="tools/word-to-pdf.html">Word to PDF</a>
                <a href="tools/ppt-to-pdf.html">PPT to PDF</a>
                <a href="tools/excel-to-pdf.html">Excel to PDF</a>
                <a href="tools/html-to-pdf.html">HTML to PDF</a>
            </div>
            <div class="mega-menu-section">
                <h3>CONVERT FROM</h3>
                <a href="tools/pdf-to-jpg.html">PDF to JPG</a>
                <a href="tools/pdf-to-word.html">PDF to Word</a>
                <a href="tools/pdf-to-ppt.html">PDF to PPT</a>
                <a href="tools/pdf-to-excel.html">PDF to Excel</a>
                <a href="tools/pdf-to-pdfa.html">PDF to PDF/A</a>
            </div>
            <div class="mega-menu-section">
                <h3>EDIT</h3>
                <a href="tools/rotate-pdf.html">Rotate</a>
                <a href="tools/add-watermark.html">Add Watermark</a>
                <a href="tools/crop-pdf.html">Crop</a>
                <a href="tools/edit-pdf.html">Edit</a>
            </div>
            <div class="mega-menu-section">
                <h3>SECURITY</h3>
                <a href="tools/unlock-pdf.html">Unlock</a>
                <a href="tools/protect-pdf.html">Protect</a>
                <a href="tools/sign-pdf.html">Sign</a>
                <a href="tools/redact-pdf.html">Redact</a>
                <a href="tools/compare-pdf.html">Compare</a>
            </div>
        </div>
    `;
    
    // Add styles for mega menu
    if (!document.getElementById('mega-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'mega-menu-styles';
        style.textContent = `
            .mega-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background-color: white;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                padding: 24px;
                z-index: 1001;
                min-width: 600px;
                animation: slideDown 0.2s ease;
            }
            .mega-menu-content {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
            }
            .mega-menu-section h3 {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                color: #6b7280;
                margin-bottom: 12px;
            }
            .mega-menu-section a {
                display: block;
                text-decoration: none;
                color: #1f2937;
                padding: 4px 0;
                font-size: 14px;
                transition: color 0.2s ease;
            }
            .mega-menu-section a:hover {
                color: #dc2626;
            }
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @media (max-width: 767px) {
                .mega-menu {
                    position: fixed;
                    top: 60px;
                    left: 50%;
                    transform: translateX(-50%);
                    min-width: 90%;
                    max-width: 400px;
                }
                .mega-menu-content {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(megaMenu);
    
    // Position the mega menu
    const btnRect = allToolsBtn.getBoundingClientRect();
    megaMenu.style.position = 'fixed';
    megaMenu.style.top = (btnRect.bottom + window.scrollY) + 'px';
    megaMenu.style.right = '20px';
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Create mobile menu toggle if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        const navLeft = document.querySelector('.nav-left');
        if (navLeft) {
            navLeft.appendChild(mobileToggle);
        }
        
        // Add mobile menu styles
        if (!document.getElementById('mobile-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-menu-styles';
            style.textContent = `
                .mobile-menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                }
                .mobile-menu-toggle span {
                    display: block;
                    width: 25px;
                    height: 3px;
                    background-color: #1f2937;
                    margin: 5px 0;
                    transition: 0.3s;
                }
                @media (max-width: 991px) {
                    .mobile-menu-toggle {
                        display: block;
                    }
                    .nav-menu {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Mobile menu toggle functionality
        mobileToggle.addEventListener('click', function() {
            console.log('Mobile menu clicked');
            // Here you would show/hide mobile menu
        });
    }
}

// Coming soon modal
function showComingSoon(toolName) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <h2>${toolName}</h2>
                <p>This tool is coming soon! We're working hard to bring you the best ${toolName.toLowerCase()} experience.</p>
                <p>Sign up for our newsletter to get notified when it's ready.</p>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">Close</button>
                    <button class="btn-primary" onclick="showNewsletterSignup()">Get Notified</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
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
                animation: modalSlideIn 0.3s ease;
            }
            .modal h2 {
                margin-bottom: 16px;
                color: #1f2937;
            }
            .modal p {
                margin-bottom: 16px;
                color: #6b7280;
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
                background-color: #dc2626;
                color: white;
            }
            .btn-primary:hover {
                background-color: #b91c1c;
            }
            .btn-secondary {
                background-color: #f9fafb;
                color: #1f2937;
                border: 1px solid #e5e7eb;
            }
            .btn-secondary:hover {
                background-color: #e5e7eb;
            }
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
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

// Global functions
window.closeModal = closeModal;
window.showNewsletterSignup = showNewsletterSignup;
