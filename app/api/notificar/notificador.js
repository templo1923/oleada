const fs = require('fs');
const https = require('https');

// Configuración OneSignal
const ONESIGNAL_APP_ID = "e017f9e9-c78d-4693-bb09-0e26b2f6d66c";
const ONESIGNAL_KEY = "os_v2_app_4al7t2ohrvdjhoyjbytlf5wwnqcv42br6btedne4jw2icuexskvzv2hpwesjflxhcwo47bdh4asktpwsvaoeicmiamztfffrrqclwxy";
const CANALES_URL = "https://api.telelatinomax.shop/canales.php";
const HISTORIAL_PATH = "./scripts/notificados.json";

async function iniciar() {
    console.log("🚀 Buscando nuevos eventos estelares...");

    // 1. Cargar historial de notificados
    let historial = [];
    if (fs.existsSync(HISTORIAL_PATH)) {
        historial = JSON.parse(fs.readFileSync(HISTORIAL_PATH, 'utf8'));
    }

    // 2. Consultar canales.php
    https.get(CANALES_URL, {
        headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' }
    }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", async () => {
            try {
                const data = JSON.parse(body);
                let nuevosEventos = [];

                // 3. Buscar en categorías que contengan "EVENTO"
                for (const cat in data) {
                    if (cat.toUpperCase().includes("EVENTO")) {
                        data[cat].forEach(canal => {
                            if (canal.Estado !== "Inactivo") {
                                const idUnico = canal.Canal.toLowerCase().trim();
                                // Si NO está en el historial, es nuevo
                                if (!historial.includes(idUnico)) {
                                    nuevosEventos.push({ nombre: canal.Canal, id: idUnico });
                                }
                            }
                        });
                    }
                }

                if (nuevosEventos.length > 0) {
                    console.log(`📡 Se encontraron ${nuevosEventos.length} eventos nuevos.`);
                    
                    for (const evento of nuevosEventos) {
                        await enviarNotificacion(evento.nombre);
                        historial.push(evento.id);
                    }

                    // 4. Guardar historial actualizado (Solo guardamos los últimos 50 para no pesar tanto)
                    const historialLimpio = historial.slice(-50);
                    fs.writeFileSync(HISTORIAL_PATH, JSON.stringify(historialLimpio, null, 2));
                    console.log("✅ Historial actualizado.");
                } else {
                    console.log("😴 No hay eventos nuevos.");
                }

            } catch (e) { console.error("Error procesando JSON:", e); }
        });
    });
}

async function enviarNotificacion(nombre) {
    return new Promise((resolve) => {
        const payload = JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            included_segments: ["Total Subscriptions"],
            headings: { "es": "🔴 ¡EVENTO EN VIVO!" },
            contents: { "es": `${nombre} ya está disponible. ¡Toca para ver en HD!` },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        });

        const req = https.request({
            hostname: 'onesignal.com',
            port: 443,
            path: '/api/v1/notifications',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONESIGNAL_KEY}`
            }
        }, (res) => {
            res.on('data', () => {
                console.log(`🔔 Notificación enviada: ${nombre}`);
                resolve();
            });
        });

        req.write(payload);
        req.end();
    });
}

iniciar();