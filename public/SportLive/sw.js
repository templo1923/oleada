// sw.js - EL ANIQUILADOR  SPORT (VERSIÓN FINAL)
const CACHE_NAME = 'sportlive-v2';

const BLACKLIST = [
    'aclib', 'acscdn', 'suv5', 'suurl5', 'adexchangeclear', 
    'playafterdark', 'popads', 'adsterra', 'onclickads', 
    'clismedia', 'cobalten', 'meshify', 'swarmcloud', 
    'dontfoid', 'betting', 'casino', 'lust'
];

// 1. Instalación inmediata
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. Activación y toma de control total de las pestañas
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 3. Interceptor de red (El corazón del Adblock y PWA)
self.addEventListener('fetch', (event) => {
    const url = event.request.url.toLowerCase();

    // REGLA 1: Dejar pasar el video y el reproductor esencial sin tocarlos
    if (
        url.includes('.m3u8') || 
        url.includes('.ts') || 
        url.includes('fubohd') || 
        url.includes('clappr') || 
        url.includes('p2p-engine')
    ) {
        return; // El navegador hace su petición normal
    }

    // REGLA 2: BLOQUEO AGRESIVO. Si la URL tiene un término prohibido, la matamos
    const isAds = BLACKLIST.some(term => url.includes(term));

    if (isAds) {
        console.warn('🛡️ SHIELD BLOQUEÓ:', url);
        event.respondWith(new Response('', { 
            status: 403, 
            statusText: 'SHIELD Blocked' 
        }));
        return;
    }

    // REGLA 3: Requisito PWA. Dejar pasar todo el tráfico limpio de la página
    event.respondWith(
        fetch(event.request).catch(() => {
            // Si el usuario se queda sin internet, mostramos un error genérico
            return new Response('Estás offline o hay un problema de conexión.');
        })
    );
});