const CACHE = 'animal-pages-v3';
const FILES = [
  './',
  'index.html',
  'animal-manifest.json',
  'music.js',
  'animal-icon-180.png',
  'animal-icon-192.png',
  'animal-icon-512.png',
  'img/giraffe.svg',
  'img/monkey.svg',
  'img/mouse.svg',
  'img/owl.svg',
  'img/elephant.svg',
  'img/rabbit.svg',
  'img/turtle.svg',
  'img/hedgehog.svg',
  'img/peacock.svg',
  'img/zebra.svg',
  'img/penguin.svg',
  'img/panda.svg',
  'img/hippo.svg',
  'img/frog.svg',
  'img/crocodile.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('animal-pages-') && key !== CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).then(response => {   // 每次都向伺服器確認有沒有新版，不用瀏覽器快取的舊檔
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(async () =>
      (await caches.match(event.request)) ||
      (await caches.match(event.request, { ignoreSearch: true })) ||
      Response.error()
    )
  );
});
