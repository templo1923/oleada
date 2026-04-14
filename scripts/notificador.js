const fs = require('fs');
const https = require('https');

// Configuración OneSignal
const ONESIGNAL_APP_ID = "e017f9e9-c78d-4693-bb09-0e26b2f6d66c";
const ONESIGNAL_KEY = process.env.ONESIGNAL_KEY;
const CANALES_URL = "https://api.telelatinomax.shop/canales.php";
const HISTORIAL_PATH = "./scripts/notificados.json";

async function iniciar() {
    console.log("🚀 Buscando nuevos eventos estelares...");

    let historial = [];
    if (fs.existsSync(HISTORIAL_PATH)) {
        historial = JSON.parse(fs.readFileSync(HISTORIAL_PATH, 'utf8'));
    }

    https.get(CANALES_URL, {
        headers: { 
            'Origin': 'https://oleadatvpremium.com', 
            'Referer': 'https://oleadatvpremium.com/' 
        }
    }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", async () => {
            try {
                const data = JSON.parse(body);
                let nuevosEventos = [];

                for (const cat in data) {
                    if (cat.toUpperCase().includes("EVENTO")) {
                        data[cat].forEach(canal => {
                            if (canal.Estado !== "Inactivo") {
                                const idUnico = canal.Canal.toLowerCase().trim();
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

                    const historialLimpio = historial.slice(-50);
                    fs.writeFileSync(HISTORIAL_PATH, JSON.stringify(historialLimpio, null, 2));
                    console.log("✅ Memoria actualizada en notificados.json.");
                } else {
                    console.log("😴 No hay eventos nuevos. No se enviará spam.");
                }

            } catch (e) { 
                console.error("Error procesando JSON de canales:", e); 
            }
        });
    });
}

async function enviarNotificacion(nombre) {
    return new Promise((resolve) => {
        const payload = JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            included_segments: ["Total Subscriptions"],
            headings: { "es": "🔴 ¡ESTELAR EN VIVO!", "en": "🔴 ¡ESTELAR EN VIVO!" },
            contents: { "es": `${nombre} ya está disponible. ¡Toca para ver en HD!`, "en": `${nombre} ya está disponible. ¡Toca para ver en HD!` },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        });

        const req = https.request({
            hostname: 'api.onesignal.com', 
            port: 443,
            // 🔥 CORREGIDO: Ruta exacta igual a route.ts 🔥
            path: '/api/v1/notifications',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                // 🔥 CORREGIDO: Palabra 'key' minúscula igual a route.ts 🔥
                'Authorization': `key ${ONESIGNAL_KEY}`
            }
        }, (res) => {
            let respuestaOneSignal = "";
            res.on('data', (d) => respuestaOneSignal += d);
            res.on('end', () => {
                console.log(`🔔 Notificación enviada: ${nombre}`);
                console.log(`Respuesta OneSignal: ${respuestaOneSignal}`);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error("Error enviando a OneSignal:", e);
            resolve();
        });

        req.write(payload);
        req.end();
    });
}

iniciar();