/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // 🔥 REDIRECCIONES VIEJAS (Cambio visible para el usuario) 🔥
  async redirects() {
    return [
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

  // 🔥 NUEVO: REESCRITURAS (URLs limpias sin .html) 🔥
  async rewrites() {
    return [
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