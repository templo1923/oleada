import { NextResponse } from 'next/server';

// 🚀 Forzamos a Vercel a ejecutar esto SIEMPRE en vivo (sin caché)
export const dynamic = 'force-dynamic';

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

        // 1. LEER TUS EVENTOS VIP
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
            return NextResponse.json({ message: 'No hay eventos VIP activos.' });
        }

        // 2. CONSTRUIR EL MENSAJE
        let titulo = `🔴 ¡ESTELAR EN VIVO!`;
        let mensaje = nombresEventosVIP.length === 1 
            ? `${nombresEventosVIP[0]} ya está disponible. ¡Toca para ver en HD!`
            : `${nombresEventosVIP.slice(0, -1).join(', ')} y ${nombresEventosVIP.slice(-1)} ya están disponibles. ¡Míralos ahora!`;

        const onesignalPayload = {
            app_id: "e017f9e9-c78d-4693-bb09-0e26b2f6d66c",
            included_segments: ["Subscribed Users"],
            headings: { "en": titulo, "es": titulo },
            contents: { "en": mensaje, "es": mensaje },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        };

        // 🚨 CONFIGURACIÓN SEGÚN MANUAL DE NOVIEMBRE 2024 🚨
        const REST_API_KEY = "os_v2_app_4al7t2ohrvdjhoyjbytlf5wwnrx34pq7ivxu4g5coadalyf63i4dqvgichr37hwrwgxiu2kruvtfmcpyj4ds47suewkhsdazw4uy2ty";

        // Usamos la NUEVA URL: api.onesignal.com
        const responseOS = await fetch('https://api.onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key ${REST_API_KEY}` // 👈 "key" en minúscula es el secreto
            },
            cache: 'no-store',
            body: JSON.stringify(onesignalPayload)
        });

        const osResult = await responseOS.json();

        return NextResponse.json({ 
            success: true, 
            notificado: mensaje,
            onesignal_status: osResult 
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}