import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 🔥 ESTRATEGIA MULTI-DOMINIO: Detecta el dominio automáticamente
  const DOMINIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportlivetvpremium.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 🔥 CORRECCIÓN: NUNCA bloquees /_next/ o Google no leerá tu CSS y pensará que tu web está rota. Solo bloqueamos la API.
      disallow: ['/api/'], 
    },
    sitemap: `${DOMINIO}/sitemap.xml`,
  }
}