import Link from "next/link"
import { Play, Trophy, Zap, ChevronRight, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

// Tipado básico
interface ApiEvent {
  attributes: {
    diary_description: string;
    diary_hour?: string;
    diary_time?: string;
    country?: {
      data?: {
        attributes?: {
          country_image?: string;
          image?: {
            data?: {
              attributes?: {
                url?: string;
              }
            }
          }
        }
      }
    }
  }
}

// Consumo de APIs en el Servidor (Magia SEO)
async function getAgendaData() {
  const AGENDA_URL = "https://api.telelatinomax.shop/api/proxy.php"; 
  const LIVETV_URL = "https://api.telelatinomax.shop/api/proxy_livetv.php"; 
  const EXTRA_URL = "https://api.telelatinomax.shop/api/proxy_extra.php"; 
  const ONLIVE_URL = "https://api.telelatinomax.shop/api/proxy_onlive.php"; 

  try {
    const fetchOptions = { 
      next: { revalidate: 300 },
      headers: {
        'Origin': 'https://oleadatvpremium.com',
        'Referer': 'https://oleadatvpremium.com/'
      }
    };

    const [res1, res2, res3, res4] = await Promise.all([
      fetch(AGENDA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(LIVETV_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(EXTRA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(ONLIVE_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))
    ]);

    let todosLosPartidos: ApiEvent[] = [
      ...(res1.data || []), 
      ...(res2.data || []), 
      ...(res3.data || []),
      ...(res4.data || [])
    ];

    todosLosPartidos.sort((a, b) => {
        const hA = a.attributes.diary_hour || a.attributes.diary_time || "00:00";
        const hB = b.attributes.diary_hour || b.attributes.diary_time || "00:00";
        return hA.localeCompare(hB);
    });

    // 10 Eventos para la Landing
    return todosLosPartidos.slice(0, 10);
  } catch (error) {
    return [];
  }
}

export async function SportsSection() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";

  return (
    <section className="py-12 section-gradient overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera idéntica a tu diseño original */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6" /> Agenda <span className="text-primary">Destacada</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Lo más importante del día en vivo.</p>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x select-none">
            {matches.map((match, index) => {
              const attr = match.attributes;
              const rawName = attr.diary_description || "Evento";
              const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
              
              // 🚨 TRUCO DE DISEÑO: Separamos el nombre para el Equipo A y Equipo B 🚨
              let homeTeam = rawName;
              let awayTeam = "Transmisión HD";
              
              if (rawName.toLowerCase().includes(" vs ")) {
                const parts = rawName.split(/ vs /i);
                homeTeam = parts[0];
                awayTeam = parts[1] || "Transmisión";
              } else if (rawName.toLowerCase().includes(" x ")) {
                const parts = rawName.split(/ x /i);
                homeTeam = parts[0];
                awayTeam = parts[1] || "Transmisión";
              }

              // Lógica de imágenes
              let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || 
                             attr.country?.data?.attributes?.country_image;

              if (!imageUrl) {
                  imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
              } else if (!imageUrl.startsWith('http')) {
                  imageUrl = `${IMG_BASE}${imageUrl}`;
              }

              // Simulamos que los 3 primeros son los más "En Vivo" (Gancho visual para el usuario)
              const isLive = index < 3; 

              return (
                <div key={index} className="min-w-[280px] md:min-w-[320px] snap-start">
                  
                  {/* Etiqueta para SEO Oculta */}
                  <h2 className="sr-only">Ver partido {rawName} en vivo gratis</h2>
                  
                  {/* TARJETA ORIGINAL TUYA INTACTA */}
                  <article className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-32">Torneo de Hoy</span>
                      {isLive ? (
                        <div className="flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse">
                          <Zap className="w-3 h-3 fill-current" /> LIVE
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> {time}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-6">
                      {/* Fila Equipo 1 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 bg-white/5 rounded-full p-1.5 flex-shrink-0 flex items-center justify-center">
                            <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-bold text-white truncate w-32" title={homeTeam}>{homeTeam}</span>
                        </div>
                        <span className={`text-xl font-black ${isLive ? 'text-primary' : 'text-white'}`}>-</span>
                      </div>

                      {/* Fila Equipo 2 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 bg-white/5 rounded-full p-1.5 flex-shrink-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400">TV</span>
                          </div>
                          <span className="text-sm font-bold text-white truncate w-32" title={awayTeam}>{awayTeam}</span>
                        </div>
                        <span className={`text-xl font-black ${isLive ? 'text-primary' : 'text-white'}`}>-</span>
                      </div>
                    </div>

                    <Button className={`w-full rounded-2xl py-5 font-black text-[10px] tracking-widest uppercase transition-all ${isLive ? "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20" : "bg-white/5 text-slate-300 hover:bg-white/10"}`} asChild>
                      <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer">
                        <Play className="mr-2 h-3 w-3 fill-current" /> Ver Transmisión Libre
                      </Link>
                    </Button>
                    <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0 rounded-[2rem]">
                      <span className="sr-only">Abrir {rawName}</span>
                    </Link>
                  </article>
                </div>
              )
            })}
            
            {/* Botón final para "Explorar Todo" */}
            <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer" className="min-w-[180px] flex flex-col items-center justify-center glass border border-dashed border-white/10 rounded-[2rem] hover:bg-white/5 hover:border-primary/50 transition-all snap-start group">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <ChevronRight className="w-6 h-6 text-primary" />
               </div>
               <span className="text-xs font-bold text-slate-300">Explorar Todo</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-[2rem] border border-white/5">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-400 font-bold">No hay eventos activos ahora.</p>
          </div>
        )}
      </div>
    </section>
  )
}