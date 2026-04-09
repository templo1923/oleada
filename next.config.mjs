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
}

export default nextConfig