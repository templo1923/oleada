import { MetadataRoute } from 'next'
import blogData from '../data/blog-posts.json'
import eventosData from '../data/eventos-auto.json' // 🔥 FALTABA ESTO
import canalesData from '../data/channels.json'     // 🔥 AÑADIMOS TUS CANALES LOCALES


export default function sitemap(): MetadataRoute.Sitemap {
  const DOMINIO = 'https://oleadatvpremium.com';

  // Páginas estáticas seguras
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Blog (Carga desde tu archivo local, es 100% seguro)
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

// 3. Iterar Eventos Hoy (Usando tu archivo interno eventos-auto.json)
  if (Array.isArray(eventosData)) {
    eventosData.forEach((evento: any) => {
      if (evento.slug) {
        rutas.push({
          url: `${DOMINIO}/eventos-hoy/${evento.slug}`,
          // Usamos la fecha del evento si existe, si no la de hoy
          lastModified: new Date(evento.publishedAt || evento.date || new Date()),
          changeFrequency: 'hourly',
          priority: 0.8,
        });
      }
    });
  }


  
  return rutas;
}