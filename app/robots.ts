import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 🚨 CAMBIA ESTO POR TU DOMINIO FINAL 🚨
  const DOMINIO = 'https://sportlive-one.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Evitamos que Google indexe tus rutas internas de API
    },
    sitemap: `${DOMINIO}/sitemap.xml`,
  }
}