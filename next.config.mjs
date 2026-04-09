/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // 🔥 REDIRECCIONES (Cambio visible para el usuario) 🔥
  async redirects() {
    return [
      {
        source: '/ver.html',
        destination: '/SportLive/ver.html', 
        permanent: true, 
      },
    ]
  },

  // 🔥 REWRITES (El Tubo Secreto hacia tu Servidor en cPanel) 🔥
  async rewrites() {
    return [
      {
        // 1. Cuando el usuario entra a tu carpeta de siempre:
        source: '/SportLive/:path*', 
        
        // 2. Vercel va silenciosamente a tu nuevo subdominio en Cloudflare
        destination: 'https://origen.oleadatvpremium.com/SportLive/:path*', 
      },
    ]
  },
}

export default nextConfig