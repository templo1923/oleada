import { NextResponse } from 'next/server';
// 🔥 Ruta física al JSON del blog
import blogData from '../../data/blog-posts.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  const DOMINIO = 'https://oleadatvpremium.com';
  
  // 1. Cabecera del XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // 2. URLs ESTÁTICAS
  const estaticas = [
    '', '/agenda-deportiva', '/canales-premium', '/cine-estrenos', 
    '/blog', '/eventos-hoy', '/privacidad', '/terminos'
  ];
  estaticas.forEach(path => {
    xml += `<url><loc>${DOMINIO}${path}</loc><changefreq>daily</changefreq><priority>${path === '' ? '1.0' : '0.8'}</priority></url>`;
  });

  const fetchOptions = { 
    headers: { 'Origin': DOMINIO, 'Referer': `${DOMINIO}/` },
    next: { revalidate: 60 } 
  };

  // 3. BLOG (Dinámico local)
  if (blogData?.posts) {
    blogData.posts.forEach((post: any) => {
      xml += `<url><loc>${DOMINIO}/blog/${post.slug}</loc><priority>0.7</priority></url>`;
    });
  }

  // 4. CANALES (Dinámico API)
  try {
    const resCanales = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);
    const dataCanales = await resCanales.json();
    for (const cat in dataCanales) {
      if (Array.isArray(dataCanales[cat])) {
        dataCanales[cat].filter((c: any) => c.Estado !== "Inactivo").forEach((c: any) => {
          const cleanId = c.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          xml += `<url><loc>${DOMINIO}/canal/${cleanId}</loc><priority>0.8</priority></url>`;
        });
      }
    }
  } catch (e) { console.error("Error canales sitemap"); }

  // 5. AGENDA / PARTIDOS (Dinámico API)
  try {
    const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
    const results = await Promise.all(
      PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })))
    );
    const urlsAgregadas = new Set();
    results.flatMap(r => r.data || []).forEach((ev: any) => {
      let limpio = (ev.attributes?.diary_description || "").replace(/<[^>]*>?/gm, '').replace(/\[.*?\]/g, '').trim();
      if (limpio) {
        const cleanId = limpio.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const urlP = `${DOMINIO}/partido/${cleanId}`;
        if (!urlsAgregadas.has(urlP)) {
          urlsAgregadas.add(urlP);
          xml += `<url><loc>${urlP}</loc><priority>0.9</priority></url>`;
        }
      }
    });
  } catch (e) { console.error("Error partidos sitemap"); }

  // 6. PELÍCULAS (TMDB)
  try {
    const TMDB_KEY = process.env.TMDB_API_KEY;
    if (TMDB_KEY) {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=es-ES&page=1`);
      const data = await res.json();
      data.results?.forEach((p: any) => {
        xml += `<url><loc>${DOMINIO}/pelicula/${p.id}</loc><priority>0.7</priority></url>`;
      });
    }
  } catch (e) { console.error("Error pelis sitemap"); }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}