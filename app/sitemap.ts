export const dynamic = 'force-dynamic';

import { MetadataRoute } from 'next'
// 🔥 1. IMPORTANTE: Faltaba importar tu JSON del blog
import blogData from '@/data/blog-posts.json'



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 🔥 ESTRATEGIA MULTI-DOMINIO
  const DOMINIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportlive-one.vercel.app';

  // 1. Añadimos tus páginas estáticas principales y legales
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    // 🚨 AÑADIDO: La portada principal de eventos-hoy
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${DOMINIO}/privacidad`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMINIO}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMINIO}/terminos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMINIO}/dmca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Configuración de seguridad para tu API
  const fetchOptions = { 
    next: { revalidate: 120 },
    headers: { 
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://oleadatvpremium.com', 
      'Referer': 'https://oleadatvpremium.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    } 
  };

  // ==========================================
  // 🚨 2. SITEMAP DEL BLOG (Desde tu JSON local)
  // ==========================================
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

  // ==========================================
  // 🚨 3. SITEMAP DE EVENTOS HOY (Noticias IA)
  // ==========================================
  try {
    const resEventosHoy = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { cache: 'no-store' });
    if (resEventosHoy.ok) {
      const eventosHoyData = await resEventosHoy.json();
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
  } catch (e) { console.error("Error en sitemap Eventos Hoy:", e); }

  // ==========================================
  // 🚨 4. SITEMAP DE CANALES (M3U) 🚨
  // ==========================================
  try {
    const resCanales = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);
    const dataCanales = await resCanales.json();

    for (const cat in dataCanales) {
      if (Array.isArray(dataCanales[cat])) {
        const activos = dataCanales[cat].filter((c: any) => c.Estado !== "Inactivo");
        activos.forEach((c: any) => {
          const cleanId = c.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          rutas.push({
            url: `${DOMINIO}/canal/${cleanId}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error generando sitemap para canales:", error);
  }

  // ==========================================
  // 🚨 5. SITEMAP DE AGENDA (Partidos) 🚨
  // ==========================================
  try {
    const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
    const results = await Promise.all(
        PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })))
    );
    
    const todosLosEventos = results.flatMap(r => r.data || []);
    const urlsAgregadas = new Set();

    todosLosEventos.forEach((evento: any) => {
      let rawName = evento.attributes?.diary_description || "";
      let limpio = rawName.replace(/<[^>]*>?/gm, '').trim();
      limpio = limpio.replace(/\[.*?\]/g, '').replace(/(INGLÉS|ESPAÑOL|VARIOS|PORTUGUÉS|LATINO|CASTELLANO|FRENCH|GERMAN|TURCO|HÚNGARO|ALEMÁN|GRIEGO|ITALIANO|SUECO)/gi, '').trim();
      limpio = limpio.replace(/\(Señal Activa.*?\)/gi, '').trim();
      limpio = limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');

      if (limpio) {
        const cleanId = limpio.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const urlPartido = `${DOMINIO}/partido/${cleanId}`;

        if (!urlsAgregadas.has(urlPartido)) {
            urlsAgregadas.add(urlPartido);
            rutas.push({
              url: urlPartido,
              lastModified: new Date(),
              changeFrequency: 'hourly',
              priority: 0.9,
            });
        }
      }
    });
  } catch (error) {
    console.error("Error generando sitemap para eventos:", error);
  }

  // ==========================================
  // 🚨 6. SITEMAP DE PELÍCULAS (TMDB) 🚨
  // ==========================================
  try {
    const TMDB_KEY = process.env.TMDB_API_KEY;
    if (TMDB_KEY) {
      const fetchPages = [1, 2];
      const resultsPelis = await Promise.all(
        fetchPages.map(page => 
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=es-ES&page=${page}`).then(r => r.json()).catch(() => ({ results: [] }))
        )
      );
      
      const todasLasPeliculas = resultsPelis.flatMap(r => r.results || []);
      
      todasLasPeliculas.forEach((pelicula: any) => {
        if (pelicula.id) {
          rutas.push({
            url: `${DOMINIO}/pelicula/${pelicula.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error generando sitemap para peliculas:", error);
  }

  return rutas;
}