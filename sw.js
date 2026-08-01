// File: sw.js

// 1. Deklarasikan versi cache dan daftar aset di paling atas file
const CACHE_NAME = 'cms-sekolah-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './image_ec9887.png',
    './icon-192.png', // Tambahkan ikon 192px di sini
    './icon-512.png'  // Tambahkan ikon 512px di sini
];

// 2. Pemasangan Service Worker (Install)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 3. Aktivasi Service Worker (Activate)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 4. Strategi Fetch
self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

    // Abaikan request non-GET (Supabase auth/database mutasi)
    if (event.request.method !== 'GET') {
        return;
    }

    // Abaikan API Supabase & Font Google dari cache
    if (requestUrl.includes('supabase.co') || requestUrl.includes('fonts.googleapis.com')) {
        return;
    }

    // Melayani file dari cache jika ada
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).catch(() => {
                // Offline fallback jika diperlukan
            });
        })
    );
});
