import { Metadata } from "next"
import { AgendaClient } from "@/components/agenda-client"

export const metadata: Metadata = {
  title: 'Agenda Deportiva Hoy | Partidos en Vivo Gratis | SportLive',
  description: 'Mira la agenda deportiva de hoy. Fútbol en vivo, Champions League, NBA, UFC y más.',
}

function textoPuro(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

function obtenerDeporte(evento: any): string {
  const descRaw = evento.attributes.diary_description || "";
  const desc = textoPuro(descRaw).toUpperCase();
  const sp = (evento.attributes.sport_name || "").toUpperCase();

  if (sp.includes("FÚTBOL") || sp.includes("FUTBOL") || sp.includes("SOCCER")) return "FÚTBOL";
  if (sp.includes("BASKET") || desc.includes("NBA") || desc.includes("BALONCESTO") || desc.includes("FIBA")) return "BALONCESTO";
  if (sp.includes("TENNIS") || desc.includes("TENIS") || desc.includes("ATP") || desc.includes("WTA")) return "TENIS";
  if (sp.includes("MOTOR") || desc.includes("F1") || desc.includes("MOTOGP") || desc.includes("NASCAR") || desc.includes("AUTOMOVILISMO")) return "MOTOR";
  if (desc.includes("UFC") || desc.includes("BOXING") || desc.includes("MMA") || desc.includes("WWE") || desc.includes("BOXEO") || desc.includes("FIGHT")) return "COMBATE";
  if (desc.includes("MLB") || desc.includes("BÉISBOL") || desc.includes("BASEBALL") || desc.includes("BEISBOL")) return "BÉISBOL";
  if (desc.includes("NFL") || desc.includes("SUPER BOWL") || desc.includes("FOOTBALL AUSTRALIANO") || desc.includes("AFL")) return "FUTBOL AMER/AUS.";
  if (sp.includes("VOLLEY") || desc.includes("VOLEY") || desc.includes("VOLEIBOL")) return "VOLEYBOL";
  if (desc.includes("CRICKET") || desc.includes("CRÍQUET")) return "CRÍQUET";
  if (desc.includes("NHL") || desc.includes("HOCKEY")) return "HOCKEY";
  if (desc.includes("BILLAR") || desc.includes("SNOOKER")) return "BILLAR";
  if (desc.includes("DARTS") || desc.includes("DARDOS")) return "DARDOS";
  if (desc.includes("CYCLING") || desc.includes("CICLISMO") || desc.includes("TOUR DE")) return "CICLISMO";
  if (desc.includes("GOLF") || desc.includes("PGA")) return "GOLF";
  if (desc.includes("RUGBY") || desc.includes("SIX NATIONS")) return "RUGBY";
  if (desc.includes("FÚTBOL") || desc.includes("FUTBOL") || desc.includes(" VS ") || desc.includes(" X ") || desc.includes("CHAMPIONS")) return "FÚTBOL";

  return "VARIOS";
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

    todos.sort((a, b) => {
        const hA = a.attributes.diary_hour || a.attributes.diary_time || "00:00";
        const hB = b.attributes.diary_hour || b.attributes.diary_time || "00:00";
        return hA.localeCompare(hB);
    });

    return todos;
  } catch (error) { return []; }
}

export default async function AgendaPage() {
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";

  const eventosPorCategoria: Record<string, any[]> = { "TODOS": matches };
  
  matches.forEach(match => {
    const deporte = obtenerDeporte(match);
    if (!eventosPorCategoria[deporte]) eventosPorCategoria[deporte] = [];
    eventosPorCategoria[deporte].push(match);
  });

  const ordenPrioridad = ["TODOS", "FÚTBOL", "BALONCESTO", "TENIS", "MOTOR", "COMBATE", "BÉISBOL"];
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
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">Agenda <span className="text-primary">Pro</span></h1>
        <div className="inline-flex items-center justify-center gap-2 text-primary font-bold bg-primary/10 px-4 py-1.5 rounded-full mt-2">
            EVENTOS DISPONIBLES ({matches.length})
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Renderizamos el componente interactivo (Buscador + Lista estilo acordeón) */}
        <AgendaClient 
          matches={matches} 
          categoriasActivas={categoriasActivas} 
          eventosPorCategoria={eventosPorCategoria} 
          IMG_BASE={IMG_BASE} 
        />
      </section>
    </div>
  )
}