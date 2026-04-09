import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 🔥 ESTRATEGIA MULTI-DOMINIO: Detecta el dominio automáticamente
  const DOMINIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportlive-one.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Evitamos que Google pierda tiempo rastreando código interno o APIs
      disallow: ['/api/', '/_next/', '/public/'], 
    },
    sitemap: `${DOMINIO}/sitemap.xml`,
  }
}