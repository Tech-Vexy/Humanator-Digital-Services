// PWA Enhanced Features for Humanator Digital Services
// Handles IARC rating display, related applications, and window control overlays

class PWAEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupWindowControlOverlays();
        this.displayIARCRating();
        this.setupRelatedAppsPromotion();
        this.handleAppInstallPrompt();
        this.setupProtocolHandlers();
    }

    // Setup Window Control Overlays
    setupWindowControlOverlays() {
        if ('windowControlsOverlay' in navigator) {
            const overlay = navigator.windowControlsOverlay;
            
            if (overlay.visible) {
                this.adjustLayoutForOverlay();
            }

            // Listen for overlay changes
            overlay.addEventListener('geometrychange', (event) => {
                this.handleOverlayChange(event);
            });
        }
    }

    adjustLayoutForOverlay() {
        document.documentElement.style.setProperty('--window-controls-overlay', '1');
        
        // Adjust navbar for window controls
        const navbar = document.querySelector('.navbar');
        if (navbar && navigator.windowControlsOverlay) {
            const { x, width } = navigator.windowControlsOverlay.getTitlebarAreaRect();
            navbar.style.paddingLeft = `${x}px`;
            navbar.style.paddingRight = `${width}px`;
        }
    }

    handleOverlayChange(event) {
        const { x, y, width, height } = event.titlebarAreaRect;
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--titlebar-area-x', `${x}px`);
        document.documentElement.style.setProperty('--titlebar-area-y', `${y}px`);
        document.documentElement.style.setProperty('--titlebar-area-width', `${width}px`);
        document.documentElement.style.setProperty('--titlebar-area-height', `${height}px`);
        
        console.log('Window Controls Overlay geometry changed:', { x, y, width, height });
    }

    // Display IARC Rating Information
    displayIARCRating() {
        // Create IARC rating display
        const ratingElement = document.createElement('div');
        ratingElement.className = 'iarc-rating';
        ratingElement.innerHTML = `
            <i class="fas fa-shield-alt"></i>
            <span>IARC Rated: General Audiences</span>
        `;
        
        document.body.appendChild(ratingElement);

        // Show rating briefly on page load
        setTimeout(() => {
            ratingElement.classList.add('show');
        }, 2000);

        // Hide after 5 seconds
        setTimeout(() => {
            ratingElement.classList.remove('show');
        }, 7000);

        // Show on settings/about page permanently
        if (window.location.pathname.includes('about.html')) {
            ratingElement.classList.add('show');
            ratingElement.style.position = 'static';
            ratingElement.style.display = 'inline-block';
            ratingElement.style.margin = '1rem 0';
            
            const aboutSection = document.querySelector('.about-content, .main');
            if (aboutSection) {
                aboutSection.appendChild(ratingElement);
            }
        }
    }

    // Setup Related Applications Promotion
    setupRelatedAppsPromotion() {
        // Check if we should promote related apps
        if (!this.shouldPromoteApps()) return;

        const promotionHTML = `
            <div class="app-promotion">
                <h3><i class="fas fa-mobile-alt"></i> Get Our App</h3>
                <p>Experience Humanator Digital Services on all your devices</p>
                <div class="app-links">
                    <a href="https://play.google.com/store/apps/details?id=com.humanator.digitalservices" 
                       class="app-link" target="_blank" rel="noopener">
                        <i class="fab fa-google-play"></i>
                        <span>Google Play</span>
                    </a>
                    <a href="ms-windows-store://pdp/?productid=9NBLGGH5L9XT" 
                       class="app-link">
                        <i class="fab fa-microsoft"></i>
                        <span>Microsoft Store</span>
                    </a>
                    <a href="#" class="app-link" onclick="window.pwaEnhancements.installPWA()">
                        <i class="fas fa-download"></i>
                        <span>Install Web App</span>
                    </a>
                </div>
            </div>
        `;

        // Add to main content area
        const mainContent = document.querySelector('.main, .services-preview, main');
        if (mainContent) {
            const promotionDiv = document.createElement('div');
            promotionDiv.innerHTML = promotionHTML;
            mainContent.appendChild(promotionDiv.firstElementChild);
        }
    }

    shouldPromoteApps() {
        // Don't show if already installed as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return false;
        }

        // Show on homepage and services page
        const currentPage = window.location.pathname;
        return currentPage.includes('index.html') || 
               currentPage.includes('services.html') || 
               currentPage === '/' || 
               currentPage === '';
    }

    // Handle App Install Prompt
    handleAppInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton(deferredPrompt);
        });

        // Handle successful installation
        window.addEventListener('appinstalled', (evt) => {
            console.log('PWA was installed successfully');
            this.hideInstallButton();
            this.trackInstallation();
        });
    }

    showInstallButton(deferredPrompt) {
        const installButton = document.createElement('button');
        installButton.className = 'install-pwa-btn';
        installButton.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Install App</span>
        `;
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                installButton.remove();
            }
        });

        installButton.addEventListener('mouseenter', () => {
            installButton.style.transform = 'translateY(-2px)';
            installButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        installButton.addEventListener('mouseleave', () => {
            installButton.style.transform = 'translateY(0)';
            installButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        document.body.appendChild(installButton);
    }

    hideInstallButton() {
        const installButton = document.querySelector('.install-pwa-btn');
        if (installButton) {
            installButton.remove();
        }
    }

    installPWA() {
        // Try to trigger install if available
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
        } else {
            // Show manual installation instructions
            this.showInstallInstructions();
        }
    }

    showInstallInstructions() {
        const instructionsHTML = `
            <div class="install-instructions-modal">
                <div class="modal-content">
                    <h3>Install Humanator Digital Services</h3>
                    <div class="install-steps">
                        <div class="step">
                            <i class="fas fa-mobile-alt"></i>
                            <p><strong>Mobile:</strong> Tap the share button and select "Add to Home Screen"</p>
                        </div>
                        <div class="step">
                            <i class="fas fa-desktop"></i>
                            <p><strong>Desktop:</strong> Click the install icon in your browser's address bar</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.install-instructions-modal').remove()">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.innerHTML = instructionsHTML;
        modal.querySelector('.install-instructions-modal').style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        document.body.appendChild(modal.firstElementChild);
    }

    // Setup Protocol Handlers
    setupProtocolHandlers() {
        // Handle custom protocol links
        if ('registerProtocolHandler' in navigator) {
            try {
                navigator.registerProtocolHandler(
                    'web+humanator',
                    '/services.html?service=%s',
                    'Humanator Digital Services'
                );
            } catch (error) {
                console.log('Protocol handler registration not supported:', error);
            }
        }

        // Handle protocol parameters in URL
        this.handleProtocolParameters();
    }

    handleProtocolParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        
        if (service) {
            // Scroll to specific service section
            const serviceElement = document.querySelector(`[data-service="${service}"], #${service}`);
            if (serviceElement) {
                serviceElement.scrollIntoView({ behavior: 'smooth' });
                serviceElement.classList.add('highlight-service');
            }
        }
    }

    trackInstallation() {
        // Track PWA installation for analytics
        if (window.gtag) {
            gtag('event', 'pwa_install', {
                'method': 'browser_prompt'
            });
        }

        // Store installation timestamp
        localStorage.setItem('pwa_installed', Date.now());
    }

    // Check PWA features support
    checkPWASupport() {
        const features = {
            serviceWorker: 'serviceWorker' in navigator,
            manifest: 'manifest' in document.createElement('link'),
            windowControlsOverlay: 'windowControlsOverlay' in navigator,
            beforeInstallPrompt: 'onbeforeinstallprompt' in window,
            protocolHandler: 'registerProtocolHandler' in navigator
        };

        console.log('PWA Features Support:', features);
        return features;
    }
}

// Initialize PWA enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.pwaEnhancements = new PWAEnhancements();
    
    // Log PWA support
    window.pwaEnhancements.checkPWASupport();
});

// Export for global access
window.PWAEnhancements = PWAEnhancements;
