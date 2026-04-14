/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, //
  },
  images: {
    unoptimized: true, //
  },
  
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'sportlivetvpremium.vercel.app' }],
        destination: 'https://oleadatvpremium.com/:path*',
        permanent: true,
      },
      { source: '/ver.html', destination: '/SportLive/ver.html', permanent: true },
      { source: '/SportLive', destination: '/SportLive/inicio', permanent: true },
      { source: '/SportLive/index.html', destination: '/SportLive/inicio', permanent: true }
    ]
  },

  async rewrites() {
    return [
      { 
        // Excluimos sitemap y robots de la reescritura masiva
        source: '/:path((?!sitemap|robots|api|_next).*)', 
        destination: '/SportLive/:path*' 
      },
      { source: '/SportLive/inicio', destination: '/SportLive/index.html' },
      { source: '/SportLive/agenda', destination: '/SportLive/agenda.html' },
      { source: '/SportLive/ver', destination: '/SportLive/ver.html' }
    ]
  },
}

export default nextConfig