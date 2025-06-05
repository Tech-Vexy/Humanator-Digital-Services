// Service Worker for Humanator Digital Services PWA
// Enhanced with better caching strategies and performance monitoring

const CACHE_NAME = 'humanator-v1.2.0';
const STATIC_CACHE = 'humanator-static-v1.2.0';
const DYNAMIC_CACHE = 'humanator-dynamic-v1.2.0';
const IMAGE_CACHE = 'humanator-images-v1.2.0';

// Enhanced cache strategy - separate static and dynamic resources
const staticAssets = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/contact.html',
    '/css/style.css',
    '/css/professional-theme.css',
    '/css/animations.css',
    '/css/navigations.css',
    '/css/utilities.css',
    '/css/performance.css',
    '/css/media.css',
    '/script/main.js',
    '/manifest.json'
];

const imageAssets = [
    '/images/logo/logo.png',
    '/images/logo/logo.jpeg',
    '/images/radek-grzybowski-eBRTYyjwpRY-unsplash.jpg'
];

const externalAssets = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Performance monitoring
let installStartTime;
let activateStartTime;

// Install event - enhanced caching strategy
self.addEventListener('install', event => {
    console.log('Service Worker: Install started');
    installStartTime = performance.now();
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(staticAssets);
            }),
            
            // Cache images separately for better management
            caches.open(IMAGE_CACHE).then(cache => {
                console.log('Service Worker: Caching images');
                return cache.addAll(imageAssets);
            }),
            
            // Cache external resources
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Service Worker: Caching external resources');
                return Promise.allSettled(
                    externalAssets.map(url => 
                        cache.add(url).catch(err => 
                            console.warn(`Failed to cache ${url}:`, err)
                        )
                    )
                );
            })
        ]).then(() => {
            const installTime = performance.now() - installStartTime;
            console.log(`Service Worker: Install completed in ${installTime}ms`);
            
            // Skip waiting to activate immediately
            return self.skipWaiting();
        }).catch(error => {
            console.error('Service Worker: Install failed', error);
            throw error;
        })
    );
});

// Activate event - enhanced cache cleanup
self.addEventListener('activate', event => {
    console.log('Service Worker: Activate started');
    activateStartTime = performance.now();
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!validCaches.includes(cacheName)) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Claim all clients immediately
            self.clients.claim()
        ]).then(() => {
            const activateTime = performance.now() - activateStartTime;
            console.log(`Service Worker: Activate completed in ${activateTime}ms`);
            
            // Notify clients about the update
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_UPDATED',
                        message: 'Service Worker updated successfully'
                    });
                });
            });
        })
    );
});

// Enhanced fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    event.respondWith(
        (async () => {
            try {
                // Strategy based on request type
                if (event.request.destination === 'document') {
                    return await networkFirstStrategy(event.request);
                } else if (event.request.destination === 'image') {
                    return await cacheFirstStrategy(event.request, IMAGE_CACHE);
                } else if (url.pathname.includes('/css/') || url.pathname.includes('/script/')) {
                    return await cacheFirstStrategy(event.request, STATIC_CACHE);
                } else {
                    return await staleWhileRevalidateStrategy(event.request);
                }
            } catch (error) {
                console.error('Service Worker: Fetch failed', error);
                return await handleFallback(event.request);
            }
        })()
    );
});

// Network-first strategy for HTML documents
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the successful response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error(`Network response not ok: ${networkResponse.status}`);
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('Service Worker: Serving from cache', request.url);
        return cachedResponse;
    }
    
    console.log('Service Worker: Fetching from network', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Stale-while-revalidate strategy
async function staleWhileRevalidateStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(error => {
        console.warn('Service Worker: Network fetch failed', error);
        return cachedResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Fallback handler
async function handleFallback(request) {
    if (request.destination === 'document') {
        return caches.match('/index.html');
    }
    
    if (request.destination === 'image') {
        return caches.match('/images/logo/logo.png');
    }
    
    return new Response('Offline content not available', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync');
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle queued form submissions when back online
    return new Promise((resolve) => {
        // Implementation for background sync
        console.log('Background sync completed');
        resolve();
    });
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/logo/logo.png',
            badge: '/images/logo/logo.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification click received.');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
