const cacheVersion = 1;

const files = ''

self.addEventListener('install', event => {
  event.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {

});
