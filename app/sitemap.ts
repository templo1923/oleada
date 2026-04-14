import { MetadataRoute } from 'next'
import blogData from '../data/blog-posts.json'

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalida cada hora para no saturar las APIs

// Función robusta con Timeout para evitar el 404
async function fetchSafe(url: string, options: any = {}) {
  try {
    const res = await fetch(url, { 
      ...options, 
      signal: AbortSignal.timeout(5000) // 5 segundos máximo por petición
    });
    return res.ok ? await res.json() : null;
  } catch (e) { 
    console.error(`Fallo en petición a: ${url}`);
    return null; 
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMINIO = 'https://oleadatvpremium.com';

  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${DOMINIO}/privacidad`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMINIO}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMINIO}/terminos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMINIO}/dmca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const fetchOptions = { 
    headers: { 
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': DOMINIO, 
      'Referer': `${DOMINIO}/`,
      'User-Agent': 'Mozilla/5.0'
    } 
  };

  // 1. BLOG (Local)
  if (blogData?.posts) {
    blogData.posts.forEach((post: any) => {
      rutas.push({
        url: `${DOMINIO}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt || new Date()),
        changeFrequency: 'weekly', priority: 0.7,
      });
    });
  }

  // 2. EVENTOS HOY (Usando fetchSafe)
  const eventosHoyData = await fetchSafe('https://tucentral.store/Sportlive/eventos-auto.json');
  if (Array.isArray(eventosHoyData)) {
    eventosHoyData.forEach((evento: any) => {
      if (evento.slug) {
        rutas.push({
          url: `${DOMINIO}/eventos-hoy/${evento.slug}`,
          lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8,
        });
      }
    });
  }

  // 3. CANALES (Usando fetchSafe)
  const dataCanales = await fetchSafe('https://api.telelatinomax.shop/canales.php', fetchOptions);
  if (dataCanales) {
    for (const cat in dataCanales) {
      if (Array.isArray(dataCanales[cat])) {
        dataCanales[cat].filter((c: any) => c.Estado !== "Inactivo").forEach((c: any) => {
          const cleanId = c.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          rutas.push({
            url: `${DOMINIO}/canal/${cleanId}`,
            lastModified: new Date(), changeFrequency: 'daily', priority: 0.8,
          });
        });
      }
    }
  }

  // 4. AGENDA (Manejo de múltiples proxies con fetchSafe)
  const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
  try {
    const results = await Promise.all(
      PROXIES.map(p => fetchSafe(`https://api.telelatinomax.shop/api/${p}`, fetchOptions))
    );
    
    const urlsAgregadas = new Set();
    results.flatMap(r => r?.data || []).forEach((evento: any) => {
      let rawName = evento.attributes?.diary_description || "";
      let limpio = rawName.replace(/<[^>]*>?/gm, '').trim()
                          .replace(/\[.*?\]/g, '')
                          .replace(/(INGLÉS|ESPAÑOL|LATINO|CASTELLANO)/gi, '').trim();

      if (limpio) {
        const cleanId = limpio.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const urlPartido = `${DOMINIO}/partido/${cleanId}`;
        if (!urlsAgregadas.has(urlPartido)) {
            urlsAgregadas.add(urlPartido);
            rutas.push({ url: urlPartido, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 });
        }
      }
    });
  } catch (e) { console.error("Error en Agenda"); }

  // 5. PELÍCULAS
  const TMDB_KEY = process.env.TMDB_API_KEY;
  if (TMDB_KEY) {
    const resultsPelis = await Promise.all([1, 2].map(page => 
      fetchSafe(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=es-ES&page=${page}`)
    ));
    
    resultsPelis.flatMap(r => r?.results || []).forEach((pelicula: any) => {
      if (pelicula.id) {
        rutas.push({ url: `${DOMINIO}/pelicula/${pelicula.id}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 });
      }
    });
  }

  return rutas;
}