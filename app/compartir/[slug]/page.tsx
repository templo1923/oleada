import { Metadata } from 'next'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  
  // Decodificamos y convertimos guiones en espacios para el título de WhatsApp
  const nombreEvento = decodeURIComponent(slug).replace(/-/g, ' ');
  
  return {
    title: `🔴 EN VIVO: ${nombreEvento}`,
    description: `🔥 Toca aquí para ver ${nombreEvento} en directo por SportLive Premium. Transmisión HD y gratis.`,
    openGraph: {
      title: `🔴 EN VIVO: ${nombreEvento}`,
      description: `Míralo AHORA en SportLive Premium. HD y sin cortes.`,
      images: [{ url: "https://oleadatvpremium.com/SportLive/icons/icon-512x512.png" }],
      type: "website",
    }
  }
}

export default async function CompartirPuente({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  
  // IMPORTANTE: Quitamos los guiones para que la Agenda reciba el nombre real
  const nombreLimpio = decodeURIComponent(slug).replace(/-/g, ' ');
  const urlPwa = `/SportLive/agenda?e=${encodeURIComponent(nombreLimpio)}`;

  return (
    <html>
      <head><meta httpEquiv="refresh" content={`0; url=${urlPwa}`} /></head>
      <body style={{ backgroundColor: '#080c14', color: '#3b82f6', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>
        <div style={{ padding: '20px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <h2>Abriendo SportLive Premium...</h2>
          <p>Localizando: <strong style={{color: '#fff'}}>{nombreLimpio}</strong></p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.location.replace('${urlPwa}');` }} />
      </body>
    </html>
  )
}