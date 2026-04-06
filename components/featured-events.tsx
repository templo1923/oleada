import Link from 'next/link'
import { Zap, Play, Trophy } from 'lucide-react'

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

  return (
    <section className="w-full mb-10 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Zap className="w-5 h-5 text-red-500 fill-red-500" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Eventos Estelares</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {destacados.map((evento, idx) => {
          const cleanId = evento.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
          const linkFinal = `https://oleadatvpremium.com/SportLive/ver.html?canal=${cleanId}`;
          const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(evento.Canal)}&background=1e3a8a&color=fff&bold=true`;
          
          return (
            <Link 
              key={idx} 
              href={linkFinal}
              target="_blank"
              className="relative min-w-[280px] sm:min-w-[400px] aspect-[21/9] rounded-[2rem] overflow-hidden group snap-start border border-white/10 shadow-2xl transition-transform hover:scale-[1.02]"
            >
              {/* Fondo con gradiente dinámico */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Imagen de fondo (puedes usar el logo estirado con blur o un placeholder) */}
              <img 
                src={evento.Logo || fallbackLogo} 
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 scale-110 group-hover:scale-100 transition-transform duration-700" 
                alt=""
              />

              {/* Contenido del Banner */}
              <div className="relative z-20 h-full p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 shadow-2xl flex-shrink-0">
                    <img src={evento.Logo || fallbackLogo} className="w-full h-full object-contain" alt={evento.Canal} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> En Vivo Ahora
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-none uppercase truncate max-w-[150px] sm:max-w-[200px]">
                      {evento.Canal}
                    </h3>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-bold mt-2 flex items-center gap-1">
                       <Trophy className="w-3 h-3 text-primary" /> Transmisión Estelar Premium
                    </p>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-xl">
                  <Play className="w-5 h-5 text-white fill-current ml-1" />
                </div>
              </div>

              {/* Etiqueta superior */}
              <div className="absolute top-0 right-8 z-30">
                <div className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-b-xl shadow-lg uppercase tracking-tighter">
                  Top Evento
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}