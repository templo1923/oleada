import Link from 'next/link'
import { Play, ChevronRight, Activity } from 'lucide-react'

// Función para limpiar nombres (Igual a la de tu agenda)
function textoPuro(html: string) {
  if (!html) return "Evento Deportivo";
  let limpio = html.replace(/<[^>]*>?/gm, '').trim();
  limpio = limpio.replace(/\[.*?\]/g, '').replace(/(INGLÉS|ESPAÑOL|VARIOS|PORTUGUÉS|LATINO|CASTELLANO|FRENCH|GERMAN|TURCO|HÚNGARO|ALEMÁN|GRIEGO|ITALIANO|SUECO)/gi, '').trim();
  limpio = limpio.replace(/\(Señal Activa.*?\)/gi, '').trim();
  return limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');
}

async function getFeaturedData() {
  const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
  try {
    const fetchOptions = { 
      cache: 'no-store', 
      headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } 
    };

    // 1. Buscamos en la agenda (donde tenemos horas)
    const results = await Promise.all(PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))));
    let todos = results.flatMap(r => r.data || []);

    // 2. Calculamos la hora actual en Bogotá (GMT-5)
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeParts = formatter.formatToParts(new Date());
    const horaActualMinutos = (parseInt(timeParts.find(p => p.type === 'hour')?.value || "0") * 60) + parseInt(timeParts.find(p => p.type === 'minute')?.value || "0");

    // 3. Filtro de 130 minutos en vivo
    const destacadosEnVivo = todos.filter(evento => {
      const horaEvento = evento.attributes.diary_hour || evento.attributes.diary_time || "00:00";
      const [h, m] = horaEvento.split(':').map(Number);
      const minutosEvento = h * 60 + m;
      return horaActualMinutos >= minutosEvento && horaActualMinutos <= (minutosEvento + 130);
    });

    // Ordenamos por hora
    destacadosEnVivo.sort((a, b) => (a.attributes.diary_hour || "00:00").localeCompare(b.attributes.diary_hour || "00:00"));

    return destacadosEnVivo.slice(0, 10); 
  } catch (e) {
    return [];
  }
}

export async function FeaturedEvents() {
  const destacados = await getFeaturedData();

  if (destacados.length === 0) return null;
  
  const hayVarios = destacados.length > 1;

  return (
    <section className="w-full mb-8 overflow-hidden mx-auto">
      {/* Título de la Sección */}
      <div className="flex items-center gap-2 mb-2 px-4 max-w-7xl mx-auto">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-[0.15em] text-white">
          Eventos Estelares en Vivo
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 pt-4 px-4 scrollbar-hide snap-x snap-mandatory max-w-7xl mx-auto">
        {destacados.map((evento, idx) => {
          // 🔥 AHORA SÍ LEEMOS BIEN DE LA AGENDA 🔥
          const rawName = textoPuro(evento.attributes.diary_description);
          const cleanId = rawName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          
          // Extraemos el enlace R en Base64 para el reproductor
          let rBase64 = "";
          try {
            if (evento.attributes.embeds && evento.attributes.embeds.data && evento.attributes.embeds.data.length > 0) {
              const iframeStr = evento.attributes.embeds.data[0].attributes.embed_iframe;
              if (iframeStr.includes('r=')) {
                rBase64 = iframeStr.split('r=')[1].split('"')[0].split('&')[0];
              } else if (iframeStr.includes('src="')) {
                 const srcUrl = iframeStr.split('src="')[1].split('"')[0];
                 rBase64 = typeof btoa !== 'undefined' ? btoa(srcUrl) : srcUrl;
              }
            }
          } catch(e) {}

          // Generamos el enlace SEO que lleva a la página de partido
          const linkFinal = `/partido/${cleanId}?n=${encodeURIComponent(rawName)}&r=${rBase64}`; 
          
          // Lógica para el Logo (Sacando iniciales)
          let equipoA = rawName;
          let equipoB = "";
          const nombreLimpio = rawName.toUpperCase();
          if (nombreLimpio.includes(' VS ')) {
            const partes = nombreLimpio.split(' VS ');
            equipoA = partes[0].trim();
            equipoB = partes[1]?.trim() || "";
          } else if (nombreLimpio.includes(' X ')) {
            const partes = nombreLimpio.split(' X ');
            equipoA = partes[0].trim();
            equipoB = partes[1]?.trim() || "";
          }

          const iniciales = equipoA.charAt(0) + (equipoB ? equipoB.charAt(0) : '');
          const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&background=1e3a8a&color=fff&bold=true&size=200`;
          
          return (
            <Link 
              key={idx} 
              href={linkFinal}
              className="relative group flex flex-row items-center text-left gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl shrink-0 snap-center transition-all duration-300 bg-gradient-to-br from-[#111827] to-[#450a0a] border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(239,68,68,0.4)] hover:border-red-500 w-[88%] sm:w-[400px] md:w-[450px]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-4 sm:px-5 py-1 sm:py-1.5 rounded-b-xl tracking-[0.15em] whitespace-nowrap z-20 shadow-lg">
                🔥 ESTELAR EN VIVO 🔥
              </div>
              
              <img 
                src={fallbackLogo} 
                className="w-[65px] h-[65px] sm:w-[90px] sm:h-[90px] object-contain drop-shadow-xl rounded-xl bg-black/20 p-2 shrink-0 mt-2 sm:mt-0 group-hover:scale-110 transition-transform duration-300" 
                alt={rawName}
              />

              <div className="flex-1 min-w-0 w-full mt-2 sm:mt-0">
                <h3 className="text-[16px] sm:text-[22px] font-black text-white uppercase leading-[1.2] mb-1 sm:mb-2 whitespace-normal break-words">
                  {rawName}
                </h3>
                <p className="text-red-300 text-[11px] sm:text-[13px] font-semibold flex items-center justify-start gap-1.5 whitespace-normal">
                   <Activity className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" /> Transmisión Activa
                </p>
              </div>

              <div className="flex shrink-0 w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] rounded-full bg-red-500/15 border border-red-500/40 text-red-500 items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110">
                <Play className="w-3 h-3 sm:w-5 sm:h-5 fill-current ml-0.5 sm:ml-1" />
              </div>
            </Link>
          )
        })}
      </div>
      
      {hayVarios && (
        <div className="text-center text-slate-500 text-[11px] font-black uppercase tracking-widest mt-[-10px] mb-2 flex items-center justify-center gap-1 sm:hidden">
          Desliza para ver más <ChevronRight className="w-3 h-3 text-primary animate-pulse" />
        </div>
      )}
    </section>
  )
}