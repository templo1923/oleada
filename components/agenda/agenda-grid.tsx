"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Play, Trophy, MapPin, ChevronRight, Tv, RefreshCw, AlertCircle, Zap } from "lucide-react"
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
  slug: string // 🚀 Añadimos el slug para las URLs SEO
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

  const liveMatches = matches.filter((m) => m.isLive)
  const upcomingMatches = matches.filter((m) => !m.isLive && m.status === "NS")
  const finishedMatches = matches.filter((m) => ["FT", "AET", "PEN"].includes(m.status))

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {liveMatches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  EN VIVO AHORA
                </span>
                <span className="text-sm text-muted-foreground">{liveMatches.length} eventos</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} featured formatTime={formatTime} />
                ))}
              </div>
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Próximos Eventos</h2>
                <span className="text-sm text-muted-foreground">({upcomingMatches.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {upcomingMatches.slice(0, showAll ? upcomingMatches.length : 8).map((match) => (
                  <MatchCard key={match.id} match={match} formatTime={formatTime} />
                ))}
              </div>
            </div>
          )}

          {finishedMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold text-foreground">Finalizados</h2>
                <span className="text-sm text-muted-foreground">({finishedMatches.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {finishedMatches.slice(0, showAll ? finishedMatches.length : 4).map((match) => (
                  <MatchCard key={match.id} match={match} formatTime={formatTime} />
                ))}
              </div>
            </div>
          )}

          {matches.length > 8 && !showAll && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(true)}
                className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50"
              >
                Ver Todos los Eventos ({matches.length})
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {matches.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Cartelera en pausa</h3>
              <p className="text-muted-foreground">No hay eventos programados en esta categoría para hoy.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MatchCard({ 
  match, 
  featured = false,
  formatTime 
}: { 
  match: Match
  featured?: boolean
  formatTime: (date: string) => string
}) {
  const statusInfo = STATUS_MAP[match.status] || { label: match.status || "Por Jugar", color: "muted" }

  return (
    <article className={`group relative rounded-2xl glass overflow-hidden card-hover ${featured ? "lg:flex" : "flex flex-col"}`}>
      {/* League Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border/50 ${featured ? "lg:hidden" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-secondary">
            {match.league.logo ? (
              <Image src={match.league.logo} alt={match.league.name} fill className="object-contain p-1" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">
                {match.league.name ? match.league.name.substring(0, 3) : "VIP"}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-medium text-foreground">{match.league.name}</span>
          </div>
        </div>
        {match.isLive ? (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            {match.elapsed ? `${match.elapsed}'` : statusInfo.label}
          </span>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${statusInfo.color}/20 text-${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        )}
      </div>

      {/* Featured Layout - League Info on Left */}
      {featured && (
        <div className="hidden lg:flex flex-col justify-center items-center w-32 bg-gradient-to-b from-secondary to-muted/50 px-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary mb-2">
            {match.league.logo ? (
              <Image src={match.league.logo} alt={match.league.name} fill className="object-contain p-2" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-lg font-bold">
                {match.league.name ? match.league.name.substring(0, 2) : "VIP"}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-foreground text-center uppercase tracking-wider">{match.league.name}</span>
          {match.isLive && (
            <span className="mt-2 flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              {match.elapsed ? `${match.elapsed}'` : "LIVE"}
            </span>
          )}
        </div>
      )}

      {/* Match Content */}
      <div className={`p-4 flex-1 flex flex-col justify-between ${featured ? "lg:p-6" : ""}`}>
        <div className="flex flex-col gap-3 mb-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                {match.homeTeam.logo ? (
                  <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain p-1" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">
                    {match.homeTeam.name ? match.homeTeam.name.substring(0, 2) : "L"}
                  </span>
                )}
              </div>
              <span className={`font-semibold text-foreground truncate ${featured ? "text-lg" : "text-sm"}`}>
                {match.homeTeam.name}
              </span>
            </div>
            {match.homeTeam.score !== null && (
              <span className={`font-bold text-foreground ml-3 ${featured ? "text-2xl" : "text-lg"}`}>
                {match.homeTeam.score}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                {match.awayTeam.logo ? (
                  <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain p-1" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">
                    {match.awayTeam.name ? match.awayTeam.name.substring(0, 2) : "V"}
                  </span>
                )}
              </div>
              <span className={`font-semibold text-foreground truncate ${featured ? "text-lg" : "text-sm"}`}>
                {match.awayTeam.name}
              </span>
            </div>
            {match.awayTeam.score !== null && (
              <span className={`font-bold text-foreground ml-3 ${featured ? "text-2xl" : "text-lg"}`}>
                {match.awayTeam.score}
              </span>
            )}
          </div>
        </div>

        {/* CTA & Time */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">{formatTime(match.date)}</span>
            </div>
          </div>
          
          <Button 
            className={`w-full z-10 relative ${
              match.isLive 
                ? "bg-destructive hover:bg-destructive/90 text-white glow-orange" 
                : "bg-primary hover:bg-primary/90 text-background glow-green"
            } font-semibold`}
            asChild
          >
            {/* 🚀 FIX 2: El botón apunta al slug de la página SEO */}
            <Link href={`/partido/${match.slug}`}>
              <Play className="mr-2 h-4 w-4" />
              {match.isLive 
                ? `Ver En Vivo` 
                : `Ver Detalles del Evento`}
            </Link>
          </Button>
        </div>
        
        {/* 🚀 FIX 3: El overlay de la tarjeta también apunta al slug SEO */}
        <Link href={`/partido/${match.slug}`} className="absolute inset-0 z-0">
           <span className="sr-only">Ir a detalles</span>
        </Link>
      </div>
    </article>
  )
}