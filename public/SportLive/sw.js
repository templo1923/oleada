// sw.js - EL ANIQUILADOR MAIK SPORT (VERSIÓN FINAL)
const BLACKLIST = [
    'aclib', 'acscdn', 'suv5', 'suurl5', 'adexchangeclear', 
    'playafterdark', 'popads', 'adsterra', 'onclickads', 
    'clismedia', 'cobalten', 'meshify', 'swarmcloud', 
    'dontfoid', 'betting', 'casino', 'lust'
];

// Instalación inmediata
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activación y toma de control total de las pestañas
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Interceptor de red (El corazón del Adblock)
self.addEventListener('fetch', (event) => {
    const url = event.request.url.toLowerCase();

    // 1. REGLA DE ORO: Dejar pasar el video y el reproductor esencial
    if (
        url.includes('.m3u8') || 
        url.includes('.ts') || 
        url.includes('fubohd') || 
        url.includes('clappr') || 
        url.includes('p2p-engine')
    ) {
        return;
    }

    // 2. BLOQUEO AGRESIVO: Si la URL tiene cualquier término prohibido, la matamos
    const isAds = BLACKLIST.some(term => url.includes(term));

    if (isAds) {
        console.warn('🛑 MAIK SHIELD BLOQUEÓ:', url);
        event.respondWith(new Response('', { 
            status: 403, 
            statusText: 'Maik Shield Blocked' 
        }));
    }
});