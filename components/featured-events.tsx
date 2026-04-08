import Link from 'next/link'
import { SatelliteDish, Play, ChevronRight } from 'lucide-react'

async function getFeaturedData() {
  try {
    const response = await fetch('https://api.telelatinomax.shop/canales.php', {
      next: { revalidate: 300 } // Se actualiza cada 5 minutos
    });
    const data = await response.json();
    
    let eventosEspeciales: any[] = [];
    
    // Filtramos las categorías que contienen la palabra "EVENTO"
    for (const cat in data) {
      if (cat.toUpperCase().includes("EVENTO")) {
        const activos = data[cat].filter((c: any) => c.Estado !== "Inactivo");
        eventosEspeciales = [...eventosEspeciales, ...activos];
      }
    }
    return eventosEspeciales.slice(0, 5); // Tomamos los 5 principales
  } catch (e) {
    return [];
  }
}

export async function FeaturedEvents() {
  const destacados = await getFeaturedData();

  if (destacados.length === 0) return null;
  
  const hayVarios = destacados.length > 1;

  return (
    <section className="w-full mb-6 mt-2 overflow-hidden max-w-[1000px] mx-auto">
      <div className="flex gap-4 overflow-x-auto pb-8 pt-4 px-2 scrollbar-hide snap-x snap-mandatory">
        {destacados.map((evento, idx) => {
          const cleanId = evento.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          const linkFinal = `/ver.html?canal=${cleanId}`; // Apunta directo al reproductor
          const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(evento.Canal)}&background=1e3a8a&color=fff&bold=true&font-size=0.35&rounded=true`;
          
          return (
            <Link 
              key={idx} 
              href={linkFinal}
              target="_blank"
              // 🔥 TRUCO NETFLIX: Si hay varios, ocupa el 88% en móvil. En PC 50%.
              className={`relative group flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-6 p-5 sm:p-7 rounded-2xl shrink-0 snap-center transition-all duration-300 bg-gradient-to-br from-[#111827] to-[#450a0a] border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(239,68,68,0.4)] hover:border-red-500 ${hayVarios ? 'w-[88%] sm:w-[calc(50%-8px)]' : 'w-full sm:w-full'}`}
            >
              {/* Etiqueta Superior (ESTELAR EN VIVO) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black px-5 py-1.5 rounded-b-xl tracking-[0.15em] whitespace-nowrap z-20 shadow-lg flex items-center gap-2">
                🔥 ESTELAR EN VIVO 🔥
              </div>
              
              {/* Logo / Escudo (Más pequeño en móvil, imponente en PC) */}
              <img 
                src={evento.Logo || fallbackLogo} 
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-xl rounded-xl bg-black/20 p-1.5 shrink-0 mt-5 sm:mt-0" 
                alt={evento.Canal}
              />

              {/* Contenido / Texto (Permite bajar de línea) */}
              <div className="flex-1 min-w-0 w-full">
                <h3 className="text-base sm:text-[22px] font-black text-white uppercase leading-[1.2] mb-1 sm:mb-2 whitespace-normal break-words line-clamp-3">
                  {evento.Canal}
                </h3>
                <p className="text-red-300 text-[11px] sm:text-[13px] font-semibold flex items-center justify-center sm:justify-start gap-1.5 whitespace-normal">
                   <SatelliteDish className="w-3.5 h-3.5" /> Toca para ver la transmisión Premium
                </p>
              </div>

              {/* Botón de Play (Oculto en celular, visible en PC) */}
              <div className="hidden sm:flex shrink-0 w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full bg-red-500/15 border border-red-500/40 text-red-500 items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" />
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* Texto de Pista para deslizar en móviles (Si hay más de 1 evento) */}
      {hayVarios && (
        <div className="text-center text-slate-500 text-[11px] font-black uppercase tracking-widest mt-[-15px] mb-2 flex items-center justify-center gap-1 sm:hidden">
          Desliza para ver más eventos <ChevronRight className="w-3 h-3 text-primary animate-pulse" />
        </div>
      )}
    </section>
  )
}