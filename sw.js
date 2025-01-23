const CACHE_NAME = "reading-cache-v2"; // নতুন ক্যাশ নাম
const urlsToCache = [
  "/reading/",
  "/reading/index.html",
  "/reading/manifest.json",
];

// Install Event: নতুন ক্যাশ সেটআপ করা
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event: ক্যাশ এবং নেটওয়ার্ক ম্যানেজমেন্ট
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // ক্যাশ থেকে রেসপন্স
        console.log("Cache hit:", event.request.url);
        return response;
      }

      // নেটওয়ার্ক থেকে ফেচ করা
      console.log("Fetching from network:", event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            console.error("Network fetch failed:", event.request.url);
            return networkResponse;
          }

          // নতুন ডেটা ক্যাশে যোগ করা
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            console.log("New data cached:", event.request.url);
            return networkResponse;
          });
        })
        .catch(() => {
          // নেটওয়ার্ক কাজ না করলে একটি ডিফল্ট পেজ রিটার্ন
          return caches.match("/reading/index.html");
        });
    })
  );
});

// Activate Event: পুরানো ক্যাশ মুছে ফেলা
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("All old caches deleted.");
      return self.clients.claim();
    })
  );
});
