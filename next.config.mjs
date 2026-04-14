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
    return {
      // 1. REGLAS EXACTAS: Se aplican primero.
      afterFiles: [
        { source: '/SportLive/inicio', destination: '/SportLive/index.html' },
        { source: '/SportLive/agenda', destination: '/SportLive/agenda.html' },
        { source: '/SportLive/peliculas', destination: '/SportLive/peliculas.html' },
        { source: '/SportLive/television', destination: '/SportLive/television.html' },
        { source: '/SportLive/ver', destination: '/SportLive/ver.html' }
      ],
      
      // 2. LA MAGIA DEL FALLBACK:
      // Si alguien visita /eventos-hoy/..., Next.js lo procesa normal.
      // Si alguien visita una ruta que Next.js NO reconoce, ENTONCES lo busca en /SportLive/
      fallback: [
        {
          source: '/:path*',
          destination: '/SportLive/:path*'
        }
      ]
    }
  },
}

export default nextConfig