// Service Worker Registration Script
// This script handles the registration of the service worker for the PWA functionality

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register the service worker
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(function(error) {
                console.error('Service Worker registration failed:', error);
            });
            
        // Listen for controller change events
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
        
        let refreshing = false;
    });
    
    // Handle messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
            showUpdateNotification();
        }
    });
}

// Function to show update notification
function showUpdateNotification() {
    // Create update notification element
    const updateNotification = document.createElement('div');
    updateNotification.className = 'sw-update-available';
    updateNotification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
                <strong>New version available!</strong>
                <p style="margin: 0.5rem 0;">Refresh to update the app</p>
            </div>
            <button id="update-button" style="background: #fff; color: #2c5aa0; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                Update
            </button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(updateNotification);
    
    // Show notification with animation
    setTimeout(() => {
        updateNotification.classList.add('show');
    }, 100);
    
    // Add event listener to update button
    document.getElementById('update-button').addEventListener('click', () => {
        // Reload page to activate new service worker
        window.location.reload();
    });
}

// Check if app is installed
function checkAppInstalled() {
    // Check if running in standalone mode (installed)
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone || // iOS
                          document.referrer.includes('android-app://');
    
    if (isAppInstalled) {
        // App is installed - update UI if needed
        document.documentElement.classList.add('pwa-installed');
        
        // Hide install app links
        const installLinks = document.querySelectorAll('a[href="install.html"]');
        installLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
    
    // Listen for display mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (event) => {
        if (event.matches) {
            document.documentElement.classList.add('pwa-installed');
        } else {
            document.documentElement.classList.remove('pwa-installed');
        }
    });
    
    return isAppInstalled;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAppInstalled();
});
