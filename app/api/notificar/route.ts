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

        // LEER TUS EVENTOS VIP DEL M3U (canales.php)
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

        // DISPARAR A ONESIGNAL
        let nombreEvento = nombresEventosVIP[0];
        let titulo = `🔴 ¡EVENTO EN VIVO!`;
        let mensaje = `${nombreEvento} ya está disponible. ¡Toca para ver en HD!`;

        const onesignalPayload = {
            app_id: "e017f9e9-c78d-4693-bb09-0e26b2f6d66c",
            included_segments: ["Subscribed Users"],
            headings: { "en": titulo, "es": titulo },
            contents: { "en": mensaje, "es": mensaje },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        };

        const responseOS = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic os_v2_app_4al7t2ohrvdjhoyjbytlf5wwnqcv42br6btedne4jw2icuexskvzv2hpwesjflxhcwo47bdh4asktpwsvaoeicmiamztfffrrqclwxy'
            },
            body: JSON.stringify(onesignalPayload)
        });

        const osResult = await responseOS.json();

        return NextResponse.json({ 
            success: true, 
            notificado: nombreEvento,
            onesignal_status: osResult 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}