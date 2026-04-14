/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // 🔥 REDIRECCIONES (Nuevas y Viejas) 🔥
  async redirects() {
    return [
      // 🚨 1. NUEVO: EMBUDO MULTI-DOMINIO (Redirige Vercel al oficial) 🚨
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'sportlivetvpremium.vercel.app', // El dominio que usamos de trampa
          },
        ],
        destination: 'https://oleadatvpremium.com/:path*', // Tu dominio real
        permanent: true,
      },

      // 🔥 2. TUS REDIRECCIONES VIEJAS INTACTAS 🔥
      {
        source: '/ver.html',
        destination: '/SportLive/ver.html', 
        permanent: true, 
      },
      // Si entran a la carpeta base, los manda a /inicio
      {
        source: '/SportLive',
        destination: '/SportLive/inicio',
        permanent: true,
      },
      // Si alguien escribe index.html a mano, lo forzamos a la URL limpia
      {
        source: '/SportLive/index.html',
        destination: '/SportLive/inicio',
        permanent: true,
      }
    ]
  },

  // 🔥 NUEVO: REESCRITURAS INTACTAS (URLs limpias sin .html) 🔥
// next.config.mjs
async rewrites() {
  return [
    { 
      // 🔥 EXCLUSIÓN: Solo aplica si NO es sitemap o robots
      source: '/((?!sitemap|robots|api|_next).*)', 
      destination: '/SportLive/:path*' 
    },
      { 
        source: '/SportLive/inicio', 
        destination: '/SportLive/index.html' 
      },
      { 
        source: '/SportLive/agenda', 
        destination: '/SportLive/agenda.html' 
      },
      { 
        source: '/SportLive/peliculas', 
        destination: '/SportLive/peliculas.html' 
      },
      { 
        source: '/SportLive/television', 
        destination: '/SportLive/television.html' 
      },
      { 
        source: '/SportLive/ver', 
        destination: '/SportLive/ver.html' 
      }
    ]
  },
}

export default nextConfig