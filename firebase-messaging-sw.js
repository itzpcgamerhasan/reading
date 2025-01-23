// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging.js");

// Initialize Firebase in the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyAKx_SDYuKMMxumQ0-LurDKFuJealqdA7U",
  authDomain: "dppushn-otification.firebaseapp.com",
  projectId: "dppushn-otification",
  storageBucket: "dppushn-otification.firebasestorage.app",
  messagingSenderId: "656610319409",
  appId: "1:656610319409:web:7519cbd4de540f130f0910"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon512_rounded.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
