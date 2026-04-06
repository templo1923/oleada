"use client"

import Link from "next/link"
import { Play, Clock, Zap, ChevronRight, Tv, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function SportsClient({ matches, IMG_BASE }: { matches: any[], IMG_BASE: string }) {
  // Agrupar eventos por categoría
  const eventosPorCategoria: Record<string, any[]> = {};
  matches.forEach(match => {
    const deporte = match.categoriaAsignada.nombre;
    if (!eventosPorCategoria[deporte]) eventosPorCategoria[deporte] = [];
    eventosPorCategoria[deporte].push(match);
  });

  // Ordenar pestañas para que Fútbol siempre sea el primero
  const ordenPrioridad = ["FÚTBOL", "BASKET", "TENIS", "MOTOR", "COMBATE", "BÉISBOL", "FUTBOL AMER.", "VOLEIBOL"];
  const categoriasActivas = Object.keys(eventosPorCategoria).sort((a, b) => {
    let idxA = ordenPrioridad.indexOf(a);
    let idxB = ordenPrioridad.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  }).slice(0, 4); // Mostramos máximo 4 pestañas en el inicio para no saturar

  const defaultTab = categoriasActivas.length > 0 ? categoriasActivas[0] : "";

  if (matches.length === 0 || !defaultTab) {
    return (
      <div className="text-center py-12 glass rounded-[2rem] border border-white/5">
        <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20 animate-pulse" />
        <p className="text-slate-400 font-bold">No hay eventos próximos en esta franja horaria.</p>
        <Button variant="link" className="mt-2 text-primary" asChild>
           <Link href="/agenda-deportiva">Ver la agenda completa de hoy</Link>
        </Button>
      </div>
    )
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      {/* CABECERA CON PESTAÑAS Y BOTÓN VER MÁS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="w-full overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
            <TabsList className="bg-white/5 border border-white/10 rounded-2xl h-auto p-1.5 inline-flex gap-1.5 min-w-max">
              {categoriasActivas.map((cat: string) => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="rounded-xl px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[#00d4ff] data-[state=active]:text-white transition-all shadow-none data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Button variant="outline" className="hidden sm:flex border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider" asChild>
              <Link href="/agenda-deportiva">
                  Ver Toda la Agenda <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
          </Button>
      </div>

      {/* CONTENIDO DE CADA PESTAÑA */}
      {categoriasActivas.map((cat: string) => (
        <TabsContent key={cat} value={cat} className="mt-0 outline-none">
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x select-none w-full">
             
             {eventosPorCategoria[cat].slice(0, 8).map((match: any, index: number) => {
                const attr = match.attributes;
                const time = (attr.diary_hour || attr.diary_time || "00:00").substring(0, 5);
                const rawName = match.nombrePuro;
                const categoriaInfo = match.categoriaAsignada;
                const isLive = match.isLive;

                let homeTeam = rawName;
                let awayTeam = "Transmisión HD";
                if (rawName.toLowerCase().includes(" vs ")) {
                  const parts = rawName.split(/ vs /i);
                  homeTeam = parts[0].trim(); awayTeam = parts[1] ? parts[1].trim() : "Transmisión";
                } else if (rawName.toLowerCase().includes(" x ")) {
                  const parts = rawName.split(/ x /i);
                  homeTeam = parts[0].trim(); awayTeam = parts[1] ? parts[1].trim() : "Transmisión";
                }

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
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${isLive ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-white/10 text-slate-300'}`}>
                          {isLive ? <Zap className="w-3 h-3 fill-current" /> : <Clock className="w-3 h-3" />} {isLive ? 'LIVE' : time}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 mb-8 flex-1 justify-center">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center shadow-inner">
                            <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                             <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight line-clamp-3 uppercase" title={rawName}>{rawName}</h3>
                             <div className="flex items-center gap-1.5 mt-2 bg-white/5 w-fit px-2 py-0.5 rounded border border-white/5">
                               <Tv className="w-3 h-3 text-slate-500" />
                               <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase">Transmisión HD</span>
                             </div>
                          </div>
                        </div>
                      </div>

                      <Button className={`w-full rounded-2xl py-5 sm:py-6 font-black text-[10px] sm:text-xs tracking-widest uppercase transition-all ${isLive ? "bg-gradient-to-r from-primary to-[#00d4ff] text-white" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"}`} asChild>
                        <Link href="/agenda-deportiva">Ver Transmisión</Link>
                      </Button>
                      <Link href="/agenda-deportiva" className="absolute inset-0 z-0 rounded-[2rem]">
                        <span className="sr-only">Abrir {rawName}</span>
                      </Link>
                    </article>
                  </div>
                )
             })}

             <Link href="/agenda-deportiva" className="min-w-[180px] flex flex-col items-center justify-center glass border border-dashed border-white/10 rounded-[2rem] hover:bg-white/5 hover:border-primary/50 transition-all snap-start group">
               <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <ChevronRight className="w-7 h-7 text-primary" />
               </div>
               <span className="text-sm font-bold text-slate-300">Agenda Completa</span>
            </Link>

          </div>
        </TabsContent>
      ))}

      {/* Botón Ver Más (Móvil) */}
      <Button variant="outline" className="w-full sm:hidden border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider mt-2" asChild>
          <Link href="/agenda-deportiva">
              Ver Toda la Agenda <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
      </Button>
    </Tabs>
  )
}