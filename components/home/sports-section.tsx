import { Trophy, CalendarDays, Globe } from "lucide-react"
import { SportsClient } from "./sports-client" // 🚨 IMPORTAMOS LAS PESTAÑAS 🚨

// 1. Limpieza de nombres
function textoPuro(html: string) {
  if (!html) return "Evento Deportivo";
  let limpio = html.replace(/<[^>]*>?/gm, '').trim();
  limpio = limpio.replace(/\[.*?\]/g, '').replace(/(INGLÉS|ESPAÑOL|VARIOS|PORTUGUÉS|LATINO|CASTELLANO|FRENCH|GERMAN|TURCO|HÚNGARO|ALEMÁN|GRIEGO|ITALIANO|SUECO)/gi, '').trim();
  limpio = limpio.replace(/\(Señal Activa.*?\)/gi, '').trim();
  return limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');
}

// 2. Cerebro
function obtenerDeporte(evento: any): { nombre: string, icono: string, color: string } {
  const desc = textoPuro(evento.attributes?.diary_description || "").toUpperCase();
  const sp = (evento.attributes?.sport_name || "").toUpperCase();

  // 🚨 1. EXCEPCIONES VIP (Equipos de fútbol con nombres confusos)
  if (desc.includes("MOTOR LUBLIN") || desc.includes("RADOMIAK")) {
    return { nombre: "FÚTBOL", icono: "⚽", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  }

  // 2. DEPORTES MUY ESPECÍFICOS
  if (sp.includes("CRICKET") || desc.includes("CRÍQUET") || desc.includes("CRICKET")) {
    return { nombre: "CRÍQUET", icono: "🏏", color: "text-green-600 bg-green-600/10 border-green-600/20" };
  }

  if (sp.includes("MOTOR") || desc.includes("F1") || desc.includes("MOTOGP") || desc.includes("NASCAR") || desc.includes("PRIX") || desc.includes("AUTOMOVILISMO")) {
    return { nombre: "MOTOR", icono: "🏎️", color: "text-red-500 bg-red-500/10 border-red-500/20" };
  }
  
  if (sp.includes("BASKET") || desc.includes("NBA") || desc.includes("BALONCESTO") || desc.includes("FIBA") || desc.includes("EUROLEAGUE")) return { nombre: "BASKET", icono: "🏀", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
  if (sp.includes("TENNIS") || desc.includes("TENIS") || desc.includes("ATP") || desc.includes("WTA") || desc.includes("WIMBLEDON")) return { nombre: "TENIS", icono: "🎾", color: "text-lime-400 bg-lime-400/10 border-lime-400/20" };
  if (desc.includes("UFC") || desc.includes("BOXING") || desc.includes("MMA") || desc.includes("WWE") || desc.includes("BOXEO") || desc.includes("FIGHT")) return { nombre: "COMBATE", icono: "🥊", color: "text-red-600 bg-red-600/10 border-red-600/20" };
  if (desc.includes("MLB") || desc.includes("BÉISBOL") || desc.includes("BASEBALL") || desc.includes("BEISBOL")) return { nombre: "BÉISBOL", icono: "⚾", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
  if (desc.includes("NFL") || desc.includes("SUPER BOWL") || desc.includes("AMERICAN FOOTBALL") || desc.includes("AUSTRALIAN") || desc.includes("AFL")) return { nombre: "FUTBOL AMER.", icono: "🏈", color: "text-amber-600 bg-amber-600/10 border-amber-600/20" };
  if (sp.includes("VOLLEY") || desc.includes("VOLEY") || desc.includes("VOLEIBOL")) return { nombre: "VOLEIBOL", icono: "🏐", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };
  if (desc.includes("NHL") || desc.includes("HOCKEY")) return { nombre: "HOCKEY", icono: "🏒", color: "text-teal-400 bg-teal-400/10 border-teal-400/20" };
  if (desc.includes("BILLAR") || desc.includes("SNOOKER")) return { nombre: "BILLAR", icono: "🎱", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" };
  if (desc.includes("DARTS") || desc.includes("DARDOS")) return { nombre: "DARDOS", icono: "🎯", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" };
  if (desc.includes("CYCLING") || desc.includes("CICLISMO") || desc.includes("TOUR DE")) return { nombre: "CICLISMO", icono: "🚴", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" };
  if (desc.includes("GOLF") || desc.includes("PGA")) return { nombre: "GOLF", icono: "⛳", color: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20" };
  if (desc.includes("RUGBY") || desc.includes("SIX NATIONS")) return { nombre: "RUGBY", icono: "🏉", color: "text-amber-800 bg-amber-800/10 border-amber-800/20" };

  // 3. PRIORIDAD FINAL: FÚTBOL
  if (sp.includes("FÚTBOL") || sp.includes("FUTBOL") || sp.includes("SOCCER") || desc.includes("FÚTBOL") || desc.includes("FOOTBALL") || desc.includes("CHAMPIONS") || desc.includes("PREMIER") || desc.includes(" VS ") || desc.includes(" X ")) {
    return { nombre: "FÚTBOL", icono: "⚽", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  }

  return { nombre: "VARIOS", icono: "🏆", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" };
}

// 3. Consumo y Lógica
async function getAgendaData() {
  const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
  try {
    const fetchOptions = { next: { revalidate: 120 }, headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } };
    const results = await Promise.all(PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))));
    
    let todos = results.flatMap(r => r.data || []);
    
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false });
    const timeParts = formatter.formatToParts(new Date());
    const currentTimeInMinutes = (parseInt(timeParts.find(p => p.type === 'hour')?.value || "0") * 60) + parseInt(timeParts.find(p => p.type === 'minute')?.value || "0");

    const eventosFiltrados = todos.filter(evento => {
      if (obtenerDeporte(evento).nombre === "VARIOS") return false;
      const [h, m] = (evento.attributes.diary_hour || evento.attributes.diary_time || "00:00").split(':').map(Number);
      const diff = (h * 60 + m) - currentTimeInMinutes;
      return diff >= -120 && diff <= 120; // Rango de ventana de 2 horas
    }).map(evento => {
      const [h, m] = (evento.attributes.diary_hour || evento.attributes.diary_time || "00:00").split(':').map(Number);
      const diff = (h * 60 + m) - currentTimeInMinutes;
      return { 
        ...evento, 
        isLive: diff <= 5 && diff >= -110,
        categoriaAsignada: obtenerDeporte(evento),
        nombrePuro: textoPuro(evento.attributes.diary_description)
      };
    });

    eventosFiltrados.sort((a, b) => (a.attributes.diary_hour || "00:00").localeCompare(b.attributes.diary_hour || "00:00"));
    return eventosFiltrados;
  } catch (error) { return []; }
}

export async function SportsSection() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";
  const fechaActual = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).format(new Date());

  return (
    <section className="py-12 section-gradient overflow-hidden w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-md">
                <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" /> {fechaActual}
              </div>
              {/* 🚨 AQUÍ CAMBIAMOS EL TEXTO A GMT-5 (UTC-5) 🚨 */}
              <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/5">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> GMT-5 (UTC-5)
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6 sm:w-8 sm:h-8" /> Agenda <span className="text-primary">Destacada</span>
            </h2>
          </div>
        </div>

        {/* 🚨 LLAMAMOS AL NUEVO CLIENTE INTERACTIVO 🚨 */}
        <SportsClient matches={matches} IMG_BASE={IMG_BASE} />

      </div>
    </section>
  )
}