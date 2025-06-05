// Comprehensive Website Monitoring and Analytics System
// For Humanator Digital Services - Enhanced Performance and User Experience Tracking

class WebsiteMonitor {
    constructor() {
        this.metrics = {
            performance: {},
            userInteractions: {},
            errors: [],
            accessibility: {},
            security: {},
            seo: {},
            conversion: {}
        };
        
        this.startTime = performance.now();
        this.init();
    }
    
    init() {
        this.initPerformanceMonitoring();
        this.initUserInteractionTracking();
        this.initErrorTracking();
        this.initAccessibilityMonitoring();
        this.initSecurityMonitoring();
        this.initSEOAnalytics();
        this.initConversionTracking();
        this.initRealTimeReporting();
        
        console.log('🚀 Website monitoring system initialized');
    }
    
    // Performance Monitoring
    initPerformanceMonitoring() {
        // Core Web Vitals
        this.observeWebVitals();
        
        // Resource timing
        this.trackResourceTiming();
        
        // Page load metrics
        this.trackPageLoadMetrics();
        
        // Memory usage
        this.trackMemoryUsage();
    }
    
    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.performance.lcp = entry.startTime;
                    
                    if (entry.startTime > 2500) {
                        this.reportIssue('performance', 'LCP too slow', {
                            value: entry.startTime,
                            threshold: 2500,
                            severity: 'warning'
                        });
                    }
                }
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.performance.fid = entry.processingStart - entry.startTime;
                    
                    if (entry.processingStart - entry.startTime > 100) {
                        this.reportIssue('performance', 'FID too slow', {
                            value: entry.processingStart - entry.startTime,
                            threshold: 100,
                            severity: 'warning'
                        });
                    }
                }
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.metrics.performance.cls = clsValue;
                
                if (clsValue > 0.1) {
                    this.reportIssue('performance', 'CLS too high', {
                        value: clsValue,
                        threshold: 0.1,
                        severity: 'error'
                    });
                }
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    trackResourceTiming() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            this.metrics.performance.slowResources = slowResources.map(resource => ({
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize
            }));
            
            if (slowResources.length > 0) {
                this.reportIssue('performance', 'Slow resources detected', {
                    count: slowResources.length,
                    resources: slowResources.slice(0, 5) // Top 5 slowest
                });
            }
        });
    }
    
    trackPageLoadMetrics() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.performance.pageLoad = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                connect: navigation.connectEnd - navigation.connectStart,
                ttfb: navigation.responseStart - navigation.requestStart,
                download: navigation.responseEnd - navigation.responseStart,
                domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                loadComplete: navigation.loadEventEnd - navigation.navigationStart
            };
            
            // Alert if page load is too slow
            if (this.metrics.performance.pageLoad.loadComplete > 3000) {
                this.reportIssue('performance', 'Page load too slow', {
                    loadTime: this.metrics.performance.pageLoad.loadComplete,
                    threshold: 3000
                });
            }
        });
    }
    
    trackMemoryUsage() {
        if ('memory' in performance) {
            const checkMemory = () => {
                const memory = performance.memory;
                this.metrics.performance.memory = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
                };
                
                // Alert if memory usage is high
                if (this.metrics.performance.memory.usage > 80) {
                    this.reportIssue('performance', 'High memory usage', {
                        usage: this.metrics.performance.memory.usage,
                        threshold: 80
                    });
                }
            };
            
            checkMemory();
            setInterval(checkMemory, 30000); // Check every 30 seconds
        }
    }
    
    // User Interaction Tracking
    initUserInteractionTracking() {
        this.trackClicks();
        this.trackScrollBehavior();
        this.trackFormInteractions();
        this.trackHoverPatterns();
        this.trackDeviceInfo();
    }
    
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, [data-track]');
            if (target) {
                const clickData = {
                    element: target.tagName.toLowerCase(),
                    text: target.textContent?.trim().substring(0, 50),
                    href: target.href || null,
                    timestamp: Date.now(),
                    coordinates: { x: e.clientX, y: e.clientY }
                };
                
                this.metrics.userInteractions.clicks = this.metrics.userInteractions.clicks || [];
                this.metrics.userInteractions.clicks.push(clickData);
                
                // Track popular elements
                this.updatePopularElements(clickData);
            }
        });
    }
    
    trackScrollBehavior() {
        let scrollDepth = 0;
        let maxScroll = 0;
        
        const trackScroll = this.throttle(() => {
            const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (currentScroll > maxScroll) {
                maxScroll = currentScroll;
                this.metrics.userInteractions.maxScrollDepth = maxScroll;
            }
            
            // Track scroll milestones
            const milestones = [25, 50, 75, 100];
            milestones.forEach(milestone => {
                if (currentScroll >= milestone && scrollDepth < milestone) {
                    scrollDepth = milestone;
                    this.trackEvent('scroll_milestone', { depth: milestone });
                }
            });
        }, 250);
        
        window.addEventListener('scroll', trackScroll);
    }
    
    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Track form starts
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.trackEvent('form_start', {
                        form: form.name || form.id || 'unnamed',
                        field: e.target.name || e.target.id
                    });
                }
            }, { once: true });
            
            // Track form submissions
            form.addEventListener('submit', (e) => {
                this.trackEvent('form_submit', {
                    form: form.name || form.id || 'unnamed',
                    success: !e.defaultPrevented
                });
            });
            
            // Track form abandonment
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.value.trim()) {
                        this.trackEvent('form_field_filled', {
                            form: form.name || form.id || 'unnamed',
                            field: input.name || input.id
                        });
                    }
                });
            });
        });
    }
    
    trackHoverPatterns() {
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .feature');
        
        interactiveElements.forEach(element => {
            let hoverStart;
            
            element.addEventListener('mouseenter', () => {
                hoverStart = Date.now();
            });
            
            element.addEventListener('mouseleave', () => {
                if (hoverStart) {
                    const hoverDuration = Date.now() - hoverStart;
                    
                    if (hoverDuration > 1000) { // Hover for more than 1 second
                        this.trackEvent('significant_hover', {
                            element: element.tagName.toLowerCase(),
                            duration: hoverDuration,
                            text: element.textContent?.trim().substring(0, 30)
                        });
                    }
                }
            });
        });
    }
    
    trackDeviceInfo() {
        this.metrics.userInteractions.device = {
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                saveData: navigator.connection.saveData
            } : null,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
    }
    
    // Error Tracking
    initErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (e) => {
            this.reportError('javascript', e.error || e.message, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.reportError('promise', e.reason, {
                type: 'unhandled_rejection'
            });
        });
        
        // Resource loading errors
        document.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.reportError('resource', `Failed to load: ${e.target.src || e.target.href}`, {
                    element: e.target.tagName,
                    src: e.target.src || e.target.href
                });
            }
        }, true);
    }
    
    reportError(type, message, details = {}) {
        const error = {
            type,
            message: message?.toString() || 'Unknown error',
            details,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.metrics.errors.push(error);
        
        console.error(`[${type.toUpperCase()}] ${message}`, details);
        
        // Send critical errors immediately
        if (type === 'javascript' || type === 'resource') {
            this.sendErrorReport(error);
        }
    }
    
    // Accessibility Monitoring
    initAccessibilityMonitoring() {
        this.checkColorContrast();
        this.checkKeyboardNavigation();
        this.checkAltTexts();
        this.checkHeadingStructure();
        this.checkFormLabels();
    }
    
    checkColorContrast() {
        // Simple contrast check for key elements
        const criticalElements = document.querySelectorAll('button, .btn, a, h1, h2, h3');
        let contrastIssues = 0;
        
        criticalElements.forEach(element => {
            const style = getComputedStyle(element);
            const bgColor = style.backgroundColor;
            const textColor = style.color;
            
            // This is a simplified check - in production, use a proper contrast calculator
            if (bgColor === textColor) {
                contrastIssues++;
                this.reportIssue('accessibility', 'Potential contrast issue', {
                    element: element.tagName,
                    text: element.textContent?.substring(0, 30)
                });
            }
        });
        
        this.metrics.accessibility.contrastIssues = contrastIssues;
    }
    
    checkAltTexts() {
        const images = document.querySelectorAll('img');
        const missingAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
        
        this.metrics.accessibility.missingAltTexts = missingAlt.length;
        
        if (missingAlt.length > 0) {
            this.reportIssue('accessibility', 'Images missing alt text', {
                count: missingAlt.length,
                images: missingAlt.slice(0, 5).map(img => img.src)
            });
        }
    }
    
    checkFormLabels() {
        const inputs = document.querySelectorAll('input, textarea, select');
        const unlabeledInputs = Array.from(inputs).filter(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            
            return !label && !ariaLabel && !ariaLabelledBy && input.type !== 'hidden';
        });
        
        this.metrics.accessibility.unlabeledInputs = unlabeledInputs.length;
        
        if (unlabeledInputs.length > 0) {
            this.reportIssue('accessibility', 'Form inputs missing labels', {
                count: unlabeledInputs.length
            });
        }
    }
    
    // Security Monitoring
    initSecurityMonitoring() {
        this.checkMixedContent();
        this.checkExternalLinks();
        this.monitorConsoleUsage();
        this.checkCSPViolations();
    }
    
    checkMixedContent() {
        if (location.protocol === 'https:') {
            const httpResources = Array.from(document.querySelectorAll('img, script, link')).filter(element => {
                const src = element.src || element.href;
                return src && src.startsWith('http://');
            });
            
            if (httpResources.length > 0) {
                this.reportIssue('security', 'Mixed content detected', {
                    count: httpResources.length,
                    resources: httpResources.slice(0, 5).map(el => el.src || el.href)
                });
            }
        }
    }
    
    checkExternalLinks() {
        const externalLinks = Array.from(document.querySelectorAll('a[href^="http"]')).filter(link => {
            return !link.href.includes(location.hostname);
        });
        
        const unsafeLinks = externalLinks.filter(link => {
            return !link.hasAttribute('rel') || !link.rel.includes('noopener');
        });
        
        if (unsafeLinks.length > 0) {
            this.reportIssue('security', 'Unsafe external links', {
                count: unsafeLinks.length,
                suggestion: 'Add rel="noopener noreferrer" to external links'
            });
        }
    }
    
    // Real-time Reporting
    initRealTimeReporting() {
        // Send metrics every 30 seconds
        setInterval(() => {
            this.generateReport();
        }, 30000);
        
        // Send final report on page unload
        window.addEventListener('beforeunload', () => {
            this.generateFinalReport();
        });
    }
    
    generateReport() {
        const report = {
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.startTime,
            metrics: this.metrics,
            summary: this.generateSummary()
        };
        
        console.log('📊 Website Performance Report:', report);
        
        // In production, send to analytics service
        // this.sendToAnalytics(report);
        
        return report;
    }
    
    generateSummary() {
        return {
            performance: {
                grade: this.calculatePerformanceGrade(),
                issues: this.metrics.errors.filter(e => e.type === 'performance').length
            },
            accessibility: {
                score: this.calculateAccessibilityScore(),
                issues: this.metrics.accessibility.contrastIssues + 
                       this.metrics.accessibility.missingAltTexts + 
                       this.metrics.accessibility.unlabeledInputs
            },
            userEngagement: {
                scrollDepth: this.metrics.userInteractions.maxScrollDepth || 0,
                interactions: (this.metrics.userInteractions.clicks?.length || 0)
            },
            errors: {
                total: this.metrics.errors.length,
                critical: this.metrics.errors.filter(e => e.type === 'javascript').length
            }
        };
    }
    
    calculatePerformanceGrade() {
        const lcp = this.metrics.performance.lcp || 0;
        const fid = this.metrics.performance.fid || 0;
        const cls = this.metrics.performance.cls || 0;
        
        let score = 100;
        
        if (lcp > 2500) score -= 30;
        else if (lcp > 1200) score -= 15;
        
        if (fid > 100) score -= 30;
        else if (fid > 50) score -= 15;
        
        if (cls > 0.25) score -= 30;
        else if (cls > 0.1) score -= 15;
        
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }
    
    calculateAccessibilityScore() {
        const totalIssues = this.metrics.accessibility.contrastIssues + 
                           this.metrics.accessibility.missingAltTexts + 
                           this.metrics.accessibility.unlabeledInputs;
        
        return Math.max(0, 100 - (totalIssues * 10));
    }
    
    // Utility methods
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        this.metrics.userInteractions.events = this.metrics.userInteractions.events || [];
        this.metrics.userInteractions.events.push(event);
    }
    
    reportIssue(category, message, details = {}) {
        const issue = {
            category,
            message,
            details,
            timestamp: Date.now(),
            severity: details.severity || 'info'
        };
        
        this.metrics[category] = this.metrics[category] || {};
        this.metrics[category].issues = this.metrics[category].issues || [];
        this.metrics[category].issues.push(issue);
        
        if (details.severity === 'error') {
            console.error(`[${category.toUpperCase()}] ${message}`, details);
        } else if (details.severity === 'warning') {
            console.warn(`[${category.toUpperCase()}] ${message}`, details);
        }
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
    
    updatePopularElements(clickData) {
        this.metrics.userInteractions.popularElements = this.metrics.userInteractions.popularElements || {};
        const key = `${clickData.element}-${clickData.text}`;
        this.metrics.userInteractions.popularElements[key] = 
            (this.metrics.userInteractions.popularElements[key] || 0) + 1;
    }
    
    sendErrorReport(error) {
        // In production, send to error reporting service
        console.log('📤 Sending error report:', error);
    }
    
    generateFinalReport() {
        const finalReport = this.generateReport();
        finalReport.sessionComplete = true;
        
        // Use sendBeacon for reliable delivery
        if (navigator.sendBeacon) {
            const data = JSON.stringify(finalReport);
            navigator.sendBeacon('/analytics', data);
        }
        
        return finalReport;
    }
}

// Initialize monitoring system
const websiteMonitor = new WebsiteMonitor();

// Export for global access
window.HumanatorMonitor = websiteMonitor;
