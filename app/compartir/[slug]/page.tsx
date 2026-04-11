import { Metadata } from 'next'

// 1. EL ROBOT DE WHATSAPP LEE ESTO Y CREA LA TARJETA HERMOSA
export async function generateMetadata({ params }: any): Promise<Metadata> {
  // 🔥 FORMA CORRECTA DE EXTRAER EL SLUG EN NEXT.JS 🔥
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  
  const nombreEvento = decodeURIComponent(slug).replace(/-/g, ' '); // Convertimos los guiones a espacios
  
  return {
    title: `🔴 EN VIVO: ${nombreEvento}`,
    description: `🔥 Toca aquí para ver ${nombreEvento} en directo por SportLive Premium. Transmisión HD, sin cortes y totalmente gratis.`,
    openGraph: {
      title: `🔴 EN VIVO: ${nombreEvento}`,
      description: `Míralo AHORA en SportLive Premium. HD y sin cortes.`,
      images: [
        {
          url: "https://oleadatvpremium.com/SportLive/icons/icon-512x512.png", // Tu logo premium
          width: 512,
          height: 512,
        }
      ],
      type: "website",
    }
  }
}

// 2. EL USUARIO HUMANO LEE ESTO Y ES EXPULSADO HACIA LA PWA
export default async function CompartirPuente({ params }: any) {
  // 🔥 FORMA CORRECTA DE EXTRAER EL SLUG EN NEXT.JS 🔥
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  
  const nombreEvento = decodeURIComponent(slug).replace(/-/g, ' ');
  
  // La URL real de tu PWA a donde queremos enviarlo
  const urlPwa = `/SportLive/agenda?e=${encodeURIComponent(nombreEvento)}`;

  return (
    <html>
      <head>
        {/* Redirección automática instantánea */}
        <meta httpEquiv="refresh" content={`0; url=${urlPwa}`} />
      </head>
      <body style={{ backgroundColor: '#080c14', color: '#3b82f6', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>
        <h2>Abriendo SportLive Premium...</h2>
        <p>Cargando el evento: <strong style={{color: '#fff'}}>{nombreEvento}</strong></p>
        <script dangerouslySetInnerHTML={{ __html: `window.location.replace('${urlPwa}');` }} />
      </body>
    </html>
  )
}