import Link from "next/link"
import { Play, Trophy, Zap, ChevronRight, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

// Tipado básico según la estructura de tu JSON
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

// Función para obtener los datos desde el servidor (¡ESTO ES LO QUE DA EL SEO!)
async function getAgendaData() {
  const AGENDA_URL = "https://api.telelatinomax.shop/api/proxy.php"; 
  const LIVETV_URL = "https://api.telelatinomax.shop/api/proxy_livetv.php"; 
  const EXTRA_URL = "https://api.telelatinomax.shop/api/proxy_extra.php"; 
  const ONLIVE_URL = "https://api.telelatinomax.shop/api/proxy_onlive.php"; 

  try {
    // Usamos next: { revalidate: 300 } para que Next.js guarde los datos en caché por 5 mins y no sature tu servidor
    const fetchOptions = { next: { revalidate: 300 } };

    const [res1, res2, res3, res4] = await Promise.all([
      fetch(AGENDA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(LIVETV_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(EXTRA_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(ONLIVE_URL, fetchOptions).then(r => r.json()).catch(() => ({ data: [] }))
    ]);

    // Unimos todos los eventos
    let todosLosPartidos: ApiEvent[] = [
      ...(res1.data || []), 
      ...(res2.data || []), 
      ...(res3.data || []),
      ...(res4.data || [])
    ];

    // Ordenamos por hora
    todosLosPartidos.sort((a, b) => {
        const hA = a.attributes.diary_hour || a.attributes.diary_time || "00:00";
        const hB = b.attributes.diary_hour || b.attributes.diary_time || "00:00";
        return hA.localeCompare(hB);
    });

    // Para la Landing, solo tomamos los primeros 12 eventos para no hacerla gigante
    return todosLosPartidos.slice(0, 12);

  } catch (error) {
    console.error("Error cargando agenda en el servidor:", error);
    return [];
  }
}

export async function SportsSection() {
  // Obtenemos los datos antes de que la página se envíe al navegador
  const matches = await getAgendaData();
  const IMG_BASE = "https://cdn.pltvhd.com";

  // Función para determinar si el partido está pasando AHORA (Aprox)
  // Como esto se renderiza en el servidor (zona UTC usualmente), hacemos un cálculo básico
  const isMatchLive = (timeStr: string) => {
      // Nota: Esta es una aproximación para SEO. En la web final, jQuery hace el cálculo exacto.
      return false; // Por seguridad en el renderizado SSR, lo dejamos false, o puedes implementar lógica de zona horaria aquí.
  };

  return (
    <section className="py-12 section-gradient overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6" /> Agenda <span className="text-primary">Deportiva Hoy</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Los eventos en vivo y programados para las próximas horas.</p>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x select-none">
            {matches.map((match, index) => {
              const attr = match.attributes;
              const nombrePartido = attr.diary_description;
              const horaEvento = attr.diary_hour || attr.diary_time || "00:00";
              
              // Resolvemos la imagen igual que en tu jQuery
              let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || 
                             attr.country?.data?.attributes?.country_image;

              if (!imageUrl) {
                  imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
              } else if (!imageUrl.startsWith('http')) {
                  imageUrl = `${IMG_BASE}${imageUrl}`;
              }

              return (
                <div key={index} className="min-w-[280px] md:min-w-[320px] snap-start">
                  {/* Este tag <h2> Oculto ayuda a decirle a Google exactamente qué es el contenido de esta tarjeta */}
                  <h2 className="sr-only">Ver {nombrePartido} en Vivo Gratis</h2>
                  
                  <article className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative h-full flex flex-col justify-between bg-white/[0.02]">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2">
                        <img 
                            src={imageUrl} 
                            alt={`Torneo de ${nombrePartido}`} 
                            className="w-6 h-6 rounded-full object-contain bg-white p-0.5 border border-secondary"
                            onError={(e) => { (e.target as HTMLImageElement).src = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`; }}
                        />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate w-32">
                            Torneo Oficial
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-slate-300 bg-white/10 px-3 py-1 rounded-lg text-xs font-black">
                          <Clock className="w-3 h-3 text-primary" /> {horaEvento.substring(0, 5)}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-center py-4">
                        <span className="text-lg md:text-xl font-black text-white text-center leading-tight line-clamp-3">
                          {nombrePartido}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full rounded-2xl py-6 font-black text-xs tracking-widest uppercase transition-all bg-gradient-to-r from-primary to-[#00d4ff] text-white hover:scale-[1.02] shadow-lg shadow-primary/20" asChild>
                      {/* Enlace a tu agenda real */}
                      <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer">
                        <Play className="mr-2 h-4 w-4 fill-current" /> Ver Transmisión Libre
                      </Link>
                    </Button>
                    <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0 rounded-[2rem]">
                        <span className="sr-only">Ir a la transmisión en vivo de {nombrePartido}</span>
                    </Link>
                  </article>
                </div>
              );
            })}
            
            {/* Tarjeta final para "Ver Todo" */}
            <Link href="https://oleadatvpremium.com/SportLive/agenda.html" target="_blank" rel="noopener noreferrer" className="min-w-[180px] flex flex-col items-center justify-center glass border border-dashed border-white/10 rounded-[2rem] hover:bg-white/5 hover:border-primary/50 transition-all snap-start group bg-white/[0.01]">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <ChevronRight className="w-6 h-6 text-primary" />
               </div>
               <span className="text-xs font-bold text-slate-300">Abrir Agenda Completa</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-400 font-bold">Cargando la mejor cartelera deportiva...</p>
          </div>
        )}
      </div>
    </section>
  )
}