// Main JavaScript - All functionality in one file
document.addEventListener('DOMContentLoaded', function() {
    console.log('FileFlex Converter - Main JS Loaded');
    
    // Initialize Newsletter
    initializeNewsletter();
    
    // Initialize all functionality
    initializeNavigation();
    initializeToolCards();
    initializeFilterButtons();
    initializeDropdowns();
    initializeMobileMenu();
});

// Newsletter functionality
function initializeNewsletter() {
    // Handle newsletter subscription on homepage
    const newsletterBtn = document.querySelector('.newsletter button');
    const newsletterInput = document.querySelector('.newsletter input');
    
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', handleNewsletterSubscribe);
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleNewsletterSubscribe();
            }
        });
    }
    
    // Handle newsletter on tool pages
    const toolNewsletterBtn = document.getElementById('newsletterBtn');
    const toolNewsletterEmail = document.getElementById('newsletterEmail');
    
    if (toolNewsletterBtn && toolNewsletterEmail) {
        toolNewsletterBtn.addEventListener('click', function() {
            handleToolNewsletterSubscribe(toolNewsletterEmail);
        });
        
        toolNewsletterEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleToolNewsletterSubscribe(toolNewsletterEmail);
            }
        });
    }
}

function handleNewsletterSubscribe() {
    const newsletterInput = document.querySelector('.newsletter input');
    const newsletterBtn = document.querySelector('.newsletter button');
    const email = newsletterInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        newsletterInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        newsletterInput.focus();
        return;
    }
    
    // Show loading state
    const originalText = newsletterBtn.textContent;
    newsletterBtn.textContent = 'Subscribing...';
    newsletterBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Reset form
        newsletterInput.value = '';
        newsletterBtn.textContent = originalText;
        newsletterBtn.disabled = false;
        
        // Track subscription
        trackNewsletterSubscription(email);
    }, 1500);
}

function handleToolNewsletterSubscribe(inputElement) {
    const email = inputElement.value.trim();
    const subscribeBtn = document.getElementById('newsletterBtn');
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        inputElement.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        inputElement.focus();
        return;
    }
    
    // Show loading state
    const originalText = subscribeBtn.textContent;
    subscribeBtn.textContent = 'Subscribing...';
    subscribeBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Reset form
        inputElement.value = '';
        subscribeBtn.textContent = originalText;
        subscribeBtn.disabled = false;
        
        // Track subscription
        trackNewsletterSubscription(email);
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function trackNewsletterSubscription(email) {
    // Analytics tracking (placeholder)
    console.log(`Newsletter subscription: ${email}`);
    
    // In production, you would send this to your analytics service
    // Example: gtag('event', 'newsletter_subscription', {
    //     email: email
    // });
}

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

    // Handle Login link
    const loginLink = document.querySelector('.login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }

    // Handle Sign up button
    const signupBtn = document.querySelector('.signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupModal();
        });
    }

    // Handle Apps menu (Grid icon)
    const appsMenu = document.querySelector('.apps-menu');
    if (appsMenu) {
        appsMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleAppsMenu();
        });
    }
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

