const CACHE_NAME = 'aksara-bali-v2.3.0';
const urlsToCache = [
    '/',
    '/practice',
    '/blog',
    '/faq',
    '/sitemap.xml',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/robots.txt',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('[SW] Failed to cache resources:', error);
            })
    );
    // Take control immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all clients
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Never cache API calls — always hit the network so stats and admin data
    // stay fresh (cache-first here would freeze the dashboard on stale data).
    if (event.request.url.includes('/api/')) {
        return;
    }

    // Cache MediaPipe CDN assets (immutable, versioned) so the hand-gesture
    // model loads instantly on repeat visits and works offline.
    if (event.request.url.includes('cdn.jsdelivr.net/npm/@mediapipe')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(event.request).then((hit) =>
                    hit || fetch(event.request).then((resp) => {
                        if (resp && (resp.status === 200 || resp.type === 'opaque')) {
                            cache.put(event.request, resp.clone());
                        }
                        return resp;
                    })
                )
            )
        );
        return;
    }

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) &&
        !event.request.url.startsWith('https://fonts.googleapis.com') &&
        !event.request.url.startsWith('https://fonts.gstatic.com')) {
        return;
    }

    // Navigation / HTML documents → NETWORK-FIRST.
    // A cached HTML page points the browser at hashed JS chunks
    // (/_next/static/chunks/...) baked into that HTML. After a redeploy those
    // chunk hashes change and the old files are removed from the server, so
    // serving stale HTML makes the chunk requests 404 → the app can't hydrate
    // → Next.js shows "Application error: a client-side exception has occurred".
    // Always fetch fresh HTML so the document and its chunk hashes stay in sync;
    // fall back to cache only when the network is unavailable (offline).
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    return response;
                })
                .catch(() =>
                    caches.match(event.request).then((hit) => hit || caches.match('/'))
                )
        );
        return;
    }

    // Everything else (hashed JS/CSS, images, fonts) is immutable/versioned,
    // so CACHE-FIRST is safe and fast.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    // Add background sync logic here if needed
});

// Handle push notifications (optional)
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');
    // Add push notification logic here if needed
});

// Handle message from main thread
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});