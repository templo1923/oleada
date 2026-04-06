import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AgendaClient } from "@/components/agenda-client"
import { CalendarDays, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: 'Agenda Deportiva Hoy | SportLive',
  description: 'Fútbol, Baloncesto, Tenis y más en vivo.',
}

function textoPuro(html: string) {
  if (!html) return "";
  let limpio = html.replace(/<[^>]*>?/gm, '').trim();
  limpio = limpio.replace(/\[.*?\]/g, '').replace(/(INGLÉS|ESPAÑOL|VARIOS|PORTUGUÉS|LATINO|CASTELLANO|FRENCH|GERMAN|TURCO|HÚNGARO|ALEMÁN|GRIEGO|ITALIANO|SUECO)/gi, '').trim();
  limpio = limpio.replace(/\(Señal Activa.*?\)/gi, '').trim();
  return limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');
}

function obtenerDeporte(evento: any): { nombre: string, icono: string, color: string } {
  const desc = textoPuro(evento.attributes.diary_description).toUpperCase();
  const sp = (evento.attributes.sport_name || "").toUpperCase();

  // PRIORIDAD: FÚTBOL
  if (sp.includes("FÚTBOL") || sp.includes("FUTBOL") || sp.includes("SOCCER") || desc.includes("FÚTBOL") || desc.includes("FOOTBALL") || desc.includes("CHAMPIONS") || desc.includes(" VS ") || desc.includes(" X ")) return { nombre: "FÚTBOL", icono: "⚽", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  
  if (sp.includes("CRICKET") || desc.includes("CRÍQUET") || desc.includes("CRICKET")) return { nombre: "CRÍQUET", icono: "🏏", color: "text-green-600 bg-green-600/10 border-green-600/20" };
  if (sp.includes("BASKET") || desc.includes("NBA") || desc.includes("BALONCESTO")) return { nombre: "BASKET", icono: "🏀", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
  if (sp.includes("TENNIS") || desc.includes("TENIS")) return { nombre: "TENIS", icono: "🎾", color: "text-lime-400 bg-lime-400/10 border-lime-400/20" };
  if (sp.includes("MOTOR") || desc.includes("F1") || desc.includes("MOTOGP")) return { nombre: "MOTOR", icono: "🏎️", color: "text-red-500 bg-red-500/10 border-red-500/20" };
  if (desc.includes("UFC") || desc.includes("MMA") || desc.includes("BOXEO")) return { nombre: "COMBATE", icono: "🥊", color: "text-red-600 bg-red-600/10 border-red-600/20" };

  return { nombre: "VARIOS", icono: "🏆", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" };
}

async function getAgendaData() {
  const PROXIES = ["proxy.php", "proxy_livetv.php", "proxy_extra.php", "proxy_onlive.php"];
  try {
    const fetchOptions = { next: { revalidate: 120 }, headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } };
    const results = await Promise.all(PROXIES.map(p => fetch(`https://api.telelatinomax.shop/api/${p}`, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))));
    let todos = results.flatMap(r => r.data || []);
    todos.sort((a, b) => (a.attributes.diary_hour || "00:00").localeCompare(b.attributes.diary_hour || "00:00"));
    return todos.map(t => ({...t, categoriaAsignada: obtenerDeporte(t)}));
  } catch (error) { return []; }
}

export default async function AgendaPage() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";
  const fechaActual = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).format(new Date());

  const eventosPorCategoria: Record<string, any[]> = { "TODOS": matches };
  matches.forEach(match => {
    const deporte = match.categoriaAsignada.nombre;
    if (!eventosPorCategoria[deporte]) eventosPorCategoria[deporte] = [];
    eventosPorCategoria[deporte].push(match);
  });

  const categoriasActivas = Object.keys(eventosPorCategoria).sort();

  return (
    <div className="relative min-h-screen bg-background flex flex-col w-full">
      <Navbar />
      <main className="pt-24 pb-12 flex-1 w-full">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 border border-primary/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">Hoy: {fechaActual}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 border border-white/10 text-slate-400">
               <Globe className="w-3 h-3 sm:w-4 h-4" />
               <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">( UTC/GMT-5)</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4">Agenda <span className="text-primary">Deportiva</span></h1>
        </section>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AgendaClient matches={matches} categoriasActivas={categoriasActivas} eventosPorCategoria={eventosPorCategoria} IMG_BASE={IMG_BASE} />
        </section>
      </main>
      <Footer />
    </div>
  )
}