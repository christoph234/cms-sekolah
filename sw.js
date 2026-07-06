const CACHE_NAME = 'cms-sekolah-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    // Jangan masukkan URL lengkap Google Fonts di sini jika menyebabkan CORS error
];

// Pemasangan Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Aktivasi Service Worker
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
        })
    );
});

// Strategi Fetch (Mengatasi error pada gambar image_ec9887.png)
self.addEventListener('fetch', (event) => {
    // Abaikan request dari Supabase atau font eksternal agar tidak bentrok dengan CORS
    if (event.request.url.includes('supabase.co') || event.request.url.includes('fonts.googleapis.com')) {
        return; // Biarkan browser mengambil langsung dari internet tanpa intervensi cache SW jika bermasalah
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika ada di cache, pakai cache. Jika tidak, ambil dari jaringan (fetch)
            return response || fetch(event.request).catch(() => {
                // Opsional: berikan fallback jika offline total dan asset tidak ada di cache
            });
        })
    );
});
