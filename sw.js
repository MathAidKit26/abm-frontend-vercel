const CACHE_NAME = "abm-v1";

const ASSETS = [
  "/",
  "/home_page/index.html",
  "/home_page/index.bm.html",
  "/general.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }),
  );
});
