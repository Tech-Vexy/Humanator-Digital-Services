// Professional Digital Services Website JavaScript
// Enhanced functionality for better user experience

// Performance monitoring setup
const performanceMetrics = {
    startTime: performance.now(),
    initErrors: [],
    features: {
        mobile: false,
        animations: false,
        forms: false,
        accessibility: false,
        pageTransitions: false
    }
};

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize with comprehensive error handling
        initializeWebsiteFeatures();
    } catch (error) {
        console.error('Critical initialization error:', error);
        performanceMetrics.initErrors.push(error);
        // Fallback initialization
        initBasicFeatures();
    }
});

// Main initialization function with error boundaries
function initializeWebsiteFeatures() {
    const features = [
        { name: 'Page Transitions', fn: initPageTransitions, key: 'pageTransitions' },
        { name: 'Mobile Navigation', fn: initMobileNavigation, key: 'mobile' },
        { name: 'Navbar Effects', fn: initNavbarScrollEffects, key: 'navbar' },
        { name: 'Smooth Scrolling', fn: initSmoothScrolling, key: 'scrolling' },
        { name: 'Form Enhancements', fn: initFormEnhancements, key: 'forms' },
        { name: 'Loading Animations', fn: initLoadingAnimations, key: 'animations' },
        { name: 'Accessibility', fn: initAccessibilityFeatures, key: 'accessibility' },
        { name: 'Enhanced Features', fn: initEnhancedFeatures, key: 'enhanced' }
    ];

    features.forEach(feature => {
        try {
            feature.fn();
            performanceMetrics.features[feature.key] = true;
            console.log(`✓ ${feature.name} initialized successfully`);
        } catch (error) {
            console.error(`✗ ${feature.name} failed to initialize:`, error);
            performanceMetrics.initErrors.push({ feature: feature.name, error });
        }
    });

    // Initialize additional features
    try {
        updateCurrentYear();
        initCounterAnimations();
        initScrollReveal();
        initButtonEnhancements();
        initFormAnimations();
        initParallaxEffect();
        initPageLoader();
        initResponsiveAnimations();
    } catch (error) {
        console.error('Error during additional features initialization:', error);
        performanceMetrics.initErrors.push(error);
    }

    // Log performance metrics
    logPerformanceMetrics();
}

// Page Transitions initialization
function initPageTransitions() {
    // This function integrates with the page-transitions.js module
    // The actual PageTransitions class is loaded separately
    
    try {
        // Add transition classes to body for initial state
        document.body.classList.add('page-transition-ready');
        
        // Enhance navigation links with transition indicators
        const navLinks = document.querySelectorAll('nav a[href$=".html"]');
        navLinks.forEach(link => {
            link.classList.add('transition-enabled');
            
            // Add visual feedback for transition links
            link.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
            
            // Preload hover effect
            link.addEventListener('mouseover', function() {
                const href = this.getAttribute('href');
                if (href && href !== window.location.pathname) {
                    // Preload the target page
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = href;
                    
                    // Only add if not already present
                    if (!document.querySelector(`link[href="${href}"]`)) {
                        document.head.appendChild(prefetchLink);
                    }
                }
            });
        });
        
        // Add loading indicators to forms that might trigger page changes
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function() {
                // Add loading state during form submission
                this.classList.add('form-loading');
            });
        });
        
        // Optimize page transitions for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-duration', '0.2s');
            console.log('Page transitions optimized for reduced motion preference');
        }
        
        // Initialize intersection observer for lazy-loaded transition elements
        const transitionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe elements that should animate on scroll
        const animatedElements = document.querySelectorAll('.service-card, .feature, .info-item');
        animatedElements.forEach(el => {
            transitionObserver.observe(el);
        });
        
        console.log('Page transitions initialized successfully');
        
    } catch (error) {
        console.error('Page transitions initialization failed:', error);
        throw error;
    }
}

// Log performance metrics
function logPerformanceMetrics() {
    const endTime = performance.now();
    const duration = endTime - performanceMetrics.startTime;
    console.log(`Performance metrics:`, {
        duration,
        initErrors: performanceMetrics.initErrors,
        features: performanceMetrics.features
    });
}

