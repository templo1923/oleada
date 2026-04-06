import Link from "next/link"
import { Play, Trophy, Clock, Activity, ChevronRight, Zap, CalendarDays, Tv, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

// 1. Tipado
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

// 2. Limpieza de nombres
function textoPuro(html: string) {
  if (!html) return "Evento Deportivo";
  let limpio = html.replace(/<[^>]*>?/gm, '').trim();
  limpio = limpio.replace(/\[.*?\]/g, '').replace(/(INGLÉS|ESPAÑOL|VARIOS|PORTUGUÉS|LATINO|CASTELLANO|FRENCH|GERMAN|TURCO|HÚNGARO|ALEMÁN|GRIEGO|ITALIANO|SUECO)/gi, '').trim();
  limpio = limpio.replace(/\(Señal Activa.*?\)/gi, '').trim();
  return limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');
}

// 3. Cerebro Corregido (Prioridad Fútbol sobre palabras como "Motor")
function obtenerDeporte(evento: ApiEvent): { nombre: string, icono: string, color: string } {
  const desc = textoPuro(evento.attributes.diary_description).toUpperCase();
  const sp = (evento.attributes.sport_name || "").toUpperCase();

  // PRIORIDAD 1: Fútbol (Para evitar que "Motor Lublin" caiga en Motor)
  if (sp.includes("FÚTBOL") || sp.includes("FUTBOL") || sp.includes("SOCCER") || desc.includes("FÚTBOL") || desc.includes("FOOTBALL") || desc.includes("CHAMPIONS") || desc.includes("LALIGA") || desc.includes("PREMIER") || desc.includes(" VS ") || desc.includes(" X ")) {
     return { nombre: "FÚTBOL", icono: "⚽", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  }

  // PRIORIDAD 2: Otros deportes específicos
  if (sp.includes("CRICKET") || desc.includes("CRÍQUET") || desc.includes("CRICKET")) return { nombre: "CRÍQUET", icono: "🏏", color: "text-green-600 bg-green-600/10 border-green-600/20" };
  if (sp.includes("BASKET") || desc.includes("NBA") || desc.includes("BALONCESTO") || desc.includes("FIBA")) return { nombre: "BASKET", icono: "🏀", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
  if (sp.includes("TENNIS") || desc.includes("TENIS") || desc.includes("ATP") || desc.includes("WTA")) return { nombre: "TENIS", icono: "🎾", color: "text-lime-400 bg-lime-400/10 border-lime-400/20" };
  if (sp.includes("MOTOR") || desc.includes("F1") || desc.includes("MOTOGP") || desc.includes("NASCAR") || desc.includes("AUTOMOVILISMO")) return { nombre: "MOTOR", icono: "🏎️", color: "text-red-500 bg-red-500/10 border-red-500/20" };
  if (desc.includes("UFC") || desc.includes("BOXING") || desc.includes("MMA") || desc.includes("WWE") || desc.includes("BOXEO")) return { nombre: "COMBATE", icono: "🥊", color: "text-red-600 bg-red-600/10 border-red-600/20" };
  if (desc.includes("MLB") || desc.includes("BÉISBOL") || desc.includes("BASEBALL")) return { nombre: "BÉISBOL", icono: "⚾", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
  if (desc.includes("NFL") || desc.includes("SUPER BOWL") || desc.includes("AMERICAN FOOTBALL")) return { nombre: "FUTBOL AMER.", icono: "🏈", color: "text-amber-600 bg-amber-600/10 border-amber-600/20" };

  return { nombre: "VARIOS", icono: "🏆", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" };
}

async function getAgendaData() {
  const AGENDA_URL = "https://api.telelatinomax.shop/api/proxy.php"; 
  const LIVETV_URL = "https://api.telelatinomax.shop/api/proxy_livetv.php"; 
  const EXTRA_URL = "https://api.telelatinomax.shop/api/proxy_extra.php"; 
  const ONLIVE_URL = "https://api.telelatinomax.shop/api/proxy_onlive.php"; 

  try {
    const fetchOptions = { next: { revalidate: 120 }, headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } };
    const [res1, res2, res3, res4] = await Promise.all([
      fetch(AGENDA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(LIVETV_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(EXTRA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(ONLIVE_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))
    ]);

    let todos = [...(res1.data || []), ...(res2.data || []), ...(res3.data || []), ...(res4.data || [])];
    
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeParts = formatter.formatToParts(new Date());
    const currentTimeInMinutes = (parseInt(timeParts.find(p => p.type === 'hour')?.value || "0") * 60) + parseInt(timeParts.find(p => p.type === 'minute')?.value || "0");

    const eventosFiltrados = todos.filter(evento => {
      if (obtenerDeporte(evento).nombre === "VARIOS") return false;
      const [h, m] = (evento.attributes.diary_hour || evento.attributes.diary_time || "00:00").split(':').map(Number);
      const diff = (h * 60 + m) - currentTimeInMinutes;
      return diff >= -120 && diff <= 120;
    }).map(evento => {
      const [h, m] = (evento.attributes.diary_hour || evento.attributes.diary_time || "00:00").split(':').map(Number);
      const diff = (h * 60 + m) - currentTimeInMinutes;
      return { ...evento, isLive: diff <= 5 && diff >= -110 };
    });

    eventosFiltrados.sort((a, b) => (a.attributes.diary_hour || "00:00").localeCompare(b.attributes.diary_hour || "00:00"));
    return eventosFiltrados.slice(0, 10);
  } catch (error) { return []; }
}

export async function SportsSection() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";
  const fechaActual = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).format(new Date());

  return (
    <section className="py-12 section-gradient overflow-hidden w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-md">
                <CalendarDays className="w-3 h-3 sm:w-4 h-4" /> {fechaActual}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/5">
                <Globe className="w-3 h-3 sm:w-4 h-4" /> Bogotá (GMT-5)
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6 sm:w-8 h-8" /> Agenda <span className="text-primary">Destacada</span>
            </h2>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x select-none w-full">
            {matches.map((match: any, index: number) => {
              const attr = match.attributes;
              const time = (attr.diary_hour || "00:00").substring(0, 5);
              const rawName = textoPuro(attr.diary_description);
              const categoriaInfo = obtenerDeporte(match);
              let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || attr.country?.data?.attributes?.country_image;
              if (!imageUrl) imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
              else if (!imageUrl.startsWith('http')) imageUrl = `${IMG_BASE}${imageUrl}`;

              return (
                <div key={index} className="min-w-[280px] xs:min-w-[320px] md:min-w-[360px] snap-start">
                  <article className="glass border border-white/5 rounded-[2rem] p-5 sm:p-6 hover:border-primary/40 transition-all group relative h-full flex flex-col justify-between bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${categoriaInfo.color}`}>
                        {categoriaInfo.icono} {categoriaInfo.nombre}
                      </span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${match.isLive ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-white/10 text-slate-300'}`}>
                        {match.isLive ? <Zap className="w-3 h-3 fill-current" /> : <Clock className="w-3 h-3" />} {match.isLive ? 'LIVE' : time}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-8 flex-1 justify-center">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                          <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight line-clamp-3 uppercase">{rawName}</h3>
                           <div className="flex items-center gap-1.5 mt-2 bg-white/5 w-fit px-2 py-0.5 rounded border border-white/5">
                             <Tv className="w-3 h-3 text-slate-500" />
                             <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase">Transmisión HD</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <Button className={`w-full rounded-2xl py-5 sm:py-6 font-black text-[10px] sm:text-xs tracking-widest uppercase transition-all ${match.isLive ? "bg-gradient-to-r from-primary to-[#00d4ff] text-white" : "bg-white/5 border border-white/10 text-slate-300"}`} asChild>
                      <Link href="/agenda-deportiva">Ver Transmisión</Link>
                    </Button>
                  </article>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}