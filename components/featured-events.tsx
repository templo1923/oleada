import Link from 'next/link'
import { Play, Zap } from 'lucide-react'

async function getFeaturedData() {
  try {
    const response = await fetch('https://api.telelatinomax.shop/canales.php', {
      cache: 'no-store',
      headers: { 
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://oleadatvpremium.com',
        'Referer': 'https://oleadatvpremium.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const data = await response.json();
    if (data.error) return [];
    
    let eventosEspeciales: any[] = [];
    
    for (const cat in data) {
      if (cat.toUpperCase().includes("EVENTO")) {
        const activos = data[cat].filter((c: any) => c.Estado !== "Inactivo");
        eventosEspeciales = [...eventosEspeciales, ...activos];
      }
    }
    // 🔥 Aumentamos el límite a 12 para que no se te quede ningún evento por fuera 🔥
    return eventosEspeciales.slice(0, 12); 
  } catch (e) {
    return [];
  }
}

export async function FeaturedEvents() {
  const destacados = await getFeaturedData();

  if (destacados.length === 0) return null;

  return (
    <section className="w-full mb-8 mx-auto">
      {/* Título de la sección con estilo Pro */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <Zap className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
        <h2 className="text-sm sm:text-base font-black uppercase tracking-[0.15em] text-white drop-shadow-md">
          Eventos Estelares en Vivo
        </h2>
      </div>

      {/* 🔥 EL TRUCO: Flex (Slider) en celular, y Grid (Cuadrícula) en PC 🔥 */}
      <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-6 pt-2 px-2 scrollbar-hide snap-x snap-mandatory">
        {destacados.map((evento, idx) => {
          const cleanId = evento.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          const linkFinal = `/ver.html?canal=${cleanId}`;
          const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(evento.Canal)}&background=1e3a8a&color=fff&bold=true&font-size=0.35&rounded=true`;
          
          return (
            <Link 
              key={idx} 
              href={linkFinal}
              target="_blank"
              // 🔥 DISEÑO TIPO CUADRITO PREMIUM (Inspirado en tu web de TV) 🔥
              className="relative group flex flex-col items-center justify-center text-center p-4 rounded-[1.25rem] shrink-0 snap-center transition-all duration-300 bg-gradient-to-b from-[#111827] to-[#3f0f0f] border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(239,68,68,0.4)] hover:border-red-500 w-[135px] sm:w-auto aspect-[1/1.1] sm:aspect-square overflow-hidden"
            >
              {/* Etiqueta Superior Pequeña */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] sm:text-[9px] font-black px-3 py-1 rounded-b-lg tracking-widest shadow-md z-10 flex items-center gap-1 w-max">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> EN VIVO
              </div>
              
              {/* Logo del equipo/evento */}
              <img 
                src={evento.Logo || fallbackLogo} 
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-xl rounded-xl bg-black/20 p-1.5 shrink-0 mt-4 mb-2 z-10 transition-transform duration-300 group-hover:scale-110" 
                alt={evento.Canal}
              />

              {/* Título del Evento */}
              <div className="flex flex-col items-center w-full z-10">
                <h3 className="text-[11px] sm:text-[13px] font-black text-slate-100 uppercase leading-tight mb-1 w-full line-clamp-2 px-1">
                  {evento.Canal}
                </h3>
              </div>

              {/* Hover Overlay con Botón Play Central (Efecto Mágico) */}
              <div className="absolute inset-0 bg-[#450a0a]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.8)] group-hover:scale-110 transition-transform mb-2">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">Ver Ahora</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}