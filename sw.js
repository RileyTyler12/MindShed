// Service Worker with basic caching strategy
const CACHE_NAME = 'mindshed-cache-v1';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/styles.css',
        '/scripts/contentSwitcher.js'
      ]);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        // Cache the network response if successful
        const cache = caches.open(CACHE_NAME);
        cache.then((c) => c.put(event.request, networkResponse));
        return networkResponse;
      }).catch(() => {
        // Return offline fallback (cached index.html)
        return caches.match('/index.html');
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});