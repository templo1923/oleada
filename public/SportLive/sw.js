// sw.js - VERSIÓN BÁSICA (Solo para cumplir requisito PWA)
const CACHE_NAME = 'sportlive-v2';

// 1. Instalación
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. Activación
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 3. Interceptor pacífico (Obligatorio para PWA, pero no bloquea nada)
self.addEventListener('fetch', (event) => {
    // Deja pasar absolutamente todo el tráfico normal sin intervenir
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response('Estás offline o hay un problema de conexión.');
        })
    );
});