// Mobile Navigation
// Mobile Navigation - Unified implementation
function initMobileNavigation() {
    // Handle legacy elements (for services.html and services_enhanced.html)
    const openbtn = document.getElementById("openbtn");
    const side = document.getElementById("side");
    const openbutton = document.getElementById("openbutton");
    
    // Handle modern elements (for index.html, about.html, contact.html)
    const menuToggle = document.querySelector('.menu-toggle, .mobile-nav-toggle');
    const sidenav = document.querySelector('.sidenav');
    let overlay = document.querySelector('.navbar-overlay');
    
    // Legacy mobile navigation (services.html and services_enhanced.html)
    if (openbtn && side && openbutton) {
        // Initialize mobile nav state
        side.style.right = "-250px";
        side.setAttribute('aria-hidden', 'true');
        
        // Mobile menu toggle
        openbtn.addEventListener('click', function() {
            const isOpen = side.style.right === "0px";
            
            if (isOpen) {
                closeLegacyMobileNav();
            } else {
                openLegacyMobileNav();
            }
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!side.contains(e.target) && !openbtn.contains(e.target)) {
                closeLegacyMobileNav();
            }
        });
        
        // Close mobile nav on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLegacyMobileNav();
            }
        });
        
        function openLegacyMobileNav() {
            side.style.right = "0";
            side.setAttribute('aria-hidden', 'false');
            openbtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLegacyMobileNav() {
            side.style.right = "-250px";
            side.setAttribute('aria-hidden', 'true');
            openbtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
    
    // Modern mobile navigation (index.html, about.html, contact.html)
    if (menuToggle && sidenav) {
        // Create overlay if it doesn't exist
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'navbar-overlay';
            document.body.appendChild(overlay);
        }
        
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            sidenav.classList.toggle('open');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidenav.classList.contains('open') ? 'hidden' : '';
        });
        
        overlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            sidenav.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking nav links
        const navLinks = sidenav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                sidenav.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                sidenav.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Navbar scroll effects
function initNavbarScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        // if (scrollTop > lastScrollTop && scrollTop > 100) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }
        
        lastScrollTop = scrollTop;
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form enhancements
function initFormEnhancements() {
    // Contact form
    const contactForm = document.querySelector('form[name="contactForm"]');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('form[name="newsletterForm"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Real-time validation
    document.querySelectorAll('input[required], textarea[required]').forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate subscription (replace with actual handling)
    setTimeout(() => {
        showNotification('Successfully subscribed to our newsletter!', 'success');
        form.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }, 1500);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(e);
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 0.5rem;';
    
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Loading animations
function initLoadingAnimations() {
    // Observe elements for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe service cards, features, etc.
    document.querySelectorAll('.service-card, .feature, .value-card, .team-member').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Accessibility improvements
function initAccessibilityFeatures() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Update current year
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Counter animations for statistics
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Scroll reveal animations
function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .slide-in-left, .slide-in-right, .fade-in-item');
    
    if (elements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0)';
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Set initial styles for animation elements
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'all 0.8s ease-out';
        
        if (element.classList.contains('fade-in-up') || element.classList.contains('fade-in-item')) {
            element.style.transform = 'translateY(30px)';
        } else if (element.classList.contains('fade-in-left') || element.classList.contains('slide-in-left')) {
            element.style.transform = 'translateX(-30px)';
        } else if (element.classList.contains('fade-in-right') || element.classList.contains('slide-in-right')) {
            element.style.transform = 'translateX(30px)';
        }
        
        observer.observe(element);
    });
}

// Enhanced Button Interactions
function initButtonEnhancements() {
    const animatedButtons = document.querySelectorAll('.btn-animated');
    
    animatedButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS if not already added
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .btn-animated {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced Form Animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add floating label effect
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const heroSection = document.querySelector('.services-hero');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    });
}

// Enhanced Animation and Interaction System
// Modern UI/UX improvements for Humanator Digital Services

