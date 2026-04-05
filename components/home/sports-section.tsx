import Link from "next/link"
import { Play, Trophy, Clock, Activity, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

// 1. Tipado
interface ApiEvent {
  attributes: {
    diary_description: string;
    sport_name?: string;
    diary_hour?: string;
    diary_time?: string;
    country?: {
      data?: {
        attributes?: {
          country_image?: string;
          image?: { data?: { attributes?: { url?: string; } } }
        }
      }
    }
  }
}

// 2. FUNCIÓN LIMPIADORA: Quita basura HTML de los nombres que vienen de la API
function textoPuro(html: string) {
  return (html || "").replace(/<[^>]*>?/gm, '').trim();
}

// 3. Cerebro de Categorías Visuales
function obtenerDeporte(evento: ApiEvent): { nombre: string, icono: string, color: string } {
  const desc = textoPuro(evento.attributes.diary_description).toUpperCase();
  const sp = (evento.attributes.sport_name || "").toUpperCase();

  if (sp.includes("FÚTBOL") || sp.includes("FUTBOL") || sp.includes("SOCCER") || desc.includes("FÚTBOL") || desc.includes("CHAMPIONS") || desc.includes("PREMIER") || desc.includes(" VS ") || desc.includes(" X ")) return { nombre: "FÚTBOL", icono: "⚽", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  if (sp.includes("BASKET") || desc.includes("NBA") || desc.includes("BALONCESTO") || desc.includes("FIBA")) return { nombre: "BASKET", icono: "🏀", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
  if (sp.includes("TENNIS") || desc.includes("TENIS") || desc.includes("ATP") || desc.includes("WTA")) return { nombre: "TENIS", icono: "🎾", color: "text-lime-400 bg-lime-400/10 border-lime-400/20" };
  if (sp.includes("MOTOR") || desc.includes("F1") || desc.includes("MOTOGP") || desc.includes("NASCAR")) return { nombre: "MOTOR", icono: "🏎️", color: "text-red-500 bg-red-500/10 border-red-500/20" };
  if (desc.includes("UFC") || desc.includes("BOXING") || desc.includes("MMA") || desc.includes("WWE") || desc.includes("BOXEO")) return { nombre: "COMBATE", icono: "🥊", color: "text-red-600 bg-red-600/10 border-red-600/20" };
  if (desc.includes("MLB") || desc.includes("BÉISBOL") || desc.includes("BASEBALL")) return { nombre: "BÉISBOL", icono: "⚾", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
  if (desc.includes("NFL") || desc.includes("SUPER BOWL")) return { nombre: "FUTBOL AMER.", icono: "🏈", color: "text-amber-600 bg-amber-600/10 border-amber-600/20" };

  return { nombre: "VARIOS", icono: "🏆", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" };
}

// 4. Consumo de APIs en el Servidor (Magia SEO)
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

    // Filtramos para ocultar "VARIOS" y mantener el inicio muy Top
    const eventosTop = todosLosPartidos.filter(p => obtenerDeporte(p).nombre !== "VARIOS");

    return eventosTop.slice(0, 10);
  } catch (error) {
    return [];
  }
}

export async function SportsSection() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";

  return (
    <section className="py-12 section-gradient overflow-hidden w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6" /> Agenda <span className="text-primary">Destacada</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Los mejores eventos clasificados y en vivo.</p>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x select-none w-full">
            {matches.map((match, index) => {
              const attr = match.attributes;
              const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
              const isLive = index < 3; 
              const categoriaInfo = obtenerDeporte(match);

              // 🚨 LIMPIEZA TOTAL DEL NOMBRE DEL EQUIPO 🚨
              const rawName = textoPuro(attr.diary_description || "Evento");
              
              let homeTeam = rawName;
              let awayTeam = "Transmisión HD";
              
              if (rawName.toLowerCase().includes(" vs ")) {
                const parts = rawName.split(/ vs /i);
                homeTeam = parts[0].trim(); 
                awayTeam = parts[1] ? parts[1].trim() : "Transmisión";
              } else if (rawName.toLowerCase().includes(" x ")) {
                const parts = rawName.split(/ x /i);
                homeTeam = parts[0].trim(); 
                awayTeam = parts[1] ? parts[1].trim() : "Transmisión";
              }

              // Imágenes
              let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || attr.country?.data?.attributes?.country_image;
              if (!imageUrl) imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
              else if (!imageUrl.startsWith('http')) imageUrl = `${IMG_BASE}${imageUrl}`;

              return (
                // 💡 AJUSTE VISUAL: Cambiamos a min-w-[320px] o [340px] para que los nombres largos quepan mejor sin apretarse.
                <div key={index} className="min-w-[320px] md:min-w-[340px] snap-start">
                  <h2 className="sr-only">Ver partido {rawName} en vivo gratis</h2>
                  
                  <article className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative h-full flex flex-col justify-between bg-white/[0.02]">
                    <div className="flex justify-between items-center mb-6">
                      
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${categoriaInfo.color}`}>
                        {categoriaInfo.icono} {categoriaInfo.nombre}
                      </span>

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

                    <div className="space-y-4 mb-8">
                      {/* FILA 1: EQUIPO LOCAL O NOMBRE PRINCIPAL */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                          <div className="w-10 h-10 bg-white rounded-full p-1.5 flex-shrink-0 flex items-center justify-center border border-white/20">
                            <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          {/* TRUCO: line-clamp-2 permite que el nombre ocupe 2 líneas si es muy largo, en lugar de cortarse de una vez */}
                          <span className="text-base font-bold text-white line-clamp-2 leading-tight" title={homeTeam}>
                            {homeTeam}
                          </span>
                        </div>
                      </div>

                      {/* FILA 2: EQUIPO VISITANTE O "TV" */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                          <div className="w-10 h-10 bg-white/5 rounded-full flex-shrink-0 flex items-center justify-center border border-white/5">
                            <span className="text-[12px] font-black text-slate-400">TV</span>
                          </div>
                          <span className="text-sm font-medium text-slate-300 line-clamp-2 leading-tight" title={awayTeam}>
                            {awayTeam}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTONES */}
                    <Button className={`w-full rounded-2xl py-6 font-black text-xs tracking-widest uppercase transition-all ${isLive ? "bg-gradient-to-r from-primary to-[#00d4ff] text-white hover:scale-[1.02] shadow-lg shadow-primary/20" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-primary/50"}`} asChild>
                      <Link href="/agenda-deportiva">
                        <Play className="mr-2 h-4 w-4 fill-current" /> Ver Transmisión
                      </Link>
                    </Button>
                    <Link href="/agenda-deportiva" className="absolute inset-0 z-0 rounded-[2rem]">
                      <span className="sr-only">Abrir {rawName}</span>
                    </Link>
                  </article>
                </div>
              )
            })}
            
            {/* Tarjeta Final */}
            <Link href="/agenda-deportiva" className="min-w-[180px] flex flex-col items-center justify-center glass border border-dashed border-white/10 rounded-[2rem] hover:bg-white/5 hover:border-primary/50 transition-all snap-start group">
               <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <ChevronRight className="w-7 h-7 text-primary" />
               </div>
               <span className="text-sm font-bold text-slate-300">Agenda Completa</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-[2rem] border border-white/5">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20 animate-pulse" />
            <p className="text-slate-400 font-bold">No hay eventos activos ahora.</p>
          </div>
        )}
      </div>
    </section>
  )
}