/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  async redirects() {
    return [
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

  async rewrites() {
    return [
      { 
        // 🔥 CORRECCIÓN CRÍTICA: Añadimos ".xml" y ".txt" a la exclusión 
        // para que el sistema no intente mandarlos a /SportLive/
        source: '/:path((?!sitemap|robots|api|_next|.*\\.xml|.*\\.txt).*)', 
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