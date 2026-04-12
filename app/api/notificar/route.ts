import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (token !== 'kiamber_master_2026') {
            return NextResponse.json({ error: '🚫 Acceso denegado.' }, { status: 401 });
        }

        const fetchOptions = {
            headers: {
                'Origin': 'https://oleadatvpremium.com',
                'Referer': 'https://oleadatvpremium.com/'
            },
            cache: 'no-store' as RequestCache
        };

        // 1. LEER TUS EVENTOS VIP DEL M3U (canales.php)
        const resCanales = await fetch("https://api.telelatinomax.shop/canales.php", fetchOptions);
        const canalesData = await resCanales.json();
        
        let nombresEventosVIP: string[] = [];

        for (const categoria in canalesData) {
            if (categoria.toUpperCase().includes("EVENTO")) {
                const canalesActivos = canalesData[categoria].filter((c: any) => c.Estado !== "Inactivo");
                canalesActivos.forEach((c: any) => {
                    nombresEventosVIP.push(c.Canal.trim());
                });
            }
        }

        if (nombresEventosVIP.length === 0) {
            return NextResponse.json({ message: 'No hay eventos VIP en el M3U.' });
        }

        // 2. CONSTRUIR EL MENSAJE MÚLTIPLE (Solución al problema de los 3 eventos)
        let nombreEventoPrincipal = nombresEventosVIP[0];
        let titulo = `🔴 ¡ESTELAR EN VIVO!`;
        let mensaje = `${nombreEventoPrincipal} ya está disponible. ¡Toca para ver en HD!`;

        if (nombresEventosVIP.length > 1) {
            mensaje = `${nombreEventoPrincipal} y ${nombresEventosVIP.length - 1} eventos más ya están disponibles. ¡Míralos ahora!`;
        }

        // 3. PREPARAR EL DISPARO
        const onesignalPayload = {
            app_id: "e017f9e9-c78d-4693-bb09-0e26b2f6d66c",
            included_segments: ["Subscribed Users"],
            headings: { "en": titulo, "es": titulo },
            contents: { "en": mensaje, "es": mensaje },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        };

        // 🚨 AQUÍ ESTÁ EL TRUCO: Pon la palabra "Basic ", un espacio, y tu NUEVA llave pegada.
        const NUEVA_API_KEY = "Basic os_v2_app_4al7t2ohrvdjhoyjbytlf5wwnsntj35bcluuaamlsymgww4qtkeoez3vset5fyt5luqnnpyo7vrvhizyx3szueyogpvr3fdvvkyhcii";

        // 4. DISPARAR A ONESIGNAL
        const responseOS = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': NUEVA_API_KEY
            },
            body: JSON.stringify(onesignalPayload)
        });

        const osResult = await responseOS.json();

        return NextResponse.json({ 
            success: true, 
            cantidad_eventos: nombresEventosVIP.length,
            mensaje_enviado: mensaje,
            onesignal_status: osResult 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}