// ফাইল কাঁচা করা
const CACHE_NAME = "site-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // ক্যাশে পাওয়া গেলে ফেরত দাও, না হলে নেটওয়ার্ক থেকে নিয়ে আস
      return response || fetch(event.request);
    })
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
