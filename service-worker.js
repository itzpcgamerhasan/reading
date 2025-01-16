// service-worker.js
const staticCacheName = 'static-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  // ... অন্যান্য ফাইল
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then((cache) => {
        return cache.addAll(assets);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
