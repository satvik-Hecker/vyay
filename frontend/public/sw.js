const CACHE_NAME = 'vyay-cache-v1';

// 1. Install Event: Force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

// 2. Activate Event: Take control of all pages immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. Fetch Event: CRITICAL for PWA installation
// Even a basic pass-through like this allows the "Install" button to work.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Optional: Return a cached offline page here if you have one
      return caches.match(event.request);
    })
  );
});

// 4. Push Notifications (Your existing logic)
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// 5. Notification Click (Your existing logic)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});