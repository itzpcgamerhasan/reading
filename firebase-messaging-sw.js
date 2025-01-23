
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAKx_SDYuKMMxumQ0-LurDKFuJealqdA7U",
  authDomain: "dppushn-otification.firebaseapp.com",
  projectId: "dppushn-otification",
  storageBucket: "dppushn-otification.firebasestorage.app",
  messagingSenderId: "656610319409",
  appId: "1:656610319409:web:7519cbd4de540f130f0910",
  measurementId: "G-GE6TR9Q6V4"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);
