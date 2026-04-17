import { MetadataRoute } from 'next'
import blogData from '../data/blog-posts.json'
//import eventosData from '../data/eventos-auto.json' // 🔥 FALTABA ESTO
import canalesData from '../data/channels.json'     // 🔥 AÑADIMOS TUS CANALES LOCALES


// 1. Convertimos la función en ASYNC para que soporte fetch
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMINIO = 'https://oleadatvpremium.com';

  // 1. Páginas estáticas seguras
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // 2. Blog (Carga desde archivo local)
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

  // 3. Eventos Hoy (Carga desde archivo local corregido)
// 3. 🔥 EVENTOS HOY: CARGA DINÁMICA DESDE TU HOSTING 🔥
  try {
    const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', {
      next: { revalidate: 3600 } // Revalida el sitemap cada hora automáticamente
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
    // Si el hosting falla, el sitemap no se rompe (404), simplemente sigue con las otras rutas
    console.error("Error cargando eventos para sitemap:", error);
  }

  // 4. Canales Premium (Usando tu archivo channels.json)
  if (canalesData) {
    // Si tu channels.json es un array directo:
    if (Array.isArray(canalesData)) {
      canalesData.forEach((canal: any) => {
        // Asegúrate de que 'slug' o el nombre del canal exista en tu JSON
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
      // Si tu channels.json está dividido por categorías (ej: { "Deportes": [...], "Cine": [...] })
      Object.values(canalesData).forEach((categoria: any) => {
        if (Array.isArray(categoria)) {
          categoria.forEach((canal: any) => {
            // Ajusta "Canal" según cómo se llame el campo en tu channels.json
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