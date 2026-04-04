"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ChevronRight, Play, Trophy, Zap, Timer, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Team {
  name: string
  logo: string
  score: number | null
}

interface League {
  name: string
  logo: string
  country: string
}

interface Match {
  id: number
  homeTeam: Team
  awayTeam: Team
  league: League
  status: string
  statusLong: string
  elapsed: number | null
  date: string
  venue: string | null
  isLive: boolean
  slug: string
}

export function SportsSection() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all")
  const [sport, setSport] = useState("football")
  const [updates, setUpdates] = useState({ last: "--:--", next: "--:--" })
  const [mounted, setMounted] = useState(false)

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/sports?sport=${sport}`)
      const json = await res.json()
      setMatches(json.matches || [])
      
      if (json.updateInfo) {
        setUpdates({ last: json.updateInfo.lastUpdate, next: json.updateInfo.nextUpdate })
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchMatches()
    const interval = setInterval(fetchMatches, 60000)
    return () => clearInterval(interval)
  }, [sport])

  // 1. Filtrar según el estado (Todos, En Vivo, Próximos)
  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true
    if (filter === "live") return match.isLive
    if (filter === "upcoming") return match.status === "NS" || !match.isLive
    return true
  })

  // 🚀 2. MAGIA DE ARQUITECTURA: Agrupar los partidos por Liga
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const leagueName = match.league.name || "Otros Torneos"
    if (!groups[leagueName]) {
      groups[leagueName] = { league: match.league, matches: [] }
    }
    groups[leagueName].matches.push(match)
    return groups
  }, {} as Record<string, { league: League; matches: Match[] }>)

  // Convertimos el objeto en array para poder ordenarlo y dibujarlo
  const groupedArray = Object.values(groupedMatches)

  // Ordenamos: Ligas con partidos EN VIVO van primero. Si hay empate, por cantidad de partidos.
  groupedArray.sort((a, b) => {
    const aHasLive = a.matches.some(m => m.isLive)
    const bHasLive = b.matches.some(m => m.isLive)
    if (aHasLive && !bHasLive) return -1
    if (!aHasLive && bHasLive) return 1
    return b.matches.length - a.matches.length
  })

  // Como es el Home, solo mostramos las top 5 ligas para no hacer una página infinita
  const displayGroups = groupedArray.slice(0, 5)

  const liveCount = matches.filter((m) => m.isLive).length

  const formatTime = (dateString: string) => {
    if (!mounted) return "--:--"
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-CO", { 
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/Bogota" 
    })
  }

  const sportsMenu = [
    { id: "football", label: "Fútbol", icon: "⚽" },
    { id: "nba", label: "NBA", icon: "🏀" },
    { id: "f1", label: "F1", icon: "🏎️" },
    { id: "mma", label: "MMA", icon: "🥊" }
  ]

  return (
    <section className="py-16 lg:py-24 section-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-destructive glow-orange">
                <Activity className="h-5 w-5 text-background" />
              </div>
              <span className="text-sm font-medium text-accent uppercase tracking-wider">Marcadores Globales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Agenda en Vivo</h2>
          </div>
          
          {/* Info de Sincronización SEO */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest font-black">
            <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Sinc.: {updates.last}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
              <Timer className="w-3.5 h-3.5" />
              <span>Próx.: {updates.next}</span>
            </div>
          </div>
        </div>

        {/* 🚀 MENÚS UNIFICADOS Y LIMPIOS */}
        <div className="glass p-2 rounded-2xl border border-white/5 mb-10 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Selector de Deporte */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-hide">
            {sportsMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setSport(item.id)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 text-sm ${
                  sport === item.id 
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-px h-8 bg-white/10"></div>

          {/* Selector de Estado */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto bg-black/20 p-1 rounded-xl">
            {[
              { key: "all", label: "Todas las Ligas" },
              { key: "live", label: `En Vivo (${liveCount})` },
              { key: "upcoming", label: "Próximos" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filter === item.key
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 DIBUJO DE PARTIDOS AGRUPADOS POR LIGA */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-12">
            {displayGroups.map((group, idx) => (
              <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* CABECERA DE LA LIGA */}
                <div className="flex items-center gap-3 mb-5 px-5 py-3 bg-white/5 rounded-2xl border border-white/10 w-fit backdrop-blur-sm">
                  <div className="w-6 h-6 relative flex-shrink-0">
                    {group.league.logo ? (
                      <Image src={group.league.logo} alt={group.league.name} fill className="object-contain" />
                    ) : (
                      <Trophy className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <h3 className="font-bold text-white uppercase tracking-wider text-sm">{group.league.name}</h3>
                  <span className="text-[10px] text-slate-300 font-bold bg-black/30 px-2 py-1 rounded-md ml-2 border border-white/5">
                    {group.matches.length} eventos
                  </span>
                </div>

                {/* TARJETAS DE LA LIGA */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.matches.map((match) => (
                    <article key={match.id} className="group relative rounded-2xl glass overflow-hidden card-hover flex flex-col justify-between border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                      
                      {/* Estado del Partido (Top) */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs font-semibold">{formatTime(match.date)}</span>
                        </div>
                        {match.isLive ? (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-destructive/20 text-destructive text-[10px] font-black tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                            {match.elapsed ? `${match.elapsed}'` : "LIVE"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{match.status}</span>
                        )}
                      </div>

                      {/* Equipos */}
                      <div className="p-4 flex-grow flex flex-col justify-center gap-4">
                        {/* Local */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-8 h-8 rounded-full bg-white/5 p-1 flex-shrink-0">
                              {match.homeTeam.logo ? (
                                <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain p-1" />
                              ) : (
                                <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">{match.homeTeam.name.substring(0, 2)}</span>
                              )}
                            </div>
                            <span className="font-semibold text-white truncate text-sm">{match.homeTeam.name}</span>
                          </div>
                          {match.homeTeam.score !== null && (
                            <span className="text-xl font-black text-white ml-2">{match.homeTeam.score}</span>
                          )}
                        </div>

                        {/* Visitante */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-8 h-8 rounded-full bg-white/5 p-1 flex-shrink-0">
                              {match.awayTeam.logo ? (
                                <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain p-1" />
                              ) : (
                                <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">{match.awayTeam.name.substring(0, 2)}</span>
                              )}
                            </div>
                            <span className="font-semibold text-white truncate text-sm">{match.awayTeam.name}</span>
                          </div>
                          {match.awayTeam.score !== null && (
                            <span className="text-xl font-black text-white ml-2">{match.awayTeam.score}</span>
                          )}
                        </div>
                      </div>

                      {/* Botón Inferior */}
                      <div className="p-4 pt-0">
                        <Button 
                          className={`w-full z-10 relative ${
                            match.isLive 
                              ? "bg-destructive hover:bg-destructive/90 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] border-none" 
                              : "bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white"
                          } font-semibold h-10`}
                          asChild
                        >
                          <Link href={`/partido/${match.slug}`}>
                            {match.isLive ? (
                              <><Play className="mr-2 h-3.5 w-3.5 fill-current" /> Ver Transmisión</>
                            ) : (
                              "Detalles y Canales"
                            )}
                          </Link>
                        </Button>
                      </div>

                      {/* Overlay Click */}
                      <Link href={`/partido/${match.slug}`} className="absolute inset-0 z-0">
                          <span className="sr-only">Ir a detalles del evento</span>
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredMatches.length === 0 && (
          <div className="text-center py-16 glass rounded-3xl border border-white/5">
            <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Sin eventos programados</h3>
            <p className="text-slate-400 max-w-md mx-auto">No hay información deportiva para mostrar en este momento según los filtros seleccionados.</p>
          </div>
        )}

        {/* Ver Agenda Completa */}
        {displayGroups.length > 0 && (
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl h-14 px-8 group z-10 relative" asChild>
              <Link href="/agenda-deportiva">
                <Calendar className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                Explorar el Directorio Completo de Ligas
                <ChevronRight className="ml-2 h-5 w-5 text-slate-500" />
              </Link>
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}