// Page Loader with Progress
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <img src="images/logo/logo.png" alt="Loading..." class="loader-logo">
            <div class="loader-progress">
                <div class="loader-bar"></div>
            </div>
            <p style="margin-top: 1rem; font-size: 1.1rem;">Loading Amazing Experience...</p>
        </div>
    `;
    document.body.appendChild(loader);

    // Simulate loading progress
    setTimeout(() => {
        loader.classList.add('hide');
        setTimeout(() => {
            loader.remove();
            initPageAnimations();
        }, 600);
    }, 2000);
}

// Initialize page animations after loading
function initPageAnimations() {
    // Staggered entrance animations
    const elements = document.querySelectorAll('.service-card, .feature, .value-card');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('animate-fade-in-up');
    });

    // Initialize scroll progress indicator
    initScrollProgress();
    
    // Initialize enhanced interactions
    initEnhancedInteractions();
    
    // Initialize particle background
    initParticleBackground();
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Enhanced Interactions
function initEnhancedInteractions() {
    // Magnetic buttons
    const buttons = document.querySelectorAll('.btn, .btn-animated');
    buttons.forEach(btn => {
        btn.classList.add('btn-magnetic');
        
        btn.addEventListener('mouseenter', (e) => {
            btn.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', (e) => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            btn.style.transform = `translateY(-3px) rotateX(${deltaY * 10}deg) rotateY(${deltaX * 10}deg) scale(1.05)`;
        });
    });

    // Enhanced service cards
    const serviceCards = document.querySelectorAll('.service-category');
    serviceCards.forEach(card => {
        card.classList.add('service-card-enhanced');
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', () => {
            // Create a subtle hover feedback
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', (e) => {
            createRippleEffect(e, card);
        });
    });

    // Enhanced navigation items
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.classList.add('nav-item-enhanced');
    });

    // Icon morphing effects
    const icons = document.querySelectorAll('.fas, .fab');
    icons.forEach(icon => {
        if (!icon.closest('.no-morph')) {
            icon.classList.add('icon-morph');
        }
    });
}

// Create ripple effect on click
function createRippleEffect(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Particle Background Animation
function initParticleBackground() {
    const heroSection = document.querySelector('.services-hero');
    if (!heroSection) return;

    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-bg';
    heroSection.appendChild(particleContainer);

    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 25000);
}

// Enhanced Form Animations
function initEnhancedFormAnimations() {
    const formFields = document.querySelectorAll('.newsletter-form input, form input, form textarea');
    
    formFields.forEach(field => {
        const parent = field.parentElement;
        if (!parent.classList.contains('form-field-enhanced')) {
            parent.classList.add('form-field-enhanced');
        }
        
        field.addEventListener('focus', () => {
            parent.classList.add('focused');
        });
        
        field.addEventListener('blur', () => {
            if (!field.value.trim()) {
                parent.classList.remove('focused');
            }
        });
        
        // Add floating label if it doesn't exist
        if (!field.nextElementSibling || !field.nextElementSibling.tagName === 'LABEL') {
            const label = document.createElement('label');
            label.textContent = field.placeholder || 'Enter value';
            field.placeholder = '';
            field.after(label);
        }
    });
}

// Text Reveal Animation on Scroll
function initTextRevealAnimations() {
    const textElements = document.querySelectorAll('h1, h2, h3, .animate-text');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    textElements.forEach(el => observer.observe(el));
}

// Interactive Statistics Counter with Enhanced Effects
function initEnhancedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count], [data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count') || counter.textContent);
                
                animateCounterWithEasing(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounterWithEasing(element, target) {
    const duration = 2500;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
        
        element.textContent = currentValue;
        
        // Add visual feedback during counting
        element.style.transform = `scale(${1 + (Math.sin(progress * Math.PI * 4) * 0.05)})`;
        element.style.color = `hsl(${240 + progress * 60}, 70%, 50%)`;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            element.style.transform = 'scale(1)';
            element.style.color = '';
            element.classList.add('success-animation');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Advanced Scroll Animations
function initAdvancedScrollAnimations() {
    // Parallax effects for background elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Staggered list animations
    const lists = document.querySelectorAll('.service-list ul, .features-list');
    lists.forEach(list => {
        list.classList.add('staggered-list');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('li');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `staggerIn 0.6s ease forwards`;
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(list);
    });
}

// Performance optimized resize handler
let resizeTimer;
function initResponsiveAnimations() {
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate animations for new viewport
            const isMobile = window.innerWidth <= 768;
            document.body.classList.toggle('mobile-optimized', isMobile);
            
            if (isMobile) {
                // Disable heavy animations on mobile
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        }, 250);
    });
}

// Add ripple effect CSS
const rippleCSS = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

if (!document.querySelector('#ripple-animations')) {
    const style = document.createElement('style');
    style.id = 'ripple-animations';
    style.textContent = rippleCSS;
    document.head.appendChild(style);
}

// Initialize scroll animations for all pages
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => observer.observe(el));
}

// Initialize staggered list animations
function initStaggeredLists() {
    const staggeredLists = document.querySelectorAll('.staggered-list');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.3
    });
    
    staggeredLists.forEach(list => observer.observe(list));
}

// Enhanced navbar scroll effects
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update scroll progress
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        }
        
        lastScroll = currentScroll;
    });
}

// Initialize icon hover effects
function initIconEffects() {
    const icons = document.querySelectorAll('.icon-morph');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.15) rotate(8deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Initialize newsletter form enhancements
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    const input = newsletterForm.querySelector('input[type="email"]');
    const button = newsletterForm.querySelector('button');
    
    if (input) {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    }
    
    if (button) {
        button.addEventListener('mousedown', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.5);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

// Add scroll progress bar to page
function addScrollProgress() {
    if (!document.querySelector('.scroll-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
}

// Initialize all enhancements
function initPageEnhancements() {
    addScrollProgress();
    initScrollAnimations();
    initStaggeredLists();
    initNavbarEffects();
    initMobileNavigation();
    initIconEffects();
    initNewsletterForm();
}

// ===============================
// ENHANCED ERROR HANDLING & PERFORMANCE
// ===============================

// Fallback initialization for when main features fail
function initBasicFeatures() {
    console.log('Initializing basic features as fallback');
    
    // Basic mobile navigation without advanced features
    const menuToggle = document.querySelector('.menu-toggle, .mobile-nav-toggle');
    const sidenav = document.querySelector('.sidenav');
    
    if (menuToggle && sidenav) {
        menuToggle.addEventListener('click', () => {
            sidenav.classList.toggle('open');
        });
    }
    
    // Basic form functionality
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted! (Basic functionality)');
        });
    });
    
    // Basic year update
    const yearElements = document.querySelectorAll('#current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

// Enhanced error boundary for critical functions
function withErrorBoundary(fn, fallback = () => {}) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(`Function ${fn.name} failed:`, error);
            return fallback.apply(this, args);
        }
    };
}

// Performance monitoring utilities
function measurePerformance(name, fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const end = performance.now();
        console.log(`Performance: ${name} took ${end - start}ms`);
        return result;
    };
}

// Enhanced lazy loading implementation
function initEnhancedLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('lazy-image');
            imageObserver.observe(img);
        });
    }
}

// Network-aware feature loading
function initNetworkAwareFeatures() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
            // Disable heavy animations
            document.body.classList.add('reduced-motion');
        }
        
        if (connection.saveData) {
            document.body.classList.add('save-data');
            // Remove background images and videos
            const mediaElements = document.querySelectorAll('[style*="background-image"], video');
            mediaElements.forEach(el => el.style.display = 'none');
        }
    }
}

// Battery-aware optimizations
function initBatteryOptimizations() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            function updateBatteryStatus() {
                if (battery.level < 0.2 && !battery.charging) {
                    document.body.classList.add('battery-low');
                } else {
                    document.body.classList.remove('battery-low');
                }
            }
            
            updateBatteryStatus();
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    }
}

// Service Worker update notification
function initServiceWorkerUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            showUpdateNotification();
        });
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'sw-update-available';
    notification.innerHTML = `
        <p>A new version is available!</p>
        <button onclick="window.location.reload()" class="retry-button">
            Update Now
        </button>
        <button onclick="this.parentElement.remove()" style="margin-left: 0.5rem;">
            Later
        </button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

