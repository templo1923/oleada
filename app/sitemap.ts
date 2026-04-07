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
    }
  ];

  try {
    // 2. 🚨 AHORA SÍ: LLAMAMOS A TUS 4 PROVEEDORES 🚨
    const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
    const fetchOptions = { next: { revalidate: 120 } }; // Se revalida cada 2 minutos
    
    // Ejecutamos las 4 llamadas al mismo tiempo (Promise.all) para que sea súper rápido
    const results = await Promise.all(
        PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })))
    );
    
    // Juntamos todos los eventos de los 4 proveedores en una sola lista
    const todosLosEventos = results.flatMap(r => r.data || []);

    // 3. Usamos un "Set" (Conjunto) para evitar URLs duplicadas si un partido está en 2 proveedores
    const urlsAgregadas = new Set();

    todosLosEventos.forEach((evento: any) => {
      const rawName = evento.attributes?.diary_description;
      
      if (rawName) {
        // Creamos la URL amigable (slug) igual que en tu agenda
        const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const urlPartido = `${DOMINIO}/partido/${slug}`;

        // Si esta URL no ha sido agregada al mapa, la agregamos
        if (!urlsAgregadas.has(urlPartido)) {
            urlsAgregadas.add(urlPartido);
            
            rutas.push({
              url: urlPartido,
              lastModified: new Date(),
              changeFrequency: 'daily',
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