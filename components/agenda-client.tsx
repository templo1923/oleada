"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, ChevronDown, PlayCircle, Clock, Activity } from "lucide-react"

export function AgendaClient({ matches, categoriasActivas, eventosPorCategoria, IMG_BASE }: any) {
  const [busqueda, setBusqueda] = useState("")
  const [expandido, setExpandido] = useState<number | null>(null) // Para abrir/cerrar canales

  // Función para crear el enlace codificado a ver.html
  const generarEnlaceVer = (rawUrl: string, titulo: string) => {
    let rFinal = "";
    if (rawUrl.includes('eventos.html?r=')) {
        rFinal = rawUrl.split('eventos.html?r=')[1];
        if (rFinal.includes('&')) rFinal = rFinal.split('&')[0]; 
    } else if (rawUrl.startsWith('http')) {
        rFinal = btoa(rawUrl);
    } else {
        rFinal = rawUrl;
    }
    const tituloCodificado = encodeURIComponent(titulo).replace(/'/g, "%27");
    return `https://oleadatvpremium.com/SportLive/ver.html?r=${rFinal}&n=${tituloCodificado}`;
  }

  // Filtramos todas las categorías según la búsqueda
  const eventosFiltrados = (eventos: any[]) => {
    if (!busqueda) return eventos;
    return eventos.filter(e => 
      e.attributes.diary_description.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  return (
    <div className="w-full">
      {/* BUSCADOR */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="Buscar equipo, torneo o deporte..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {matches.length > 0 ? (
        <Tabs defaultValue="TODOS" className="w-full">
          
          {/* PESTAÑAS (Categorías) */}
          <div className="w-full overflow-x-auto scrollbar-hide mb-8 pb-2">
            <TabsList className="bg-white/5 border border-white/10 rounded-2xl h-auto p-2 inline-flex gap-2 min-w-max">
              {categoriasActivas.map((cat: string) => {
                const count = eventosFiltrados(eventosPorCategoria[cat]).length;
                if (count === 0 && busqueda) return null; // Ocultar pestaña si la búsqueda la deja vacía

                return (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="rounded-xl px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[#00d4ff] data-[state=active]:text-white transition-all"
                  >
                    {cat} 
                    <span className="ml-2 bg-black/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {count}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* LISTADO DE EVENTOS (Estilo Agenda Original) */}
          {categoriasActivas.map((cat: string) => {
            const eventosMostrar = eventosFiltrados(eventosPorCategoria[cat]);

            return (
              <TabsContent key={cat} value={cat} className="mt-0 outline-none space-y-3">
                {eventosMostrar.length === 0 && (
                   <p className="text-center py-10 text-slate-500">No se encontraron eventos para "{busqueda}"</p>
                )}

                {eventosMostrar.map((match: any, index: number) => {
                  const attr = match.attributes;
                  const embeds = attr.embeds?.data || [];
                  const rawName = attr.diary_description || "Evento Deportivo";
                  const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
                  
                  let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || attr.country?.data?.attributes?.country_image;
                  if (!imageUrl) imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
                  else if (!imageUrl.startsWith('http')) imageUrl = `${IMG_BASE}${imageUrl}`;

                  const isOpen = expandido === index;

                  return (
                    <div key={index} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                      {/* Cabecera de la tarjeta */}
                      <div 
                        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setExpandido(isOpen ? null : index)}
                      >
                        <div className="text-sm font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg min-w-[70px] text-center">
                          {time}
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full p-1 border-2 border-[#1e3a8a] flex-shrink-0">
                          <img src={imageUrl} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`; }} />
                        </div>
                        <div className="flex-1 font-bold text-sm md:text-base text-white leading-tight">
                          {rawName}
                        </div>
                        <ChevronDown className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {/* Lista de Canales (Desplegable) */}
                      {isOpen && (
                        <div className="bg-[#0f172a] p-3 border-t border-white/5 space-y-2">
                          {embeds.length > 0 ? (
                            embeds.map((emb: any, idx: number) => {
                              const link = generarEnlaceVer(emb.attributes.embed_iframe, rawName);
                              return (
                                <a 
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-xl text-white font-bold text-sm hover:bg-primary/20 transition-all"
                                >
                                  <span className="flex items-center gap-2">
                                    <PlayCircle className="text-[#60a5fa] w-5 h-5" />
                                    {emb.attributes.embed_name}
                                  </span>
                                  <ChevronRight className="w-4 h-4 opacity-50" />
                                </a>
                              )
                            })
                          ) : (
                            <p className="text-slate-500 text-sm p-2">No hay transmisiones disponibles aún.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </TabsContent>
            )
          })}
        </Tabs>
      ) : (
        <div className="text-center py-20 glass rounded-[2rem] border border-white/5">
          <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-20 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-2">No hay eventos programados</h3>
          <p className="text-slate-400">Vuelve más tarde para ver la mejor cartelera deportiva.</p>
        </div>
      )}
    </div>
  )
}