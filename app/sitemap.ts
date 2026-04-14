import { MetadataRoute } from 'next'
// 🔥 IMPORTANTE: Verifica que esta ruta sea exacta en tu proyecto
import blogData from '../data/blog-posts.json' 

export const dynamic = 'force-dynamic';

// Función auxiliar para fetch con tiempo límite (evita el 404 por lentitud)
async function fetchWithTimeout(url: string, options: any = {}, timeout = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DOMINIO = 'https://oleadatvpremium.com';

  // 1. RUTAS ESTÁTICAS (Siempre cargan)
  let rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${DOMINIO}/eventos-hoy`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ];

  const fetchOptions = { 
    headers: { 
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': DOMINIO, 
      'Referer': `${DOMINIO}/`
    },
    next: { revalidate: 60 } 
  };

  // 2. BLOG (Local)
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

  // 3. EVENTOS AUTO (Noticias IA)
  try {
    const res = await fetchWithTimeout('https://tucentral.store/Sportlive/eventos-auto.json');
    if (res?.ok) {
      const data = await res.json();
      data.forEach((e: any) => {
        if (e.slug) rutas.push({ url: `${DOMINIO}/eventos-hoy/${e.slug}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 });
      });
    }
  } catch (e) {}

  // 4. CANALES
  try {
    const res = await fetchWithTimeout('https://api.telelatinomax.shop/canales.php', fetchOptions);
    if (res?.ok) {
      const data = await res.json();
      for (const cat in data) {
        if (Array.isArray(data[cat])) {
          data[cat].filter((c: any) => c.Estado !== "Inactivo").forEach((c: any) => {
            const cleanId = c.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
            rutas.push({ url: `${DOMINIO}/canal/${cleanId}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 });
          });
        }
      }
    }
  } catch (e) {}

  // 5. AGENDA (Partidos) - Usamos Promise.all con catch individual para que ninguno bloquee
  try {
    const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
    const results = await Promise.all(
      PROXIES.map(p => 
        fetchWithTimeout(`https://api.telelatinomax.shop/api/${p}`, fetchOptions)
          .then(r => r?.ok ? r.json() : { data: [] })
          .catch(() => ({ data: [] }))
      )
    );
    
    const urlsAgregadas = new Set();
    results.flatMap(r => r.data || []).forEach((evento: any) => {
      let rawName = evento.attributes?.diary_description || "";
      let limpio = rawName.replace(/<[^>]*>?/gm, '').replace(/\[.*?\]/g, '').trim();
      if (limpio) {
        const cleanId = limpio.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const urlPartido = `${DOMINIO}/partido/${cleanId}`;
        if (!urlsAgregadas.has(urlPartido)) {
          urlsAgregadas.add(urlPartido);
          rutas.push({ url: urlPartido, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 });
        }
      }
    });
  } catch (e) {}

  return rutas;
}