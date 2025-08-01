// Scroll Animation Controller
class ScrollAnimations {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            console.log('Reduced motion detected, skipping scroll animations');
            return;
        }

        this.setupIntersectionObserver();
        this.observeElements();
        this.setupScrollEffects();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
        };

        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const elementId = element.dataset.animationId || this.generateId();
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    this.triggerAnimation(element, elementId);
                }
            });
        }, options);

        // Observer for navbar background
        this.navbarObserver = new IntersectionObserver((entries) => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        }, { threshold: 0 });
    }

    observeElements() {
        // Observe elements for animations
        const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .bounce-in, .slide-in-bottom');
        
        animateElements.forEach((element, index) => {
            const animationId = `anim-${index}`;
            element.dataset.animationId = animationId;
            
            // Add initial hidden state
            if (!element.classList.contains('in-view')) {
                element.style.opacity = '0';
                element.style.transform = this.getInitialTransform(element);
            }
            
            this.mainObserver.observe(element);
        });

        // Observe hero section for navbar
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            this.navbarObserver.observe(heroSection);
        }
    }

    getInitialTransform(element) {
        if (element.classList.contains('fade-in-up')) {
            return 'translateY(30px)';
        } else if (element.classList.contains('fade-in-left')) {
            return 'translateX(-30px)';
        } else if (element.classList.contains('fade-in-right')) {
            return 'translateX(30px)';
        } else if (element.classList.contains('bounce-in') || element.classList.contains('slide-in-bottom')) {
            return 'translateY(50px) scale(0.9)';
        }
        return 'translateY(30px)';
    }

    triggerAnimation(element, elementId) {
        if (this.animatedElements.has(elementId)) {
            return; // Already animated
        }

        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
            element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            element.classList.add('in-view');
            this.animatedElements.add(elementId);
            
            // Add completion callback
            element.addEventListener('transitionend', () => {
                element.style.transition = '';
            }, { once: true });
            
        }, delay);
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax effect for glow orbs
            this.updateParallaxElements(scrollY);
            
            // Update progress indicators if any
            this.updateScrollProgress(scrollY);
            
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    updateParallaxElements(scrollY) {
        const glowOrbs = document.querySelectorAll('.glow-orb');
        
        glowOrbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrollY * speed;
            
            orb.style.transform = `translateY(${yPos}px)`;
        });

        // Parallax for grid overlay
        const gridOverlay = document.querySelector('.grid-overlay');
        if (gridOverlay) {
            const yPos = scrollY * 0.05;
            gridOverlay.style.transform = `translateY(${yPos}px)`;
        }
    }

    updateScrollProgress(scrollY) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollY / docHeight;
        
        // Update any progress bars if they exist
        const progressBars = document.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            bar.style.width = `${progress * 100}%`;
        });
    }

    generateId() {
        return `anim-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Public method to trigger animations manually
    animateElement(element, animationType = 'fadeInUp') {
        if (this.isReducedMotion) return;
        
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(element);
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
            element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    // Clean up method
    destroy() {
        if (this.mainObserver) {
            this.mainObserver.disconnect();
        }
        if (this.navbarObserver) {
            this.navbarObserver.disconnect();
        }
        
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// Stagger Animation Utility
class StaggerAnimations {
    static animateChildren(container, options = {}) {
        const {
            delay = 100,
            duration = 800,
            stagger = 100,
            easing = 'cubic-bezier(0.16, 1, 0.3, 1)'
        } = options;

        const children = container.children;
        
        Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                child.style.transition = `all ${duration}ms ${easing}`;
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, delay + (index * stagger));
        });
    }
}

// Counter Animation Utility
class CounterAnimations {
    static animateNumber(element, options = {}) {
        const {
            start = 0,
            duration = 2000,
            easing = 'easeOutCubic'
        } = options;

        const end = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const startTime = performance.now();
        
        const easingFunctions = {
            easeOutCubic: t => 1 - Math.pow(1 - t, 3),
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        };
        
        const easingFunction = easingFunctions[easing] || easingFunctions.easeOutCubic;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunction(progress);
            
            const current = Math.floor(start + (end - start) * easedProgress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
    
    // Animate counters when they come into view
    const numberElements = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                CounterAnimations.animateNumber(entry.target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    numberElements.forEach(el => counterObserver.observe(el));
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Export for use in other modules
window.ScrollAnimations = ScrollAnimations;
window.StaggerAnimations = StaggerAnimations;
window.CounterAnimations = CounterAnimations;
