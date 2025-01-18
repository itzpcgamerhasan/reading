// ক্যাশের নাম এবং ক্যাশ করার ফাইলগুলোর লিস্ট
const CACHE_NAME = "reading-cache-v1";
const urlsToCache = [
  "/reading/", // মূল পেজ
  "/reading/index.html", // হোম পেজ
  "/reading/manifest.json", // ম্যানিফেস্ট ফাইল
];

// Install Event: ক্যাশে ফাইলগুলো যোগ করা
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event: ক্যাশ থেকে ফাইল সরবরাহ করা
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // ক্যাশে পেলে রেসপন্স ফেরত দাও
      if (response) {
        console.log("Cache hit:", event.request.url);
        return response;
      }
      // ক্যাশে না থাকলে নেটওয়ার্ক থেকে ফেচ করার চেষ্টা করো
      console.log("Cache miss, fetching from network:", event.request.url);
      return fetch(event.request).catch(() => {
        // যদি নেটওয়ার্ক ফেইল করে, ডিফল্ট একটি রেসপন্স ফেরত দাও
        console.error("Network fetch failed, returning default offline response");
        return caches.match("/reading/index.html");
      });
    })
  );
});

// Activate Event: পুরোনো ক্যাশ মুছে ফেলা
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
