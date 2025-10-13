// Plantilla de un service worker mínimo



// 1.- Nombre del sw y los archivos a cachear
const CACHE_NAME = "mi-cache";
const BASE_PATH = "pwa-example/";
const urlsToCache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-192.png`,
    `${BASE_PATH}icons/icon-512.png`,
];

// 2. INSTALL -> se ejecuta al instalar el service worker
// (se meten a cache) los recuersos bases de la pwd

self.addEventListener("install", event => {
    console.log("Service worker: Intalando...")
    event.waitUntil(
        caches.open((CACHE_NAME)).then(cache => {
            console.log('Archivos cacheados')
            return cache.addAll(urlsToCache)
        })
    );
});

// 3. ACTIVATE -> se ejecuta al activarse el service worker
// limpiar el cache viejo, para mantener solo la versión actual de la cache

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

// 4. FETCH -> intercepta peticiones de la app
// intercepta cada petición de la PWA
// buscar primero en cache, sino está busca en internet
// en caso de falla, muestra la página offline.html

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match(`{BASE_PATH}offline.html`));
        })
    );
});

// 5. PUSH -> notificaciones en segundo plano
// manejo de notificaciones push (opcional)

self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin texto"
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", { body: data })
    );
});

