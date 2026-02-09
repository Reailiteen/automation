/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAJDcqP3Cytnc-lelF5XFNDJtmmxl28xpQ",
    authDomain: "automation-6d864.firebaseapp.com",
    projectId: "automation-6d864",
    storageBucket: "automation-6d864.firebasestorage.app",
    messagingSenderId: "78120781764",
    appId: "1:78120781764:web:36d71d29afb61c6d668691",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "New notification";
  const options = {
    body: payload?.notification?.body || "",
    icon: "/next.svg",
    data: {
      url: payload?.data?.url || "/",
    },
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