// Enhanced error reporting
function initErrorReporting() {
    window.addEventListener('error', (event) => {
        const errorInfo = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error?.stack,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        console.error('Global error caught:', errorInfo);
        
        // Could send to error reporting service
        // sendErrorReport(errorInfo);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
}

// Memory leak prevention
function initMemoryLeakPrevention() {
    // Track event listeners for cleanup
    const eventListeners = new WeakMap();
    
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (!eventListeners.has(this)) {
            eventListeners.set(this, []);
        }
        eventListeners.get(this).push({ type, listener, options });
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        // Clear any remaining timers
        for (let i = 1; i < 99999; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
    });
}

// Enhanced accessibility features
function initEnhancedAccessibility() {
    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
    
    // Focus management for modals
    const modals = document.querySelectorAll('.modal, .sidenav');
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    });
}

// Performance budget monitoring
function initPerformanceBudget() {
    if ('PerformanceObserver' in window) {
        // Monitor largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.startTime > 2500) {
                    console.warn('LCP is too slow:', entry.startTime);
                }
            }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Monitor cumulative layout shift
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.value > 0.1) {
                    console.warn('CLS is too high:', entry.value);
                }
            }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
}

// Initialize all performance and reliability features
function initPerformanceFeatures() {
    initEnhancedLazyLoading();
    initNetworkAwareFeatures();
    initBatteryOptimizations();
    initServiceWorkerUpdates();
    initErrorReporting();
    initMemoryLeakPrevention();
    initEnhancedAccessibility();
    initPerformanceBudget();
    
    console.log('Performance features initialized');
}

// Add performance features to main initialization
document.addEventListener('DOMContentLoaded', function() {
    // ...existing initialization code...
    
    // Initialize performance features
    try {
        initPerformanceFeatures();
        console.log('✓ Performance features initialized');
    } catch (error) {
        console.error('✗ Performance features failed:', error);
    }
});