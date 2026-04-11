import { Metadata } from 'next'

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams; // Leemos las variables extra de la URL
  
  const slug = resolvedParams.slug || "";
  const nombreEvento = decodeURIComponent(slug).replace(/-/g, ' ');
  
  // 🔥 MAGIA: Atrapamos la imagen que nos mandó la agenda, o usamos tu logo por defecto
  const imagenPortada = resolvedSearch?.i 
    ? decodeURIComponent(resolvedSearch.i) 
    : "https://oleadatvpremium.com/SportLive/icons/icon-512x512.png";
  
  return {
    title: `🔴 EN VIVO: ${nombreEvento}`,
    description: `🔥 Toca aquí para ver ${nombreEvento} en directo por SportLive Premium. Transmisión HD y gratis.`,
    openGraph: {
      title: `🔴 EN VIVO: ${nombreEvento}`,
      description: `Míralo AHORA en SportLive Premium. HD y sin cortes.`,
      images: [{ url: imagenPortada }], // 👈 AQUÍ INYECTAMOS LA IMAGEN DEL EVENTO
      type: "website",
    }
  }
}

export default async function CompartirPuente({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "";
  
  const nombreLimpio = decodeURIComponent(slug).replace(/-/g, ' ');
  const urlPwa = `/SportLive/agenda?e=${encodeURIComponent(nombreLimpio)}`;

  return (
    <html>
      <head><meta httpEquiv="refresh" content={`0; url=${urlPwa}`} /></head>
      <body style={{ backgroundColor: '#080c14', color: '#3b82f6', textAlign: 'center', marginTop: '20%', fontFamily: 'sans-serif' }}>
        <div style={{ padding: '20px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <h2>Abriendo SportLive...</h2>
          <p>Localizando: <strong style={{color: '#fff'}}>{nombreLimpio}</strong></p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.location.replace('${urlPwa}');` }} />
      </body>
    </html>
  )
}