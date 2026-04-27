importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDt4tE_fFdKF01W5atJ1jYlol3IOuzgQYM",
  authDomain: "luna-fashion-eefb2.firebaseapp.com",
  projectId: "luna-fashion-eefb2",
  storageBucket: "luna-fashion-eefb2.firebasestorage.app",
  messagingSenderId: "593821929374",
  appId: "1:593821929374:web:cf8d9c4f946f290153908f"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