// Login Modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>Login to FileFlex</h2>
                <p>Access your files and conversion history</p>
                
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required placeholder="Enter your email">
                    </div>
                    
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" required placeholder="Enter your password">
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="rememberMe">
                            <span class="checkbox-custom"></span>
                            Remember me
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" class="btn-primary full-width">Login</button>
                </form>
                
                <div class="modal-divider">
                    <span>OR</span>
                </div>
                
                <div class="social-login">
                    <button class="btn-social google">
                        <span class="icon">G</span>
                        Continue with Google
                    </button>
                    <button class="btn-social facebook">
                        <span class="icon">f</span>
                        Continue with Facebook
                    </button>
                </div>
                
                <p class="modal-switch">
                    Don't have an account? <a href="#" onclick="switchToSignup()">Sign up</a>
                </p>
            </div>
        </div>
    `;
    
    addModalStyles();
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Signup Modal
function showSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>Sign up for FileFlex</h2>
                <p>Create your free account and start converting files</p>
                
                <form id="signupForm" onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label for="signupName">Full Name</label>
                        <input type="text" id="signupName" required placeholder="Enter your full name">
                    </div>
                    
                    <div class="form-group">
                        <label for="signupEmail">Email</label>
                        <input type="email" id="signupEmail" required placeholder="Enter your email">
                    </div>
                    
                    <div class="form-group">
                        <label for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" required placeholder="Create a password">
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" required placeholder="Confirm your password">
                    </div>
                    
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="agreeTerms" required>
                            <span class="checkbox-custom"></span>
                            I agree to the <a href="../pages/terms.html">Terms</a> and <a href="../pages/privacy-policy.html">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-primary full-width">Sign Up</button>
                </form>
                
                <div class="modal-divider">
                    <span>OR</span>
                </div>
                
                <div class="social-login">
                    <button class="btn-social google">
                        <span class="icon">G</span>
                        Continue with Google
                    </button>
                    <button class="btn-social facebook">
                        <span class="icon">f</span>
                        Continue with Facebook
                    </button>
                </div>
                
                <p class="modal-switch">
                    Already have an account? <a href="#" onclick="switchToLogin()">Login</a>
                </p>
            </div>
        </div>
    `;
    
    addModalStyles();
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Enhanced Modal Styles
function addModalStyles() {
    if (!document.getElementById('enhanced-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'enhanced-modal-styles';
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
                max-width: 450px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                animation: modalSlideIn 0.3s ease;
                position: relative;
            }
            .modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .modal-close:hover {
                background-color: #f3f4f6;
                color: #1f2937;
            }
            .modal h2 {
                margin-bottom: 8px;
                color: #1f2937;
                font-size: 24px;
                font-weight: 700;
            }
            .modal p {
                margin-bottom: 24px;
                color: #6b7280;
                font-size: 14px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #374151;
                font-size: 14px;
            }
            .form-group input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: #dc2626;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }
            .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #374151;
                cursor: pointer;
            }
            .checkbox-label input[type="checkbox"] {
                display: none;
            }
            .checkbox-custom {
                width: 16px;
                height: 16px;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                position: relative;
                transition: all 0.2s ease;
            }
            .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
                background-color: #dc2626;
                border-color: #dc2626;
            }
            .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 10px;
                font-weight: bold;
            }
            .forgot-password {
                color: #dc2626;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.2s ease;
            }
            .forgot-password:hover {
                color: #b91c1c;
            }
            .btn-primary {
                background-color: #dc2626;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
            }
            .btn-primary:hover {
                background-color: #b91c1c;
                transform: translateY(-1px);
            }
            .full-width {
                width: 100%;
            }
            .modal-divider {
                text-align: center;
                margin: 24px 0;
                position: relative;
            }
            .modal-divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background-color: #e5e7eb;
            }
            .modal-divider span {
                background-color: white;
                padding: 0 16px;
                color: #6b7280;
                font-size: 12px;
                position: relative;
            }
            .social-login {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 24px;
            }
            .btn-social {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                background-color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
                color: #374151;
            }
            .btn-social:hover {
                background-color: #f9fafb;
                border-color: #9ca3af;
            }
            .btn-social .icon {
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border-radius: 4px;
            }
            .btn-social.google .icon {
                background-color: #4285f4;
                color: white;
            }
            .btn-social.facebook .icon {
                background-color: #1877f2;
                color: white;
            }
            .modal-switch {
                text-align: center;
                margin-top: 24px;
                font-size: 14px;
                color: #6b7280;
            }
            .modal-switch a {
                color: #dc2626;
                text-decoration: none;
                font-weight: 500;
            }
            .modal-switch a:hover {
                color: #b91c1c;
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
            @media (max-width: 480px) {
                .modal {
                    padding: 24px;
                    margin: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Handle Login
window.handleLogin = function(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simulate login (in production, this would be an API call)
    console.log('Login attempt:', { email, password, rememberMe });
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Login successful! Welcome back.', 'success');
        closeModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // In production, you would:
        // 1. Store auth token
        // 2. Update UI to show logged-in state
        // 3. Redirect to dashboard or reload page
    }, 1500);
};

// Handle Signup
window.handleSignup = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Simulate signup (in production, this would be an API call)
    console.log('Signup attempt:', { name, email, password, agreeTerms });
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Account created successfully! Please check your email.', 'success');
        closeModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // In production, you would:
        // 1. Store auth token
        // 2. Update UI to show logged-in state
        // 3. Redirect to dashboard or show welcome message
    }, 1500);
};

