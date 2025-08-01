// Main Application Controller
class InzopayApp {
    constructor() {
        this.currentLang = 'en';
        this.isRTL = false;
        this.processSlider = {
            currentStep: 1,
            totalSteps: 4
        };
        
        this.init();
    }

    init() {
        this.initializeIcons();
        this.setupEventListeners();
        this.setupLanguageToggle();
        this.setupProcessSlider();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        
        // Initialize after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeFeatures();
            });
        } else {
            this.initializeFeatures();
        }
    }

    initializeIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initializeFeatures() {
        this.addInteractiveEffects();
        this.setupTooltips();
        this.detectUserPreferences();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Focus management
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
    }

    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        if (!langToggle) return;

        langToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLanguage();
        });
    }

    toggleLanguage() {
        const html = document.documentElement;
        const langToggle = document.getElementById('langToggle');
        
        if (this.currentLang === 'en') {
            this.currentLang = 'ar';
            this.isRTL = true;
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            langToggle.querySelector('span').textContent = 'English';
        } else {
            this.currentLang = 'en';
            this.isRTL = false;
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            langToggle.querySelector('span').textContent = 'العربية';
        }

        this.updateTextContent();
        this.reinitializeIcons();
    }

    updateTextContent() {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        
        elements.forEach(element => {
            const text = this.currentLang === 'en' ? element.dataset.en : element.dataset.ar;
            if (text) {
                element.textContent = text;
            }
        });
    }

    reinitializeIcons() {
        // Reinitialize icons after text changes
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }

    setupProcessSlider() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const indicators = document.querySelectorAll('.indicator');

        if (!nextBtn || !prevBtn) return;

        nextBtn.addEventListener('click', () => {
            this.nextStep();
        });

        prevBtn.addEventListener('click', () => {
            this.prevStep();
        });

        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const step = parseInt(e.target.dataset.step);
                if (step) {
                    this.goToStep(step);
                }
            });
        });

        // Auto-advance slider
        this.setupAutoAdvance();
    }

    nextStep() {
        if (this.processSlider.currentStep < this.processSlider.totalSteps) {
            this.processSlider.currentStep++;
        } else {
            this.processSlider.currentStep = 1;
        }
        this.updateProcessSlider();
    }

    prevStep() {
        if (this.processSlider.currentStep > 1) {
            this.processSlider.currentStep--;
        } else {
            this.processSlider.currentStep = this.processSlider.totalSteps;
        }
        this.updateProcessSlider();
    }

    goToStep(step) {
        if (step >= 1 && step <= this.processSlider.totalSteps) {
            this.processSlider.currentStep = step;
            this.updateProcessSlider();
        }
    }

    updateProcessSlider() {
        const steps = document.querySelectorAll('.process-step');
        const indicators = document.querySelectorAll('.indicator');

        steps.forEach((step, index) => {
            if (index + 1 === this.processSlider.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        indicators.forEach((indicator, index) => {
            if (index + 1 === this.processSlider.currentStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    setupAutoAdvance() {
        setInterval(() => {
            // Auto-advance every 5 seconds if user isn't interacting
            if (!this.userInteracting) {
                this.nextStep();
            }
        }, 5000);

        // Track user interaction
        const processSection = document.getElementById('process');
        if (processSection) {
            processSection.addEventListener('mouseenter', () => {
                this.userInteracting = true;
            });

            processSection.addEventListener('mouseleave', () => {
                this.userInteracting = false;
            });
        }
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Update aria attributes
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    addInteractiveEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.feature-card, .service-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.4)';
            });
        });

        // Add glow effect to buttons
        const glowButtons = document.querySelectorAll('.glow-button');
        
        glowButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.6)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
            });
        });
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        tooltip.classList.add('visible');
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    detectUserPreferences() {
        // Detect user's preferred language from browser
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ar') && this.currentLang === 'en') {
            this.toggleLanguage();
        }

        // Detect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }

        // Detect color scheme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
    }

    handleResize() {
        // Handle responsive changes
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update navbar visibility
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled', 'visible');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    handleKeyDown(e) {
        // Handle keyboard navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Handle Escape key
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    handleFocusIn(e) {
        // Ensure focused elements are visible
        const focusedElement = e.target;
        if (focusedElement.classList.contains('nav-link')) {
            focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    closeAllModals() {
        // Close any open modals or dropdowns
        const activeModals = document.querySelectorAll('.modal.active, .dropdown.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API methods
    setLanguage(lang) {
        if (lang === 'ar' && this.currentLang === 'en') {
            this.toggleLanguage();
        } else if (lang === 'en' && this.currentLang === 'ar') {
            this.toggleLanguage();
        }
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    isRightToLeft() {
        return this.isRTL;
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
        
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.calculateMetrics();
        });

        // Monitor DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domContentLoaded = performance.now();
        });
    }

    calculateMetrics() {
        const perfData = performance.timing;
        this.metrics.loadTime = perfData.loadEventEnd - perfData.navigationStart;

        // Get paint metrics if available
        if (typeof PerformanceObserver !== 'undefined') {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                }
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }

        console.log('Performance Metrics:', this.metrics);
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.inzopayApp = new InzopayApp();
    window.performanceMonitor = new PerformanceMonitor();
});

// Add CSS for tooltip
const tooltipStyles = `
.tooltip {
    position: absolute;
    background: var(--bg-card);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 1000;
    white-space: nowrap;
}

.tooltip.visible {
    opacity: 1;
    transform: translateY(0);
}

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--bg-card);
}

/* Mobile menu styles */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 70px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 70px);
        background: var(--bg-primary);
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: var(--spacing-xl) 0;
        transition: left 0.3s ease;
        border-top: 1px solid var(--border-color);
    }
    
    .nav-menu.active {
        left: 0;
    }
    
    .nav-link {
        padding: var(--spacing-lg) 0;
        font-size: var(--text-lg);
        width: 100%;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
    }
    
    .nav-cta {
        margin-top: var(--spacing-lg);
        padding: var(--spacing-lg) var(--spacing-xl);
    }
}

/* Accessibility improvements */
.keyboard-navigation *:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

/* Reduced motion styles */
.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}
`;

// Inject tooltip styles
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

// Export for global access
window.InzopayApp = InzopayApp;
window.PerformanceMonitor = PerformanceMonitor;
