// Define cache name and files to cache
const CACHE_NAME = 'offline-cache-v2';
const FILES_TO_CACHE = [
    '/read.html', // Adjust this path if it's different
    
];

// Install Service Worker and cache required files
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting(); // Force activation
});

// Activate Service Worker and remove old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[ServiceWorker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of the page
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached response if found
            if (response) {
                console.log('[ServiceWorker] Serving from cache:', event.request.url);
                return response;
            }
            // Fetch from the network if not in cache
            return fetch(event.request).catch(() => {
                // Fallback to the cached offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('/read.html'); // Adjust this path if needed
                }
            });
        })
    );
});
