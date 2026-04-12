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

        // Buscamos en todas las categorías que contengan "EVENTO"
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

        // 2. CONSTRUIR EL MENSAJE AGRUPADO (Para que salgan todos)
        let titulo = `🔴 ¡ESTELAR EN VIVO!`;
        let mensaje = "";

        if (nombresEventosVIP.length === 1) {
            mensaje = `${nombresEventosVIP[0]} ya está disponible. ¡Toca para ver en HD!`;
        } else {
            // Si hay 3 eventos, dirá: "Evento 1, Evento 2 y Evento 3 ya están disponibles."
            const ultimo = nombresEventosVIP.pop();
            mensaje = `${nombresEventosVIP.join(', ')} y ${ultimo} ya están disponibles. ¡Míralos ahora!`;
        }

        const onesignalPayload = {
            app_id: "e017f9e9-c78d-4693-bb09-0e26b2f6d66c",
            included_segments: ["Subscribed Users"],
            headings: { "en": titulo, "es": titulo },
            contents: { "en": mensaje, "es": mensaje },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        };

        // 🚨 CAMBIO CRÍTICO: Para llaves os_v2_... se usa "Key" en lugar de "Basic"
        const API_KEY_FORMATTED = `Key os_v2_app_4al7t2ohrvdjhoyjbytlf5wwnrpb7hhcyrbudpmdqavrxw4iz2qaqwh7ixrw7ky6hnket4ko3d3jhnez2gx5f5zxc5qrxlawszfwvkq`;

        // 3. DISPARAR A ONESIGNAL (Usando el dominio api.onesignal.com preferido)
        const responseOS = await fetch('https://api.onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_KEY_FORMATTED
            },
            body: JSON.stringify(onesignalPayload)
        });

        const osResult = await responseOS.json();

        return NextResponse.json({ 
            success: true, 
            cantidad_eventos: nombresEventosVIP.length + 1,
            notificado: mensaje,
            onesignal_status: osResult 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}