// Switch to Signup
window.switchToSignup = function() {
    closeModal();
    setTimeout(() => {
        showSignupModal();
    }, 300);
};

// Switch to Login
window.switchToLogin = function() {
    closeModal();
    setTimeout(() => {
        showLoginModal();
    }, 300);
};

// Apps Menu functionality
function toggleAppsMenu() {
    const existingAppsMenu = document.querySelector('.apps-menu-dropdown');
    if (existingAppsMenu) {
        existingAppsMenu.remove();
        return;
    }

    const appsMenuDropdown = document.createElement('div');
    appsMenuDropdown.className = 'apps-menu-dropdown';
    appsMenuDropdown.innerHTML = `
        <div class="apps-menu-content">
            <div class="apps-menu-header">
                <h3>All PDF Tools (20)</h3>
                <button class="apps-menu-close" onclick="closeAppsMenu()">✕</button>
            </div>
            
            <!-- Organize PDF -->
            <div class="apps-category">
                <h4>📁 Organize PDF</h4>
                <div class="apps-grid">
                    <a href="tools/merge-pdf.html" class="app-item">
                        <div class="app-icon orange">📄</div>
                        <span>Merge PDF</span>
                    </a>
                    <a href="tools/split-pdf.html" class="app-item">
                        <div class="app-icon orange">✂️</div>
                        <span>Split PDF</span>
                    </a>
                    <a href="tools/rotate-pdf.html" class="app-item">
                        <div class="app-icon blue">🔄</div>
                        <span>Rotate PDF</span>
                    </a>
                    <a href="tools/organize-pdf.html" class="app-item">
                        <div class="app-icon purple">📋</div>
                        <span>Organize PDF</span>
                    </a>
                    <a href="tools/remove-pages.html" class="app-item">
                        <div class="app-icon red">🗑️</div>
                        <span>Remove Pages</span>
                    </a>
                    <a href="tools/extract-pages.html" class="app-item">
                        <div class="app-icon green">📤</div>
                        <span>Extract Pages</span>
                    </a>
                </div>
            </div>
            
            <!-- Optimize PDF -->
            <div class="apps-category">
                <h4>⚡ Optimize PDF</h4>
                <div class="apps-grid">
                    <a href="tools/compress-pdf.html" class="app-item">
                        <div class="app-icon green">🗜️</div>
                        <span>Compress PDF</span>
                    </a>
                    <a href="tools/repair-pdf.html" class="app-item">
                        <div class="app-icon orange">🔧</div>
                        <span>Repair PDF</span>
                    </a>
                    <a href="tools/ocr-pdf.html" class="app-item">
                        <div class="app-icon green">🔍</div>
                        <span>OCR PDF</span>
                    </a>
                    <a href="tools/optimize-pdf.html" class="app-item">
                        <div class="app-icon blue">⚙️</div>
                        <span>Optimize PDF</span>
                    </a>
                </div>
            </div>
            
            <!-- Convert to PDF -->
            <div class="apps-category">
                <h4>📥 Convert to PDF</h4>
                <div class="apps-grid">
                    <a href="tools/jpg-to-pdf.html" class="app-item">
                        <div class="app-icon yellow">�️</div>
                        <span>JPG to PDF</span>
                    </a>
                    <a href="tools/word-to-pdf.html" class="app-item">
                        <div class="app-icon blue">📄</div>
                        <span>Word to PDF</span>
                    </a>
                    <a href="tools/ppt-to-pdf.html" class="app-item">
                        <div class="app-icon orange">📊</div>
                        <span>PPT to PDF</span>
                    </a>
                    <a href="tools/excel-to-pdf.html" class="app-item">
                        <div class="app-icon green">�</div>
                        <span>Excel to PDF</span>
                    </a>
                    <a href="tools/html-to-pdf.html" class="app-item">
                        <div class="app-icon purple">🌐</div>
                        <span>HTML to PDF</span>
                    </a>
                    <a href="tools/scan-to-pdf.html" class="app-item">
                        <div class="app-icon blue">📷</div>
                        <span>Scan to PDF</span>
                    </a>
                </div>
            </div>
            
            <!-- Convert from PDF -->
            <div class="apps-category">
                <h4>📤 Convert from PDF</h4>
                <div class="apps-grid">
                    <a href="tools/pdf-to-jpg.html" class="app-item">
                        <div class="app-icon yellow">🖼️</div>
                        <span>PDF to JPG</span>
                    </a>
                    <a href="tools/pdf-to-word.html" class="app-item">
                        <div class="app-icon blue">�</div>
                        <span>PDF to Word</span>
                    </a>
                    <a href="tools/pdf-to-ppt.html" class="app-item">
                        <div class="app-icon orange">📊</div>
                        <span>PDF to PPT</span>
                    </a>
                    <a href="tools/pdf-to-excel.html" class="app-item">
                        <div class="app-icon green">📊</div>
                        <span>PDF to Excel</span>
                    </a>
                    <a href="tools/pdf-to-pdfa.html" class="app-item">
                        <div class="app-icon purple">🏛️</div>
                        <span>PDF to PDF/A</span>
                    </a>
                </div>
            </div>
            
            <!-- Edit PDF -->
            <div class="apps-category">
                <h4>✏️ Edit PDF</h4>
                <div class="apps-grid">
                    <a href="tools/edit-pdf.html" class="app-item">
                        <div class="app-icon blue">✏️</div>
                        <span>Edit PDF</span>
                    </a>
                    <a href="tools/crop-pdf.html" class="app-item">
                        <div class="app-icon orange">✂️</div>
                        <span>Crop PDF</span>
                    </a>
                    <a href="tools/add-page-numbers.html" class="app-item">
                        <div class="app-icon green">🔢</div>
                        <span>Add Page Numbers</span>
                    </a>
                    <a href="tools/watermark-pdf.html" class="app-item">
                        <div class="app-icon purple">💧</div>
                        <span>Watermark PDF</span>
                    </a>
                    <a href="tools/compare-pdf.html" class="app-item">
                        <div class="app-icon blue">🔍</div>
                        <span>Compare PDF</span>
                    </a>
                </div>
            </div>
            
            <!-- PDF Security -->
            <div class="apps-category">
                <h4>🔒 PDF Security</h4>
                <div class="apps-grid">
                    <a href="tools/protect-pdf.html" class="app-item">
                        <div class="app-icon purple">🔒</div>
                        <span>Protect PDF</span>
                    </a>
                    <a href="tools/unlock-pdf.html" class="app-item">
                        <div class="app-icon green">�</div>
                        <span>Unlock PDF</span>
                    </a>
                    <a href="tools/sign-pdf.html" class="app-item">
                        <div class="app-icon blue">✍️</div>
                        <span>Sign PDF</span>
                    </a>
                    <a href="tools/redact-pdf.html" class="app-item">
                        <div class="app-icon red">�</div>
                        <span>Redact PDF</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    // Add apps menu styles
    addAppsMenuStyles();

    document.body.appendChild(appsMenuDropdown);

    // Position the menu
    const appsBtn = document.querySelector('.apps-menu');
    const btnRect = appsBtn.getBoundingClientRect();
    appsMenuDropdown.style.position = 'fixed';
    appsMenuDropdown.style.top = (btnRect.bottom + window.scrollY) + 'px';
    appsMenuDropdown.style.right = '20px';

    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', closeAppsMenuOnClickOutside);
    }, 100);
}

function closeAppsMenu() {
    const appsMenu = document.querySelector('.apps-menu-dropdown');
    if (appsMenu) {
        appsMenu.remove();
    }
    document.removeEventListener('click', closeAppsMenuOnClickOutside);
}

function closeAppsMenuOnClickOutside(e) {
    if (!e.target.closest('.apps-menu-dropdown') && !e.target.closest('.apps-menu')) {
        closeAppsMenu();
    }
}

function addAppsMenuStyles() {
    if (!document.getElementById('apps-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'apps-menu-styles';
        style.textContent = `
            .apps-menu-dropdown {
                position: fixed;
                background-color: white;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                min-width: 320px;
                max-width: 400px;
                animation: appsMenuSlideIn 0.2s ease;
            }
            .apps-menu-content {
                padding: 16px;
            }
            .apps-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e7eb;
            }
            .apps-menu-header h3 {
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
                margin: 0;
            }
            .apps-menu-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #6b7280;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .apps-menu-close:hover {
                background-color: #f3f4f6;
                color: #1f2937;
            }
            .apps-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
            }
            .app-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-decoration: none;
                padding: 12px 8px;
                border-radius: 8px;
                transition: all 0.2s ease;
                text-align: center;
            }
            .app-item:hover {
                background-color: #f9fafb;
                transform: translateY(-2px);
            }
            .app-icon {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                margin-bottom: 8px;
            }
            .app-icon.orange {
                background-color: rgba(249, 115, 22, 0.1);
            }
            .app-icon.green {
                background-color: rgba(34, 197, 94, 0.1);
            }
            .app-icon.blue {
                background-color: rgba(59, 130, 246, 0.1);
            }
            .app-icon.yellow {
                background-color: rgba(234, 179, 8, 0.1);
            }
            .app-icon.purple {
                background-color: rgba(139, 92, 246, 0.1);
            }
            .app-item span {
                font-size: 11px;
                color: #374151;
                font-weight: 500;
                line-height: 1.2;
            }
            @keyframes appsMenuSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @media (max-width: 480px) {
                .apps-menu-dropdown {
                    position: fixed;
                    top: 60px !important;
                    left: 10px !important;
                    right: 10px !important;
                    min-width: auto;
                    max-width: none;
                }
                .apps-grid {
                    grid-template-columns: repeat(4, 1fr);
                }
                .app-icon {
                    width: 35px;
                    height: 35px;
                    font-size: 16px;
                }
                .app-item span {
                    font-size: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

    // Add notification styles
    addNotificationStyles();

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function addNotificationStyles() {
    const styleId = 'notification-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                min-width: 300px;
                border-left: 4px solid #3b82f6;
                animation: slideIn 0.3s ease;
            }
            .notification.success {
                border-left-color: #22c55e;
            }
            .notification.error {
                border-left-color: #dc2626;
            }
            .notification.warning {
                border-left-color: #f59e0b;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-icon {
                font-size: 18px;
                font-weight: bold;
            }
            .notification.success .notification-icon {
                color: #22c55e;
            }
            .notification.error .notification-icon {
                color: #dc2626;
            }
            .notification.warning .notification-icon {
                color: #f59e0b;
            }
            .notification.info .notification-icon {
                color: #3b82f6;
            }
            .notification-message {
                font-size: 14px;
                color: #1f2937;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @media (max-width: 480px) {
                .notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Global functions
window.closeModal = closeModal;
window.showNewsletterSignup = showNewsletterSignup;
