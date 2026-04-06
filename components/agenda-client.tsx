"use client"

import { useState } from "react"
import { Search, Clock, Activity, Play, Zap, ChevronDown, PlayCircle, Tv } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Limpiador para el nombre del evento
function textoPuro(html: string) {
  if (!html) return "Evento Deportivo";
  let limpio = html.replace(/<[^>]*>?/gm, '').trim();
  limpio = limpio.replace(/\[.*?\]/g, '').replace(/(INGLÉS|ESPAÑOL|VARIOS|PORTUGUÉS|LATINO|CASTELLANO|FRENCH|GERMAN)/gi, '').trim();
  return limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');
}

// Limpiador especial para los nombres de los canales
function limpiarCanal(html: string) {
  if (!html) return "Transmisión";
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export function AgendaClient({ matches, categoriasActivas, eventosPorCategoria, IMG_BASE }: any) {
  const [busqueda, setBusqueda] = useState("")
  const [expandido, setExpandido] = useState<number | null>(null)

  // Enlace para ver el partido
// 🚨 GENERADOR DE URLS SEO (El Santo Grial) 🚨
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
    
    // 1. Creamos el "slug" para Google (ej: real-madrid-vs-barcelona)
    const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tituloCodificado = encodeURIComponent(rawName).replace(/'/g, "%27");
    
    // 2. Mandamos al usuario a nuestra PÁGINA INTERNA DE SEO
    return `/partido/${slug}?r=${rFinal}&n=${tituloCodificado}`;
  }

  // Filtrar eventos por el buscador
  const eventosFiltrados = (eventos: any[]) => {
    if (!busqueda) return eventos;
    return eventos.filter(e => {
      const nombreLimpio = textoPuro(e.attributes.diary_description).toLowerCase();
      return nombreLimpio.includes(busqueda.toLowerCase());
    });
  }

  // Obtenemos hora actual en minutos para el botón LIVE
  const d = new Date();
  const localTime = d.toLocaleTimeString('en-US', { timeZone: 'America/Bogota', hour12: false, hour: 'numeric', minute: 'numeric' });
  const [currH, currM] = localTime.split(':').map(Number);
  const currentMinutes = (currH * 60) + currM;

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

                  {/* DISEÑO PREMIUM ACTUALIZADO (Con logo grande a la izquierda) */}
                  {eventosMostrar.map((match: any, index: number) => {
                    const attr = match.attributes;
                    const embeds = attr.embeds?.data || [];
                    const rawName = textoPuro(attr.diary_description);
                    const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
                    const categoriaInfo = match.categoriaAsignada;
                    
                    // Cálculo de "LIVE" (Si empezó en las últimas 2 horas o empieza en 5 minutos)
                    const [evH, evM] = time.split(':').map(Number);
                    const eventMinutes = (evH * 60) + evM;
                    const diff = eventMinutes - currentMinutes;
                    const isLive = diff <= 5 && diff >= -110;

                    let imageUrl = attr.country?.data?.attributes?.image?.data?.attributes?.url || attr.country?.data?.attributes?.country_image;
                    if (!imageUrl) imageUrl = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`;
                    else if (!imageUrl.startsWith('http')) imageUrl = `${IMG_BASE}${imageUrl}`;

                    const isOpen = expandido === index;

                    return (
                      <article key={index} className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative flex flex-col justify-between bg-white/[0.02] shadow-lg">
                        
                        {/* ENCABEZADO (Categoría y Hora/Live) */}
                        <div className="flex justify-between items-center mb-6">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${categoriaInfo.color}`}>
                            {categoriaInfo.icono} {categoriaInfo.nombre}
                          </span>

                          {isLive ? (
                            <div className="flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse">
                              <Zap className="w-3 h-3 fill-current" /> LIVE
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-bold">
                              <Clock className="w-3 h-3" /> {time}
                            </div>
                          )}
                        </div>

                        {/* CUERPO (Logo a la izquierda, Texto a la derecha) */}
                        <div className="flex flex-col gap-4 mb-8 flex-1 justify-center cursor-pointer" onClick={() => setExpandido(isOpen ? null : index)}>
                          <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-white rounded-2xl p-1.5 flex-shrink-0 flex items-center justify-center shadow-md">
  <img src={imageUrl} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `${IMG_BASE}/uploads/sin_imagen_d36205f0e8.png`; }}/>
</div>
                            
                            <div className="flex-1 overflow-hidden">
                               <h3 className="text-base md:text-lg font-bold text-white leading-tight line-clamp-3" title={rawName}>
                                 {rawName}
                               </h3>
                               <div className="flex items-center gap-2 mt-2">
                                 <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                                   <Tv className="w-3 h-3 text-slate-400" />
                                   <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">Transmisión HD</span>
                                 </div>
                               </div>
                            </div>
                          </div>
                        </div>

                        {/* OPCIONES DE CANALES (Desplegable limpio) */}
                        {isOpen ? (
                          <div className="bg-[#0f172a] p-3 border border-white/10 rounded-2xl space-y-2 mb-4 animate-in slide-in-from-top-2">
                            {embeds.length > 0 ? (
                              embeds.map((emb: any, idx: number) => {
                                const nombreCanal = limpiarCanal(emb.attributes.embed_name);
                                return (
                                  <a 
                                    key={idx}
                                    href={generarEnlaceVer(emb, rawName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-3 bg-primary/10 border border-primary/20 rounded-xl text-white font-bold text-sm hover:bg-primary/20 transition-all cursor-pointer"
                                  >
                                    <PlayCircle className="text-[#60a5fa] w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{nombreCanal}</span>
                                  </a>
                                )
                              })
                            ) : (
                              <p className="text-slate-500 text-xs p-2 text-center">Sin canales asignados aún.</p>
                            )}
                          </div>
                        ) : null}

                        {/* BOTÓN PRINCIPAL */}
                        <Button 
                          onClick={() => setExpandido(isOpen ? null : index)}
                          className={`w-full rounded-2xl py-6 font-black text-xs tracking-widest uppercase transition-all z-10 ${isLive ? "bg-gradient-to-r from-primary to-[#00d4ff] text-white hover:scale-[1.02] shadow-lg shadow-primary/20" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-primary/50"}`} 
                        >
                          <Play className="mr-2 h-4 w-4 fill-current" /> {isOpen ? 'Ocultar Opciones' : 'Ver Transmisión'}
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