// 🚨 GENERADOR DE URLS SEO (ESTO CREA LAS PÁGINAS PARA GOOGLE) 🚨
  const generarEnlaceVer = (emb: any, rawName: string) => {
    const rawUrl = emb.attributes.embed_iframe;
    let rFinal = "";
    
    if (rawUrl.includes('eventos.html?r=')) {
        rFinal = rawUrl.split('eventos.html?r=')[1];
        if (rFinal.includes('&')) rFinal = rFinal.split('&')[0]; 
    } else if (rawUrl.startsWith('http')) {
        rFinal = btoa(rawUrl);
    } else {
        rFinal = rawUrl;
    }
    
    // 1. Creamos la ruta amigable para Google (ej: real-madrid-vs-barcelona)
    const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tituloCodificado = encodeURIComponent(rawName).replace(/'/g, "%27");
    
    // 2. Mandamos al usuario a la página SEO interna
    return `/partido/${slug}?r=${rFinal}&n=${tituloCodificado}`;
  }