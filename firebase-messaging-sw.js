console.log('Service Worker loaded successfully');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKx_SDYuKMMxumQ0-LurDKFuJealqdA7U",
  authDomain: "dppushn-otification.firebaseapp.com",
  projectId: "dppushn-otification",
  storageBucket: "dppushn-otification.firebasestorage.app",
  messagingSenderId: "656610319409",
  appId: "1:656610319409:web:7519cbd4de540f130f0910",
  measurementId: "G-GE6TR9Q6V4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handling
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icn512_rounded.png' // Replace with the path to your icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
