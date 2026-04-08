import Link from 'next/link'
import { SatelliteDish, Play, ChevronRight } from 'lucide-react'

async function getFeaturedData() {
  try {
    const response = await fetch('https://api.telelatinomax.shop/canales.php', {
      cache: 'no-store',
      // 🔥 LA MAGIA: Disfrazamos la petición para pasar la seguridad de tu servidor
      headers: { 
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://oleadatvpremium.com',
        'Referer': 'https://oleadatvpremium.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const data = await response.json();
    
    // Si la API nos devuelve un error por seguridad, abortamos
    if (data.error) return [];
    
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

  if (destacados.length === 0) {
    return (
      <div className="w-full max-w-[1000px] mx-auto mt-4 text-center border border-dashed border-red-500/50 p-4 rounded-xl text-red-400 text-xs font-bold">
        🚨 MODO DEBUG: El componente FeaturedEvents sí está instalado aquí, pero tu API "canales.php" está devolviendo 0 canales activos con la categoría "EVENTO".
      </div>
    );
  }
  
  const hayVarios = destacados.length > 1;

  return (
    <section className="w-full mb-8 overflow-hidden max-w-[1000px] mx-auto">
      {/* Contenedor del Slider */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-4 px-2 scrollbar-hide snap-x snap-mandatory">
        {destacados.map((evento, idx) => {
          const cleanId = evento.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          
          // 🔥 Mantenemos tu ruta intacta 🔥
          const linkFinal = `https://oleadatvpremium.com/SportLive/ver.html?canal=${cleanId}`;
          const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(evento.Canal)}&background=1e3a8a&color=fff&bold=true&font-size=0.35&rounded=true`;
          
          return (
            <Link 
              key={idx} 
              href={linkFinal}
              target="_blank"
              // 🔥 DISEÑO PREMIUM: Degradado, bordes rojos, anchos adaptables (88% en móvil, 50% en PC) 🔥
              className={`relative group flex flex-row items-center text-left gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl shrink-0 snap-center transition-all duration-300 bg-gradient-to-br from-[#111827] to-[#450a0a] border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(239,68,68,0.4)] hover:border-red-500 ${hayVarios ? 'w-[88%] sm:w-[calc(50%-8px)]' : 'w-full sm:w-full'}`}
            >
              {/* Etiqueta Superior */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-4 sm:px-5 py-1 sm:py-1.5 rounded-b-xl tracking-[0.15em] whitespace-nowrap z-20 shadow-lg">
                🔥 ESTELAR EN VIVO 🔥
              </div>
              
              {/* Logo del equipo/evento */}
              <img 
                src={evento.Logo || fallbackLogo} 
                className="w-[50px] h-[50px] sm:w-[90px] sm:h-[90px] object-contain drop-shadow-xl rounded-xl bg-black/20 p-1.5 shrink-0 mt-2 sm:mt-0" 
                alt={evento.Canal}
              />

              {/* Textos */}
              <div className="flex-1 min-w-0 w-full mt-2 sm:mt-0">
                <h3 className="text-[15px] sm:text-[22px] font-black text-white uppercase leading-[1.2] mb-1 sm:mb-2 whitespace-normal break-words">
                  {evento.Canal}
                </h3>
                <p className="text-red-300 text-[11px] sm:text-[14px] font-semibold flex items-center justify-start gap-1.5 whitespace-normal">
                   <SatelliteDish className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" /> Toca para ver la transmisión
                </p>
              </div>

              {/* Botón de Play Circular */}
              <div className="flex shrink-0 w-[32px] h-[32px] sm:w-[60px] sm:h-[60px] rounded-full bg-red-500/15 border border-red-500/40 text-red-500 items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <Play className="w-3 h-3 sm:w-6 sm:h-6 fill-current ml-0.5 sm:ml-1" />
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* Texto de Pista para deslizar en móviles (Si hay más de 1 evento) */}
      {hayVarios && (
        <div className="text-center text-slate-500 text-[11px] font-black uppercase tracking-widest mt-[-10px] mb-2 flex items-center justify-center gap-1 sm:hidden">
          Desliza para ver más eventos <ChevronRight className="w-3 h-3 text-primary animate-pulse" />
        </div>
      )}
    </section>
  )
}