"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Play, Trophy, ChevronRight, ChevronDown, RefreshCw, AlertCircle, Zap } from "lucide-react"
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
  country?: string
}

interface Match {
  id: number
  homeTeam: Team
  awayTeam: Team
  league: League
  status: string
  statusLong?: string
  elapsed: number | null
  date: string
  venue?: string | null
  isLive: boolean
  slug: string
}

interface LeagueGroup {
  league: League
  matches: Match[]
  hasLive: boolean
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  "1H": { label: "1er Tiempo", color: "destructive" },
  "2H": { label: "2do Tiempo", color: "destructive" },
  "HT": { label: "Descanso", color: "accent" },
  "Q1": { label: "1er Cuarto", color: "destructive" },
  "Q2": { label: "2do Cuarto", color: "destructive" },
  "Q3": { label: "3er Cuarto", color: "destructive" },
  "Q4": { label: "4to Cuarto", color: "destructive" },
  "ET": { label: "Tiempo Extra", color: "destructive" },
  "P": { label: "Penales", color: "destructive" },
  "LIVE": { label: "EN VIVO", color: "destructive" },
  "Live": { label: "EN VIVO", color: "destructive" },
  "FT": { label: "Finalizado", color: "muted" },
  "AET": { label: "Final TE", color: "muted" },
  "PEN": { label: "Final Pen", color: "muted" },
  "NS": { label: "Por Jugar", color: "primary" },
  "TBD": { label: "Por Definir", color: "muted" },
  "PST": { label: "Pospuesto", color: "muted" },
  "CANC": { label: "Cancelado", color: "muted" },
}

