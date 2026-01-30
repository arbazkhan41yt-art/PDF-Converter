// Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Add mobile menu toggle to nav
    const navLeft = document.querySelector('.nav-left');
    if (navLeft) {
        navLeft.appendChild(mobileMenuToggle);
    }
    
    // Create Mobile Menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            <div class="mobile-menu-section">
                <h3>PDF Tools</h3>
                <a href="merge-pdf.html">Merge PDF</a>
                <a href="split-pdf.html">Split PDF</a>
                <a href="compress-pdf.html">Compress PDF</a>
                <a href="organize-pdf.html">Organize PDF</a>
            </div>
            <div class="mobile-menu-section">
                <h3>Convert to PDF</h3>
                <a href="jpg-to-pdf.html">JPG to PDF</a>
                <a href="word-to-pdf.html">Word to PDF</a>
                <a href="ppt-to-pdf.html">PPT to PDF</a>
                <a href="excel-to-pdf.html">Excel to PDF</a>
                <a href="html-to-pdf.html">HTML to PDF</a>
            </div>
            <div class="mobile-menu-section">
                <h3>Convert from PDF</h3>
                <a href="pdf-to-jpg.html">PDF to JPG</a>
                <a href="pdf-to-word.html">PDF to Word</a>
                <a href="pdf-to-ppt.html">PDF to PPT</a>
                <a href="pdf-to-excel.html">PDF to Excel</a>
                <a href="pdf-to-pdfa.html">PDF to PDF/A</a>
            </div>
            <div class="mobile-menu-section">
                <h3>Edit & Secure</h3>
                <a href="rotate-pdf.html">Rotate</a>
                <a href="watermark-pdf.html">Watermark</a>
                <a href="edit-pdf.html">Edit</a>
                <a href="sign-pdf.html">Sign</a>
                <a href="protect-pdf.html">Protect</a>
                <a href="unlock-pdf.html">Unlock</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    // Mobile menu toggle functionality
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // Dropdown menu functionality for desktop
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        // Handle click for touch devices
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.nav-dropdown');
            const wasActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(d => {
                d.classList.remove('active');
            });
            
            // Toggle current dropdown
            if (!wasActive) {
                dropdown.classList.add('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all dropdowns and mobile menu
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // "All PDF Tools" button functionality
    const allToolsBtn = document.querySelector('.all-tools-btn');
    if (allToolsBtn) {
        allToolsBtn.addEventListener('click', function() {
            // Create mega menu for all tools
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
                        <a href="merge-pdf.html">Merge PDF</a>
                        <a href="split-pdf.html">Split PDF</a>
                        <a href="remove-pages.html">Remove Pages</a>
                        <a href="organize-pdf.html">Organize PDF</a>
                    </div>
                    <div class="mega-menu-section">
                        <h3>OPTIMIZE</h3>
                        <a href="compress-pdf.html">Compress</a>
                        <a href="repair-pdf.html">Repair</a>
                        <a href="ocr-pdf.html">OCR</a>
                    </div>
                    <div class="mega-menu-section">
                        <h3>CONVERT TO</h3>
                        <a href="jpg-to-pdf.html">JPG to PDF</a>
                        <a href="word-to-pdf.html">Word to PDF</a>
                        <a href="ppt-to-pdf.html">PPT to PDF</a>
                        <a href="excel-to-pdf.html">Excel to PDF</a>
                        <a href="html-to-pdf.html">HTML to PDF</a>
                    </div>
                    <div class="mega-menu-section">
                        <h3>CONVERT FROM</h3>
                        <a href="pdf-to-jpg.html">PDF to JPG</a>
                        <a href="pdf-to-word.html">PDF to Word</a>
                        <a href="pdf-to-ppt.html">PDF to PPT</a>
                        <a href="pdf-to-excel.html">PDF to Excel</a>
                        <a href="pdf-to-pdfa.html">PDF to PDF/A</a>
                    </div>
                    <div class="mega-menu-section">
                        <h3>EDIT</h3>
                        <a href="rotate-pdf.html">Rotate</a>
                        <a href="add-watermark.html">Add Watermark</a>
                        <a href="crop-pdf.html">Crop</a>
                        <a href="edit-pdf.html">Edit</a>
                    </div>
                    <div class="mega-menu-section">
                        <h3>SECURITY</h3>
                        <a href="unlock-pdf.html">Unlock</a>
                        <a href="protect-pdf.html">Protect</a>
                        <a href="sign-pdf.html">Sign</a>
                        <a href="redact-pdf.html">Redact</a>
                        <a href="compare-pdf.html">Compare</a>
                    </div>
                </div>
            `;
            
            // Add styles for mega menu
            const style = document.createElement('style');
            style.textContent = `
                .mega-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background-color: var(--primary-bg);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    padding: var(--spacing-lg);
                    z-index: 1001;
                    min-width: 600px;
                }
                .mega-menu-content {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-lg);
                }
                .mega-menu-section h3 {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: var(--secondary-text);
                    margin-bottom: var(--spacing-md);
                }
                .mega-menu-section a {
                    display: block;
                    text-decoration: none;
                    color: var(--primary-text);
                    padding: var(--spacing-xs) 0;
                    font-size: 14px;
                    transition: color 0.2s ease;
                }
                .mega-menu-section a:hover {
                    color: var(--accent-red);
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
            
            document.body.appendChild(megaMenu);
            
            // Position the mega menu
            const btnRect = allToolsBtn.getBoundingClientRect();
            megaMenu.style.top = btnRect.bottom + 'px';
            megaMenu.style.right = '0';
        });
    }
    
    // Close mega menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.all-tools-btn') && !e.target.closest('.mega-menu')) {
            const megaMenu = document.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.remove();
            }
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active state to current page navigation
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-item, .mobile-menu-section a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavigation();
});
