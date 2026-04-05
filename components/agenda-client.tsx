"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, Activity, Play, Zap, ChevronDown, PlayCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

function textoPuro(html: string) {
  if (!html) return "Evento Deportivo";
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export function AgendaClient({ matches, categoriasActivas, eventosPorCategoria, IMG_BASE }: any) {
  const [busqueda, setBusqueda] = useState("")
  const [expandido, setExpandido] = useState<number | null>(null)

  // Enlace para ver el partido
  const generarEnlaceVer = (emb: any, rawName: string) => {
    const rawUrl = emb.attributes.embed_iframe;
    let rFinal = "";
    
    if (rawUrl.includes('eventos.html?r=')) {
        rFinal = rawUrl.split('eventos.html?r=')[1];
        if (rFinal.includes('&')) rFinal = rFinal.split('&')[0]; 
    } else if (rawUrl.startsWith('http')) {
        rFinal = btoa(rawUrl);
    } else {
        rFinal = rawUrl;
    }
    
    const tituloCodificado = encodeURIComponent(rawName).replace(/'/g, "%27");
    return `https://oleadatvpremium.com/SportLive/ver.html?r=${rFinal}&n=${tituloCodificado}`;
  }

  // Filtrar eventos por el buscador
  const eventosFiltrados = (eventos: any[]) => {
    if (!busqueda) return eventos;
    return eventos.filter(e => {
      const nombreLimpio = textoPuro(e.attributes.diary_description).toLowerCase();
      return nombreLimpio.includes(busqueda.toLowerCase());
    });
  }

  return (
    <div className="w-full">
      {/* Buscador */}
      <div className="relative mb-10 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg"
          placeholder="Buscar equipo, torneo o deporte..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {matches.length > 0 ? (
        <Tabs defaultValue="TODOS" className="w-full">
          
          {/* Botones de Categorías */}
          <div className="w-full overflow-x-auto scrollbar-hide mb-8 pb-4">
            <TabsList className="bg-white/5 border border-white/10 rounded-2xl h-auto p-2 inline-flex gap-2 min-w-max">
              {categoriasActivas.map((cat: string) => {
                const count = eventosFiltrados(eventosPorCategoria[cat]).length;
                if (count === 0 && busqueda) return null;

                return (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="rounded-xl px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[#00d4ff] data-[state=active]:text-white transition-all shadow-none data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
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

          {/* Contenedor de Tarjetas */}
          {categoriasActivas.map((cat: string) => {
            const eventosMostrar = eventosFiltrados(eventosPorCategoria[cat]);

            return (
              <TabsContent key={cat} value={cat} className="mt-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {eventosMostrar.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-500">No se encontraron eventos para "{busqueda}"</div>
                  )}

                  {/* AQUÍ VA TU DISEÑO FAVORITO */}
                  {eventosMostrar.map((match: any, index: number) => {
                    const attr = match.attributes;
                    const embeds = attr.embeds?.data || [];
                    const rawName = textoPuro(attr.diary_description);
                    const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
                    const categoriaInfo = match.categoriaAsignada;
                    
                    // Simula "En Vivo" solo si el usuario no ha buscado nada específico
                    const isLive = index < 3 && !busqueda; 

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

                    let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || attr.country?.data?.attributes?.country_image;
                    if (!imageUrl) imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
                    else if (!imageUrl.startsWith('http')) imageUrl = `${IMG_BASE}${imageUrl}`;

                    const isOpen = expandido === index;

                    return (
                      <article key={index} className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative flex flex-col justify-between bg-white/[0.02]">
                        <h2 className="sr-only">Ver partido {rawName} en vivo gratis</h2>
                        
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
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden pr-2">
                              <div className="w-10 h-10 bg-white rounded-full p-1.5 flex-shrink-0 flex items-center justify-center border border-white/20">
                                <img src={imageUrl} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`; }}/>
                              </div>
                              <span className="text-base font-bold text-white line-clamp-2 leading-tight" title={homeTeam}>
                                {homeTeam}
                              </span>
                            </div>
                          </div>

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

                        {/* Opciones de canales */}
                        {isOpen ? (
                          <div className="bg-[#0f172a] p-3 border border-white/10 rounded-2xl space-y-2 mb-2 animate-in slide-in-from-top-2">
                            {embeds.length > 0 ? (
                              embeds.map((emb: any, idx: number) => (
                                <a 
                                  key={idx}
                                  href={generarEnlaceVer(emb, rawName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-3 bg-primary/10 border border-primary/20 rounded-xl text-white font-bold text-sm hover:bg-primary/20 transition-all cursor-pointer"
                                >
                                  <PlayCircle className="text-[#60a5fa] w-4 h-4 mr-2" />
                                  {emb.attributes.embed_name}
                                </a>
                              ))
                            ) : (
                              <p className="text-slate-500 text-xs p-2 text-center">Sin canales asignados.</p>
                            )}
                          </div>
                        ) : null}

                        {/* Botón Principal (Abre canales si hay varios, o manda al primero) */}
                        <Button 
                          onClick={() => setExpandido(isOpen ? null : index)}
                          className={`w-full rounded-2xl py-6 font-black text-xs tracking-widest uppercase transition-all z-10 ${isLive ? "bg-gradient-to-r from-primary to-[#00d4ff] text-white hover:scale-[1.02] shadow-lg shadow-primary/20" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-primary/50"}`} 
                        >
                          <Play className="mr-2 h-4 w-4 fill-current" /> {isOpen ? 'Cerrar Opciones' : 'Ver Transmisión'}
                        </Button>
                      </article>
                    )
                  })}
                </div>
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