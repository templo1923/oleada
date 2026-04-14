import { MetadataRoute } from 'next'
import blogData from '../data/blog-posts.json' // Datos locales del blog

export const dynamic = 'force-dynamic';
export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMINIO = 'https://oleadatvpremium.com';

  // 1. Tus rutas manuales (las fijas)
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ];

  // 2. Cargar artículos del Blog (Desde tu JSON local)
  if (blogData?.posts) {
    blogData.posts.forEach((post: any) => {
      rutas.push({
        url: `${DOMINIO}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  }

  // 3. CARGA DINÁMICA DE "EVENTOS HOY" (La lista que me pasaste)
  try {
    const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000) // Damos 8 segundos por si son muchos datos
    });

    if (res.ok) {
      const eventosHoyData = await res.json();
      if (Array.isArray(eventosHoyData)) {
        eventosHoyData.forEach((evento: any) => {
          if (evento.slug) {
            rutas.push({
              url: `${DOMINIO}/eventos-hoy/${evento.slug}`,
              lastModified: new Date(evento.publishedAt || new Date()),
              changeFrequency: 'hourly',
              priority: 0.8,
            });
          }
        });
      }
    }
  } catch (e) {
    console.error("Error cargando eventos externos:", e);
  }

  return rutas;
}