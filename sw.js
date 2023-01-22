// let cacheVersion = 1;
// let cacheName = `web-worker-hadits-harian-${cacheVersion}`;
// // const assets = ['index.html', 'index.css', 'index.js'];
// const page = 'index.html';

// self.addEventListener('install', (e) => {
//   console.log('installing...');
//   //   assets.forEach((page) => {
//   e.waitUntil(
//     caches
//       .open(cacheName)
//       .then((c) => {
//         return c.add(page);
//       })
//       .catch((err) => console.log(err))
//   );
//   //   });
// });

// self.addEventListener('fetch', (e) => {
//   console.log('fetching with sw...');
//   if (e.request.mode === 'navigate') {
//     e.respondWith(
//       //   assets.forEach((page) => {
//       fetch(e.request.url).catch(() => {
//         return caches.match(page);
//         // });
//       })
//     );
//   }
// });

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('hadits-harian-v2');
  await cache.addAll(resources);
};

// Enable navigation preload
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/index.html',
      '/index.css',
      '/index.js',
      '/assets/img/border.png',
      '/assets/img/undraw-not-found.svg',
      '/assets/css/font-quicksand.css',
      '/assets/webfonts/fa-solid-900.woff2',
      '/assets/css/fontawesome-all.min.css',
      '/assets/js/html2canvas.min.js',
      '/assets/js/tailwind.min.js',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
