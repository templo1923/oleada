import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 🚨 CAMBIA ESTO POR TU DOMINIO FINAL EN VERCEL O TU DOMINIO PROPIO 🚨
  const DOMINIO = 'https://sportlive-one.vercel.app';

  // 1. Añadimos tus páginas estáticas principales
  const rutas: MetadataRoute.Sitemap = [
    {
      url: DOMINIO,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${DOMINIO}/agenda-deportiva`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${DOMINIO}/canales-premium`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }
  ];

  // Configuración para saltar la barrera de tu API
  const fetchOptions = { 
    next: { revalidate: 120 },
    headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } 
  };

  // ==========================================
  // 🚨 2. SITEMAP AUTOMÁTICO DE CANALES 🚨
  // ==========================================
  try {
    const resCanales = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);
    const dataCanales = await resCanales.json();

    for (const cat in dataCanales) {
      if (!cat.toUpperCase().includes("EVENTO")) { 
        const activos = dataCanales[cat].filter((c: any) => c.Estado !== "Inactivo");
        
        activos.forEach((c: any) => {
          const cleanId = c.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          rutas.push({
            url: `${DOMINIO}/canal/${cleanId}`, // Esta es la ruta correcta
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
  // 🚨 3. SITEMAP AUTOMÁTICO DE AGENDA 🚨
  // ==========================================
  try {
    const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
    
    // Ejecutamos las 4 llamadas al mismo tiempo
    const results = await Promise.all(
        PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })))
    );
    
    const todosLosEventos = results.flatMap(r => r.data || []);
    const urlsAgregadas = new Set();

    todosLosEventos.forEach((evento: any) => {
      const rawName = evento.attributes?.diary_description;
      
      if (rawName) {
        const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const urlPartido = `${DOMINIO}/partido/${slug}`;

        if (!urlsAgregadas.has(urlPartido)) {
            urlsAgregadas.add(urlPartido);
            
            rutas.push({
              url: urlPartido,
              lastModified: new Date(),
              changeFrequency: 'hourly',
              priority: 0.8,
            });
        }
      }
    });

  } catch (error) {
    console.error("Error generando sitemap para eventos:", error);
  }

  return rutas;
}