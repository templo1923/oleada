/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 🔥 REDIRECCIÓN AUTOMÁTICA DE VERCEL A OLEADA 🔥
  async redirects() {
    return [
      {
        source: '/ver.html',
        destination: 'https://oleadatvpremium.com/SportLive/ver.html',
        permanent: true, 
      },
    ]
  },
}

export default nextConfig