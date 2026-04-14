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
            value: 'sportlivetvpremium.vercel.app',
          },
        ],
        destination: 'https://oleadatvpremium.com/:path*',
        permanent: true,
      },

      // 🔥 2. TUS REDIRECCIONES VIEJAS INTACTAS 🔥
      {
        source: '/ver.html',
        destination: '/SportLive/ver.html', 
        permanent: true, 
      },
      {
        source: '/SportLive',
        destination: '/SportLive/inicio',
        permanent: true,
      },
      {
        source: '/SportLive/index.html',
        destination: '/SportLive/inicio',
        permanent: true,
      }
    ]
  },

  // 🔥 REESCRITURAS CORREGIDAS 🔥
  async rewrites() {
    return [
{ 
      // Solo redirige si NO es un archivo crítico
      source: '/:path((?!sitemap|robots|api|_next).*)', 
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