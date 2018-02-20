const PRECACHE = 'precache-v34';
const RUNTIME = 'runtime-v34';

const PRECACHE_URLS = [
  "",
  "/",
  "js/main.js",
  "js/firebase.js",
  "js/tngg-feed.js",
  "js/tngg-card.js",
  "js/tngg-post.js",
  "js/tngg-exit.js",
  "css/main.css",
  "vendor/idb/lib/idb.js",
  "vendor/lit-html/lit-html.js",
  "vendor/lit-html/lib/lit-extended.js",
  "vendor/lit-html-element/lit-element.js",
  "manifest.webmanifest",
  "__/firebase/4.10.0/firebase-app.js",
  "__/firebase/4.10.0/firebase-auth.js",
  "__/firebase/4.10.0/firebase-database.js",
  "__/firebase/4.10.0/firebase-messaging.js",
  "__/firebase/init.js"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(createDB())
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME ];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
