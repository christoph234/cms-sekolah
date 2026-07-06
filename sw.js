const CACHE_NAME = 'cms-sekolah-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Urbanist:wght=400;500;600;700&display=swap'
  // HAPUS BARIS TAILWIND CDN DI SINI AGAR TIDAK ERROR CORS
];

// Pasang Service Worker dan simpan aset ke cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivasi & pembersihan cache lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Strategi fetch: Coba jaringan dulu (Network First), jika gagal gunakan cache
self.addEventListener('fetch', (e) => {
  // Lewati request eksternal seperti Supabase API dan Tailwind CDN agar di-handle langsung oleh browser
  if (e.request.url.includes('supabase.co') || e.request.url.includes('tailwindcss.com')) return;

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});