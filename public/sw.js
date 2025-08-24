const CACHE_NAME = 'infovault-v1.0.0';
const STATIC_CACHE = 'infovault-static-v1.0.0';
const DYNAMIC_CACHE = 'infovault-dynamic-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/src/style.css',
  '/src/components/TabBar.vue',
  '/src/components/SearchBar.vue',
  '/src/components/InfoCard.vue',
  '/src/components/EmptyState.vue',
  '/src/components/AddInfoModal.vue',
  '/src/components/ViewInfoModal.vue',
  '/src/components/Toast.vue',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname === '/' || url.pathname === '/index.html') {
    // Main page - serve from cache first
    event.respondWith(serveFromCacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/src/') || url.pathname.startsWith('/components/')) {
    // Vue components and source files - serve from cache first
    event.respondWith(serveFromCacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/icons/')) {
    // App icons - serve from cache first
    event.respondWith(serveFromCacheFirst(request, STATIC_CACHE));
  } else if (url.origin === 'https://cdnjs.cloudflare.com') {
    // External CDN resources - serve from cache first
    event.respondWith(serveFromCacheFirst(request, STATIC_CACHE));
  } else {
    // Other requests - try network first, fallback to cache
    event.respondWith(serveFromNetworkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy for static assets
async function serveFromCacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    // Return a fallback response if available
    const fallbackResponse = await caches.match('/index.html');
    if (fallbackResponse) {
      return fallbackResponse;
    }
    throw error;
  }
}

// Network first strategy for dynamic content
async function serveFromNetworkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(performBackgroundSync());
  }
});

// Handle background sync
async function performBackgroundSync() {
  try {
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Notify clients about sync
    clients.forEach((client) => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        message: 'Background sync completed'
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New information available',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View',
          icon: '/icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-72x72.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'InfoVault', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle offline/online status changes
self.addEventListener('online', () => {
  console.log('App is online');
  // Notify clients about online status
  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'ONLINE_STATUS',
        online: true
      });
    });
  });
});

self.addEventListener('offline', () => {
  console.log('App is offline');
  // Notify clients about offline status
  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'ONLINE_STATUS',
        online: false
      });
    });
  });
});
