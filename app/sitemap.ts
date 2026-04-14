import { MetadataRoute } from 'next'
import blogData from '../data/blog-posts.json'
import canalesData from '../data/channels.json'

// Hacemos el sitemap dinámico para que llame a la API
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMINIO = 'https://oleadatvpremium.com';

  // 1. Páginas estáticas principales
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // 2. Blog (Sigue leyendo de tu JSON local porque así lo tienes configurado)
  if (blogData && blogData.posts) {
    blogData.posts.forEach((post: any) => {
      rutas.push({
        url: `${DOMINIO}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  }

  // 3. EVENTOS HOY (Lógica idéntica a tu page.tsx)
  try {
    const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
      cache: 'no-store',
      signal: AbortSignal.timeout(8000) // Timeout de seguridad de 8 segundos
    });
    
    if (res.ok) {
      const eventosData = await res.json();
      if (Array.isArray(eventosData)) {
        eventosData.forEach((evento: any) => {
          if (evento.slug) {
            rutas.push({
              url: `${DOMINIO}/eventos-hoy/${evento.slug}`,
              lastModified: new Date(evento.publishedAt || evento.date || new Date()),
              changeFrequency: 'hourly',
              priority: 0.8,
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error al traer eventos para el sitemap:", error);
  }

  // 4. Canales Premium (Sigue leyendo de tu archivo channels.json)
  if (canalesData) {
    if (Array.isArray(canalesData)) {
      canalesData.forEach((canal: any) => {
        const canalId = canal.slug || canal.id || canal.name?.toLowerCase().replace(/\s+/g, '-');
        if (canalId) {
          rutas.push({
            url: `${DOMINIO}/canal/${canalId}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    } else {
      Object.values(canalesData).forEach((categoria: any) => {
        if (Array.isArray(categoria)) {
          categoria.forEach((canal: any) => {
            const nombreCanal = canal.Canal || canal.name;
            if (nombreCanal) {
              const cleanId = nombreCanal.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              rutas.push({
                url: `${DOMINIO}/canal/${cleanId}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
              });
            }
          });
        }
      });
    }
  }

  return rutas;
}