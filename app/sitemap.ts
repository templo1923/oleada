import { MetadataRoute } from 'next'
import blogData from '../data/blog-posts.json'

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Se actualiza cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMINIO = 'https://oleadatvpremium.com';

  // 1. Rutas base y estáticas
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ];

  // 2. Blog (Local)
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

  // 3. EVENTOS HOY (Dinámico)
  try {
    // Usamos un timeout corto para que no bloquee el sitemap si la API está lenta
    const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000) 
    });

    if (res.ok) {
      const eventosHoyData = await res.json();
      if (Array.isArray(eventosHoyData)) {
        eventosHoyData.forEach((evento: any) => {
          if (evento.slug) {
            rutas.push({
              url: `${DOMINIO}/eventos-hoy/${evento.slug}`,
              lastModified: new Date(),
              changeFrequency: 'hourly',
              priority: 0.8,
            });
          }
        });
      }
    }
  } catch (e) {
    console.error("Error cargando eventos para sitemap:", e);
    // Si falla, no pasa nada, el sitemap devuelve las rutas anteriores
  }

  return rutas;
}