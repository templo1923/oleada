import { Metadata } from "next"
import Link from "next/link"
import { Calendar, Play, Trophy, Clock, Zap, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// 1. METADATOS SEO (Google leerá esto antes de entrar)
export const metadata: Metadata = {
  title: 'Agenda Deportiva Hoy | Partidos en Vivo Gratis | SportLive',
  description: 'Mira la agenda deportiva de hoy. Fútbol en vivo, Champions League, NBA, UFC y más. Transmisiones gratis en HD sin cortes.',
}

// 2. TIPADOS
interface ApiEvent {
  attributes: {
    diary_description: string;
    sport_name?: string;
    diary_hour?: string;
    diary_time?: string;
    country?: {
      data?: { attributes?: { country_image?: string; image?: { data?: { attributes?: { url?: string; } } } } }
    }
  }
}

// 3. TU CEREBRO DE CATEGORÍAS (Idéntico a tu jQuery)
function obtenerDeporte(evento: ApiEvent): { nombre: string, icono: string, color: string } {
  const desc = (evento.attributes.diary_description || "").toUpperCase();
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

// 4. FETCH DE DATOS (Con el disfraz para pasar el PHP)
async function getAgendaData() {
  const AGENDA_URL = "https://api.telelatinomax.shop/api/proxy.php"; 
  const LIVETV_URL = "https://api.telelatinomax.shop/api/proxy_livetv.php"; 
  const EXTRA_URL = "https://api.telelatinomax.shop/api/proxy_extra.php"; 
  const ONLIVE_URL = "https://api.telelatinomax.shop/api/proxy_onlive.php"; 

  try {
    const fetchOptions = { 
      next: { revalidate: 300 },
      headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' }
    };

    const [res1, res2, res3, res4] = await Promise.all([
      fetch(AGENDA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(LIVETV_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(EXTRA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(ONLIVE_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))
    ]);

    let todosLosPartidos: ApiEvent[] = [
      ...(res1.data || []), ...(res2.data || []), ...(res3.data || []), ...(res4.data || [])
    ];

    todosLosPartidos.sort((a, b) => {
        const hA = a.attributes.diary_hour || a.attributes.diary_time || "00:00";
        const hB = b.attributes.diary_hour || b.attributes.diary_time || "00:00";
        return hA.localeCompare(hB);
    });

    return todosLosPartidos;
  } catch (error) {
    return [];
  }
}

// 5. PÁGINA PRINCIPAL (Renderizada en Servidor)
export default async function AgendaPage() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";

  // 🧠 AGRUPAMOS LOS EVENTOS COMO EN TU JQUERY 🧠
  const eventosPorCategoria: Record<string, ApiEvent[]> = { "TODOS": matches };
  
  matches.forEach(match => {
    const deporte = obtenerDeporte(match).nombre;
    if (!eventosPorCategoria[deporte]) eventosPorCategoria[deporte] = [];
    eventosPorCategoria[deporte].push(match);
  });

  // 🧠 ORDENAMOS LAS PESTAÑAS (Fútbol primero) 🧠
  const ordenPrioridad = ["TODOS", "FÚTBOL", "BASKET", "TENIS", "MOTOR", "COMBATE", "BÉISBOL", "FUTBOL AMER.", "VARIOS"];
  const categoriasActivas = Object.keys(eventosPorCategoria).sort((a, b) => {
    let idxA = ordenPrioridad.indexOf(a);
    let idxB = ordenPrioridad.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 overflow-x-hidden w-full">
      {/* Cabecera de la página */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6 border border-primary/30">
            <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-bold text-white uppercase tracking-wider">EVENTOS DISPONIBLES ({matches.length})</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Agenda <span className="text-primary">Deportiva</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Selecciona tu deporte favorito y no te pierdas ninguna transmisión. Todos los eventos en vivo y en calidad HD.</p>
      </section>

      {/* 🚨 TABS DE SHADCN (El componente mágico) 🚨 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {matches.length > 0 ? (
          <Tabs defaultValue="TODOS" className="w-full">
            
            {/* Lista de Botones (Filtros) */}
            <div className="w-full overflow-x-auto scrollbar-hide mb-8 pb-4">
                <TabsList className="bg-white/5 border border-white/10 rounded-2xl h-auto p-2 inline-flex gap-2">
                {categoriasActivas.map(cat => (
                    <TabsTrigger 
                        key={cat} 
                        value={cat}
                        className="rounded-xl px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[#00d4ff] data-[state=active]:text-white transition-all shadow-none data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    >
                    {cat} 
                    <span className="ml-2 bg-black/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {eventosPorCategoria[cat].length}
                    </span>
                    </TabsTrigger>
                ))}
                </TabsList>
            </div>

            {/* Contenido de cada pestaña */}
            {categoriasActivas.map(cat => (
              <TabsContent key={cat} value={cat} className="mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  
                  {/* Renderizamos las tarjetas de los partidos de esta categoría */}
                  {eventosPorCategoria[cat].map((match, index) => {
                    const attr = match.attributes;
                    const rawName = attr.diary_description || "Evento Deportivo";
                    const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
                    const categoriaInfo = obtenerDeporte(match);

                    // Cortamos los nombres de los equipos
                    let homeTeam = rawName;
                    let awayTeam = "Transmisión HD";
                    if (rawName.toLowerCase().includes(" vs ")) {
                        const parts = rawName.split(/ vs /i);
                        homeTeam = parts[0]; awayTeam = parts[1] || "Transmisión";
                    } else if (rawName.toLowerCase().includes(" x ")) {
                        const parts = rawName.split(/ x /i);
                        homeTeam = parts[0]; awayTeam = parts[1] || "Transmisión";
                    }

                    // Manejo de imagen
                    let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || attr.country?.data?.attributes?.country_image;
                    if (!imageUrl) imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
                    else if (!imageUrl.startsWith('http')) imageUrl = `${IMG_BASE}${imageUrl}`;

                    // Título oculto para SEO
                    const seoTitle = `Ver partido ${rawName} EN VIVO HD`;

                    return (
                      <article key={index} className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative bg-white/[0.02] flex flex-col justify-between">
                        <h2 className="sr-only">{seoTitle}</h2>
                        
                        <div className="flex justify-between items-center mb-6">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${categoriaInfo.color}`}>
                            {categoriaInfo.icono} {categoriaInfo.nombre}
                          </span>
                          <div className="flex items-center gap-1 text-slate-300 bg-white/10 px-3 py-1 rounded-lg text-xs font-black">
                            <Clock className="w-3 h-3 text-primary" /> {time}
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 bg-white/5 rounded-full p-2 flex-shrink-0 flex items-center justify-center">
                                <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                              </div>
                              <span className="text-base font-bold text-white truncate" title={homeTeam}>{homeTeam}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 bg-white/5 rounded-full p-2 flex-shrink-0 flex items-center justify-center">
                                <span className="text-[12px] font-black text-slate-400">TV</span>
                              </div>
                              <span className="text-base font-bold text-white truncate" title={awayTeam}>{awayTeam}</span>
                            </div>
                          </div>
                        </div>

                        {/* Enlace directo a tu WebApp */}
                        <Button className="w-full rounded-2xl py-6 font-black text-xs tracking-widest uppercase transition-all bg-white/5 text-white hover:bg-primary hover:scale-[1.02] shadow-none hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/10 hover:border-primary" asChild>
                          <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer">
                            <Play className="mr-2 h-4 w-4 fill-current text-primary group-hover:text-white transition-colors" /> Ver Transmisión Gratis
                          </Link>
                        </Button>
                      </article>
                    )
                  })}

                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-20 glass rounded-[2rem] border border-white/5">
            <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-20 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">No hay eventos programados</h3>
            <p className="text-slate-400">Vuelve más tarde para ver la mejor cartelera deportiva.</p>
          </div>
        )}
      </section>
    </div>
  )
}