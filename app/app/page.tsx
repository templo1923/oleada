export const metadata = {
  title: "Descarga SportLive Premium 📲",
  description: "🔥 Instala la mejor App para ver Fútbol, Cine y TV Premium en VIVO. 100% Gratis y sin cortes. ¡Únete a la comunidad!",
  openGraph: {
    title: "Descarga SportLive Premium 📲",
    description: "🔥 Instala la mejor App para ver Fútbol, Cine y TV Premium en VIVO. 100% Gratis y sin cortes.",
    url: "https://oleadatvpremium.com/app",
    siteName: "SportLive Premium",
    images: [
      {
        url: "https://i.pinimg.com/564x/23/9f/de/239fde6c47ab5eea81a0ccffe103d714.jpg", // La foto de CR7 épica
        width: 1200,
        height: 630,
        alt: "SportLive Premium App",
      },
    ],
    type: "website",
  },
};

export default function SharePage() {
  return (
    <div style={{ backgroundColor: '#030712', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Cargando SportLive Premium... ⚽🎬</h2>
      
      {/* 🔥 MAGIA SEO: Redirección automática instantánea 🔥 */}
      <meta httpEquiv="refresh" content="0; url=/SportLive/index" />
      <script dangerouslySetInnerHTML={{ __html: "window.location.replace('/SportLive/index');" }} />
    </div>
  );
}