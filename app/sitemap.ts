import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 🔥 ESTRATEGIA MULTI-DOMINIO: Si tienes configurada la variable en Vercel la usa, si no, usa el .vercel.app por defecto
  const DOMINIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportlive-one.vercel.app';

  // 1. Añadimos tus páginas estáticas principales y legales
  const rutas: MetadataRoute.Sitemap = [
    { url: DOMINIO, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${DOMINIO}/agenda-deportiva`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${DOMINIO}/canales-premium`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${DOMINIO}/cine-estrenos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
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
  // 🚨 2. SITEMAP DE CANALES (M3U) 🚨
  // ==========================================
  try {
    const resCanales = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);
    const dataCanales = await resCanales.json();

    for (const cat in dataCanales) {
      if (Array.isArray(dataCanales[cat])) {
        // En el sitemap metemos TODOS los canales (Eventos Estelares y Canales 24/7) que estén activos
        const activos = dataCanales[cat].filter((c: any) => c.Estado !== "Inactivo");
        
        activos.forEach((c: any) => {
          // Usamos la misma limpieza que en tus componentes (cleanId)
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
  // 🚨 3. SITEMAP DE AGENDA (Partidos) 🚨
  // ==========================================
  try {
    const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
    
    const results = await Promise.all(
        PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })))
    );
    
    const todosLosEventos = results.flatMap(r => r.data || []);
    const urlsAgregadas = new Set();

    todosLosEventos.forEach((evento: any) => {
      // Función pura de limpieza de nombres (Igual a tus componentes)
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
  // 🚨 4. SITEMAP DE PELÍCULAS (TMDB) 🚨
  // ==========================================
  try {
    const TMDB_KEY = process.env.TMDB_API_KEY;
    if (TMDB_KEY) {
      // Pedimos las 2 primeras páginas de películas populares (40 películas para indexar hoy)
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