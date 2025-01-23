importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging.js');

// Firebase configuration (same as in your main code)
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

// Initialize Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received: ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
