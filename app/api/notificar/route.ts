import { NextResponse } from 'next/server';

// 🚀 Obligamos a Vercel a ejecutar esto SIEMPRE en vivo (sin caché)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        // Seguridad de acceso
        if (token !== 'kiamber_master_2026') {
            return NextResponse.json({ error: '🚫 Acceso denegado.' }, { status: 401 });
        }

        // 🛡️ LLAMAMOS A LA LLAVE DESDE LAS VARIABLES DE VERCEL
        const REST_API_KEY = process.env.ONESIGNAL_KEY;

        if (!REST_API_KEY) {
            return NextResponse.json({ error: '❌ Error: No se encontró la variable ONESIGNAL_KEY en Vercel.' }, { status: 500 });
        }

        const fetchOptions = {
            headers: {
                'Origin': 'https://oleadatvpremium.com',
                'Referer': 'https://oleadatvpremium.com/'
            },
            cache: 'no-store' as RequestCache
        };

        // 1. LEER EVENTOS VIP
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
        let mensaje = "";
        if (nombresEventosVIP.length === 1) {
            mensaje = `${nombresEventosVIP[0]} ya está disponible. ¡Toca para ver en HD!`;
        } else {
            const copia = [...nombresEventosVIP];
            const ultimo = copia.pop();
            mensaje = `${copia.join(', ')} y ${ultimo} ya están disponibles. ¡Míralos ahora!`;
        }

        const onesignalPayload = {
            app_id: "e017f9e9-c78d-4693-bb09-0e26b2f6d66c",
            included_segments: ["Total Subscriptions"],
            headings: { "en": titulo, "es": titulo },
            contents: { "en": mensaje, "es": mensaje },
            url: "https://oleadatvpremium.com/SportLive/television.html"
        };

        // 3. DISPARAR A ONESIGNAL USANDO LA VARIABLE
        const responseOS = await fetch('https://api.onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `key ${REST_API_KEY}` // Usamos la variable de Vercel
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