export function AgendaGrid() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  
  const [sport, setSport] = useState("football")

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/sports?sport=${sport}`)
      const data = await res.json()
      
      setMatches(data.matches || data.data || [])
      setIsDemo(data.isDemo || false)
      
      if (data.updateInfo) {
        setLastUpdate(data.updateInfo.lastUpdate)
      } else {
        setLastUpdate(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota" }))
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
    
    const interval = setInterval(() => {
      fetchMatches()
    }, 60000)

    return () => clearInterval(interval)
  }, [sport])

  // Agrupar partidos por liga (estilo FlashScore)
  const groupedByLeague = useMemo(() => {
    const groups: Record<string, LeagueGroup> = {}
    
    matches.forEach((match) => {
      const leagueName = match.league?.name || "Otros Eventos"
      if (!groups[leagueName]) {
        groups[leagueName] = {
          league: match.league || { name: leagueName, logo: "" },
          matches: [],
          hasLive: false
        }
      }
      groups[leagueName].matches.push(match)
      if (match.isLive) {
        groups[leagueName].hasLive = true
      }
    })
    
    // Ordenar: primero ligas con partidos en vivo, luego por cantidad de partidos
    return Object.values(groups).sort((a, b) => {
      if (a.hasLive && !b.hasLive) return -1
      if (!a.hasLive && b.hasLive) return 1
      return b.matches.length - a.matches.length
    })
  }, [matches])

  const liveMatches = matches.filter((m) => m.isLive)
  const totalLive = liveMatches.length

  const formatTime = (dateString: string) => {
    if (!mounted) return "--:--"
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota" })
  }

  const sportsMenu = [
    { id: "football", label: "Fútbol", icon: "⚽" },
    { id: "nba", label: "NBA", icon: "🏀" },
    { id: "f1", label: "Fórmula 1", icon: "🏎️" },
    { id: "mma", label: "UFC / MMA", icon: "🥊" }
  ]

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto w-full pb-4 mb-6 scrollbar-hide">
        {sportsMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => setSport(item.id)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 text-sm ${
              sport === item.id 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-primary" 
                : "glass text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </div>

      {isDemo && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl glass border border-accent/30">
          <AlertCircle className="h-5 w-5 text-accent" />
          <p className="text-sm text-muted-foreground">
            Mostrando datos de demostración. Configura tu API Key en el panel.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {lastUpdate && mounted && (
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-xs">
                <Zap className="w-3 h-3" />
                Sincronizado: {lastUpdate}
             </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={fetchMatches} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <Skeleton className="h-14 w-full" />
              <div className="p-4 space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton key={j} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Resumen de partidos en vivo */}
          {totalLive > 0 && (
            <div className="mb-6 p-4 glass rounded-2xl border border-destructive/30 bg-destructive/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    EN VIVO
                  </span>
                  <span className="text-foreground font-semibold">{totalLive} partidos en directo ahora</span>
                </div>
                <Zap className="w-5 h-5 text-destructive" />
              </div>
            </div>
          )}

          {/* Vista agrupada por Liga (estilo FlashScore) */}
          <div className="space-y-4">
            {groupedByLeague.slice(0, showAll ? groupedByLeague.length : 10).map((group, index) => (
              <LeagueSection 
                key={`${group.league.name}-${index}`} 
                group={group} 
                formatTime={formatTime}
              />
            ))}
          </div>

          {groupedByLeague.length > 10 && !showAll && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(true)}
                className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50"
              >
                Ver Todas las Ligas ({groupedByLeague.length})
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {matches.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Cartelera en pausa</h3>
              <p className="text-muted-foreground">No hay eventos programados en esta categoria para hoy.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Componente de seccion de liga (estilo FlashScore)
function LeagueSection({ 
  group, 
  formatTime 
}: { 
  group: LeagueGroup
  formatTime: (date: string) => string 
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      {/* Header de la Liga */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 hover:bg-secondary/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-background/50">
            {group.league.logo ? (
              <Image 
                src={group.league.logo} 
                alt={group.league.name} 
                fill 
                className="object-contain p-1" 
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-[10px] font-bold text-foreground">
                {group.league.name?.substring(0, 3) || "LIG"}
              </span>
            )}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-foreground text-sm">{group.league.name}</h3>
            <span className="text-xs text-muted-foreground">{group.matches.length} partidos</span>
          </div>
          {group.hasLive && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {/* Lista de partidos */}
      {isExpanded && (
        <div className="divide-y divide-white/5">
          {group.matches.map((match) => (
            <MatchRow key={match.id} match={match} formatTime={formatTime} />
          ))}
        </div>
      )}
    </div>
  )
}

// Componente de fila de partido compacto (estilo FlashScore)
function MatchRow({ 
  match, 
  formatTime 
}: { 
  match: Match
  formatTime: (date: string) => string 
}) {
  const statusInfo = STATUS_MAP[match.status] || { label: match.status || "Por Jugar", color: "muted" }
  const isFinished = ["FT", "AET", "PEN"].includes(match.status)

  return (
    <Link 
      href={`/partido/${match.slug}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group"
    >
      {/* Hora / Estado */}
      <div className="w-16 flex-shrink-0 text-center">
        {match.isLive ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-destructive font-bold text-sm">
              {match.elapsed ? `${match.elapsed}'` : "LIVE"}
            </span>
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          </div>
        ) : isFinished ? (
          <span className="text-muted-foreground text-xs font-medium">FIN</span>
        ) : (
          <span className="text-foreground font-semibold text-sm">{formatTime(match.date)}</span>
        )}
      </div>

      {/* Equipos y Marcador */}
      <div className="flex-1 min-w-0">
        {/* Local */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative w-5 h-5 rounded-full overflow-hidden bg-secondary flex-shrink-0">
              {match.homeTeam.logo ? (
                <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain" />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-[8px] font-bold">
                  {match.homeTeam.name?.substring(0, 2) || "L"}
                </span>
              )}
            </div>
            <span className="text-foreground text-sm truncate">{match.homeTeam.name}</span>
          </div>
          {match.homeTeam.score !== null && (
            <span className={`font-bold text-sm ml-2 ${match.isLive ? "text-foreground" : "text-muted-foreground"}`}>
              {match.homeTeam.score}
            </span>
          )}
        </div>
        {/* Visitante */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative w-5 h-5 rounded-full overflow-hidden bg-secondary flex-shrink-0">
              {match.awayTeam.logo ? (
                <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain" />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-[8px] font-bold">
                  {match.awayTeam.name?.substring(0, 2) || "V"}
                </span>
              )}
            </div>
            <span className="text-foreground text-sm truncate">{match.awayTeam.name}</span>
          </div>
          {match.awayTeam.score !== null && (
            <span className={`font-bold text-sm ml-2 ${match.isLive ? "text-foreground" : "text-muted-foreground"}`}>
              {match.awayTeam.score}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0">
        <span className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
          match.isLive 
            ? "bg-destructive/20 text-destructive group-hover:bg-destructive group-hover:text-white" 
            : "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-background"
        }`}>
          <Play className="w-4 h-4 fill-current" />
        </span>
      </div>
    </Link>
  )
}
