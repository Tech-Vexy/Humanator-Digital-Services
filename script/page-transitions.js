// Page Transitions Module for Humanator Digital Services
// Handles smooth animated transitions between pages

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 600; // milliseconds
        this.overlay = null;
        this.currentPage = this.getCurrentPage();
        this.transitionTypes = {
            'index.html': 'fade-scale',
            'about.html': 'slide-right',
            'services.html': 'slide-left',
            'contact.html': 'slide-right',
            'services_enhanced.html': 'slide-left'
        };
        
        this.init();
    }
    
    init() {
        this.createTransitionOverlay();
        this.attachEventListeners();
        this.initializePage();
        this.handleInitialPageLoad();
    }
    
    // Create the transition overlay element
    createTransitionOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        this.overlay.innerHTML = `
            <div class="loader" aria-label="Loading page"></div>
        `;
        document.body.appendChild(this.overlay);
    }
    
    // Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page === '' ? 'index.html' : page;
    }
    
    // Get transition type for a page
    getTransitionType(page) {
        return this.transitionTypes[page] || 'fade-scale';
    }
    
    // Attach event listeners to navigation links
    attachEventListeners() {
        // Listen for all internal navigation links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Check if it's an internal link
            if (this.isInternalLink(href) && !this.isCurrentPage(href)) {
                e.preventDefault();
                this.navigateToPage(href);
            }
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = this.getCurrentPage();
            this.handlePageChange(page, false);
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshPageAnimation();
            }
        });
    }
    
    // Check if link is internal
    isInternalLink(href) {
        if (!href) return false;
        
        // Check for external links
        if (href.startsWith('http') || href.startsWith('//')) {
            return false;
        }
        
        // Check for anchors, mailto, tel, etc.
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }
        
        // Check for valid HTML pages
        return href.endsWith('.html') || href === '/' || href === './';
    }
    
    // Check if it's the current page
    isCurrentPage(href) {
        const currentPath = window.location.pathname;
        const targetPath = href.startsWith('/') ? href : '/' + href;
        return currentPath === targetPath || 
               (currentPath === '/' && (href === 'index.html' || href === './'));
    }
    
    // Navigate to a new page with transition
    async navigateToPage(href) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // Show transition overlay
            await this.showTransition();
            
            // Update URL and navigate
            const fullUrl = this.resolveUrl(href);
            window.location.href = fullUrl;
            
        } catch (error) {
            console.error('Page transition error:', error);
            this.isTransitioning = false;
            this.hideTransition();
        }
    }
    
    // Resolve relative URLs
    resolveUrl(href) {
        if (href.startsWith('/')) return href;
        if (href === './') return './index.html';
        return href;
    }
    
    // Show transition overlay
    showTransition() {
        return new Promise((resolve) => {
            this.overlay.classList.add('active');
            setTimeout(resolve, 100); // Quick overlay appearance
        });
    }
    
    // Hide transition overlay
    hideTransition() {
        return new Promise((resolve) => {
            this.overlay.classList.remove('active');
            setTimeout(resolve, 300);
        });
    }
    
    // Initialize page with entrance animation
    initializePage() {
        const body = document.body;
        const page = this.getCurrentPage();
        const transitionType = this.getTransitionType(page);
        
        // Add initial page class
        body.classList.add('page-loading');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.animatePageEntrance(transitionType);
            });
        } else {
            this.animatePageEntrance(transitionType);
        }
    }
    
    // Handle initial page load
    handleInitialPageLoad() {
        // Hide any existing transition overlay
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.classList.remove('active');
            }
        }, 100);
        
        // Animate navbar
        this.animateNavbar();
        
        // Animate content sections
        this.animateContentSections();
    }
    
    // Animate page entrance
    animatePageEntrance(transitionType) {
        const body = document.body;
        
        // Remove loading state
        body.classList.remove('page-loading');
        body.classList.add('page-loaded');
        
        // Add entrance animation
        body.classList.add(`page-${transitionType}`);
        
        // Stagger content animations
        this.staggerContentAnimation();
        
        setTimeout(() => {
            body.classList.remove(`page-${transitionType}`);
        }, this.transitionDuration);
    }
    
    // Animate navbar entrance
    animateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('navbar-transition');
            setTimeout(() => {
                navbar.classList.add('visible');
            }, 100);
        }
    }
    
    // Animate content sections with stagger effect
    animateContentSections() {
        const sections = document.querySelectorAll('section, .main, .services-preview, .why-choose-us, .location-hours');
        
        sections.forEach((section, index) => {
            section.classList.add('content-reveal');
            setTimeout(() => {
                section.classList.add('revealed');
            }, 200 + (index * 100));
        });
    }
    
    // Stagger animation for multiple elements
    staggerContentAnimation() {
        const staggerElements = document.querySelectorAll('.service-card, .feature, .info-item, .testimonial-card');
        
        staggerElements.forEach((element, index) => {
            element.classList.add('stagger-item');
            setTimeout(() => {
                element.classList.add('animate');
            }, 300 + (index * 100));
        });
    }
    
    // Refresh page animations
    refreshPageAnimation() {
        // Re-trigger animations for elements that might have been hidden
        const hiddenElements = document.querySelectorAll('.content-reveal:not(.revealed)');
        hiddenElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('revealed');
            }, index * 100);
        });
    }
    
    // Handle page change (for back/forward navigation)
    handlePageChange(newPage, addToHistory = true) {
        if (this.isTransitioning) return;
        
        this.currentPage = newPage;
        
        if (addToHistory) {
            history.pushState({ page: newPage }, '', newPage);
        }
        
        this.initializePage();
    }
    
    // Preload next likely pages
    preloadPages() {
        const preloadPages = ['index.html', 'services.html', 'about.html', 'contact.html'];
        
        preloadPages.forEach(page => {
            if (page !== this.currentPage) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            }
        });
    }
    
    // Performance monitoring
    logTransitionPerformance(startTime, endTime, page) {
        const duration = endTime - startTime;
        console.log(`Page transition to ${page}: ${duration}ms`);
        
        // Report to analytics if available
        if (window.gtag) {
            gtag('event', 'page_transition', {
                'transition_duration': duration,
                'target_page': page
            });
        }
    }
}

// Initialize page transitions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page transitions
    window.pageTransitions = new PageTransitions();
    
    // Preload critical pages after initial load
    setTimeout(() => {
        window.pageTransitions.preloadPages();
    }, 2000);
});

// Export for global access
window.PageTransitions = PageTransitions;
