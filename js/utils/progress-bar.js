// Progress Bar Utility
class ProgressBar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            height: '8px',
            backgroundColor: '#e5e7eb',
            fillColor: '#8b5cf6',
            showPercentage: true,
            animated: true,
            ...options
        };
        
        this.currentProgress = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Progress bar container not found');
            return;
        }

        this.createProgressBar();
        this.bindEvents();
    }

    createProgressBar() {
        // Create progress bar structure
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar-container';
        
        this.progressBar.innerHTML = `
            <div class="progress-bar" style="height: ${this.options.height}; background-color: ${this.options.backgroundColor};">
                <div class="progress-fill" style="background-color: ${this.options.fillColor}; width: 0%; transition: width 0.3s ease;"></div>
            </div>
            ${this.options.showPercentage ? '<div class="progress-text">0%</div>' : ''}
        `;

        // Add custom styles if needed
        this.addStyles();
        
        // Replace container content or append
        if (this.container.children.length > 0) {
            this.container.innerHTML = '';
        }
        this.container.appendChild(this.progressBar);
        
        // Get references to elements
        this.progressFill = this.progressBar.querySelector('.progress-fill');
        this.progressText = this.progressBar.querySelector('.progress-text');
    }

    addStyles() {
        const styleId = 'progress-bar-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .progress-bar-container {
                    width: 100%;
                    margin: 16px 0;
                }
                .progress-bar {
                    width: 100%;
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }
                .progress-fill {
                    height: 100%;
                    border-radius: 4px;
                    transition: width 0.3s ease;
                    position: relative;
                }
                .progress-fill.animated {
                    background-image: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.15) 25%,
                        transparent 25%,
                        transparent 50%,
                        rgba(255, 255, 255, 0.15) 50%,
                        rgba(255, 255, 255, 0.15) 75%,
                        transparent 75%,
                        transparent
                    );
                    background-size: 20px 20px;
                    animation: progress-bar-stripes 1s linear infinite;
                }
                @keyframes progress-bar-stripes {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 20px 0;
                    }
                }
                .progress-text {
                    text-align: center;
                    margin-top: 8px;
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                }
                .progress-bar-container.error .progress-fill {
                    background-color: #dc2626;
                }
                .progress-bar-container.success .progress-fill {
                    background-color: #22c55e;
                }
                .progress-bar-container.warning .progress-fill {
                    background-color: #f59e0b;
                }
            `;
            document.head.appendChild(style);
        }
    }

    bindEvents() {
        // Add any event listeners here if needed
    }

    // Set progress (0-100)
    setProgress(percentage, text = null) {
        percentage = Math.max(0, Math.min(100, percentage));
        this.currentProgress = percentage;

        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }

        if (this.progressText) {
            const displayText = text || `${Math.round(percentage)}%`;
            this.progressText.textContent = displayText;
        }

        // Add animation class if enabled
        if (this.options.animated && percentage > 0 && percentage < 100) {
            this.progressFill.classList.add('animated');
        } else {
            this.progressFill.classList.remove('animated');
        }
    }

    // Get current progress
    getProgress() {
        return this.currentProgress;
    }

    // Increment progress by amount
    increment(amount = 1, text = null) {
        this.setProgress(this.currentProgress + amount, text);
    }

    // Decrement progress by amount
    decrement(amount = 1, text = null) {
        this.setProgress(this.currentProgress - amount, text);
    }

    // Set progress to indeterminate state
    setIndeterminate(text = 'Processing...') {
        if (this.progressFill) {
            this.progressFill.style.width = '100%';
            this.progressFill.style.backgroundImage = 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)';
            this.progressFill.style.animation = 'progress-indeterminate 2s ease-in-out infinite';
        }

        if (this.progressText) {
            this.progressText.textContent = text;
        }

        // Add indeterminate animation
        this.addIndeterminateStyles();
    }

    addIndeterminateStyles() {
        const styleId = 'progress-indeterminate-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes progress-indeterminate {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Set error state
    setError(text = 'Error occurred') {
        this.container.classList.add('error');
        this.container.classList.remove('success', 'warning');
        
        if (this.progressText) {
            this.progressText.textContent = text;
        }
        
        this.progressFill.classList.remove('animated');
    }

    // Set success state
    setSuccess(text = 'Complete!') {
        this.container.classList.add('success');
        this.container.classList.remove('error', 'warning');
        
        this.setProgress(100, text);
        this.progressFill.classList.remove('animated');
    }

    // Set warning state
    setWarning(text = 'Warning') {
        this.container.classList.add('warning');
        this.container.classList.remove('error', 'success');
        
        if (this.progressText) {
            this.progressText.textContent = text;
        }
        
        this.progressFill.classList.remove('animated');
    }

    // Reset progress bar
    reset() {
        this.setProgress(0);
        this.container.classList.remove('error', 'success', 'warning');
        this.progressFill.classList.remove('animated');
    }

    // Show progress bar
    show() {
        this.container.style.display = 'block';
    }

    // Hide progress bar
    hide() {
        this.container.style.display = 'none';
    }

    // Simulate progress for demo purposes
    simulateProgress(duration = 3000, steps = 20) {
        this.reset();
        this.show();
        
        const stepDuration = duration / steps;
        const stepSize = 100 / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            
            if (currentStep <= steps) {
                this.setProgress(currentStep * stepSize);
            } else {
                clearInterval(interval);
                this.setSuccess('Complete!');
                
                // Auto hide after 2 seconds
                setTimeout(() => {
                    this.hide();
                }, 2000);
            }
        }, stepDuration);

        return interval;
    }

    // Animate progress to target value
    animateTo(target, duration = 1000, text = null) {
        const start = this.currentProgress;
        const change = target - start;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (change * easeOut);
            
            this.setProgress(currentValue, text);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Destroy progress bar
    destroy() {
        if (this.container && this.progressBar) {
            this.container.removeChild(this.progressBar);
        }
    }
}

// Static method to create progress bar quickly
ProgressBar.create = (containerId, options = {}) => {
    return new ProgressBar(containerId, options);
};

// Export for use in other modules
window.ProgressBar = ProgressBar;
