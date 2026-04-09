import Link from 'next/link'
import { SatelliteDish, Play, ChevronRight } from 'lucide-react'

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
    return eventosEspeciales.slice(0, 10); // Traemos hasta 10, total se deslizan horizontalmente
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

      {/* Contenedor del Slider (Scroll Horizontal garantizado) */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-4 px-4 scrollbar-hide snap-x snap-mandatory max-w-7xl mx-auto">
        {destacados.map((evento, idx) => {
          const cleanId = evento.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          
          // 🔥 MAGIA SEO: Ahora apunta a tu página de Next.js para indexar todo en Google 🔥
          const linkFinal = `/canal/${cleanId}`; 
          const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(evento.Canal)}&background=1e3a8a&color=fff&bold=true&font-size=0.35&rounded=true`;
          
          return (
            <Link 
              key={idx} 
              href={linkFinal}
              // Ya no usamos target="_blank" para que fluya natural en tu propia web SEO
              className="relative group flex flex-row items-center text-left gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl shrink-0 snap-center transition-all duration-300 bg-gradient-to-br from-[#111827] to-[#450a0a] border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(239,68,68,0.4)] hover:border-red-500 w-[88%] sm:w-[400px] md:w-[450px]"
            >
              {/* Etiqueta Superior */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-4 sm:px-5 py-1 sm:py-1.5 rounded-b-xl tracking-[0.15em] whitespace-nowrap z-20 shadow-lg">
                🔥 ESTELAR EN VIVO 🔥
              </div>
              
              {/* Imagen GRANDE y protagonista */}
              <img 
                src={evento.Logo || fallbackLogo} 
                className="w-[65px] h-[65px] sm:w-[90px] sm:h-[90px] object-contain drop-shadow-xl rounded-xl bg-black/20 p-2 shrink-0 mt-2 sm:mt-0 group-hover:scale-110 transition-transform duration-300" 
                alt={evento.Canal}
              />

              {/* Textos sin recortes */}
              <div className="flex-1 min-w-0 w-full mt-2 sm:mt-0">
                <h3 className="text-[16px] sm:text-[22px] font-black text-white uppercase leading-[1.2] mb-1 sm:mb-2 whitespace-normal break-words">
                  {evento.Canal}
                </h3>
                <p className="text-red-300 text-[11px] sm:text-[13px] font-semibold flex items-center justify-start gap-1.5 whitespace-normal">
                   <SatelliteDish className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" /> Transmisión Premium
                </p>
              </div>

              {/* Botón Play */}
              <div className="flex shrink-0 w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] rounded-full bg-red-500/15 border border-red-500/40 text-red-500 items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110">
                <Play className="w-3 h-3 sm:w-5 sm:h-5 fill-current ml-0.5 sm:ml-1" />
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* Pista visual para celular */}
      {hayVarios && (
        <div className="text-center text-slate-500 text-[11px] font-black uppercase tracking-widest mt-[-10px] mb-2 flex items-center justify-center gap-1 sm:hidden">
          Desliza para ver más <ChevronRight className="w-3 h-3 text-primary animate-pulse" />
        </div>
      )}
    </section>
  )
}