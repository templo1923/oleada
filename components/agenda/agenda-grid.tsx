"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Play, Trophy, MapPin, ChevronRight, Tv, RefreshCw, AlertCircle } from "lucide-react"
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
}

interface MatchesResponse {
  matches: Match[]
  total: number
  isDemo?: boolean
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  "1H": { label: "1er Tiempo", color: "destructive" },
  "2H": { label: "2do Tiempo", color: "destructive" },
  "HT": { label: "Descanso", color: "accent" },
  "ET": { label: "Tiempo Extra", color: "destructive" },
  "P": { label: "Penales", color: "destructive" },
  "LIVE": { label: "EN VIVO", color: "destructive" },
  "FT": { label: "Finalizado", color: "muted" },
  "AET": { label: "Final TE", color: "muted" },
  "PEN": { label: "Final Pen", color: "muted" },
  "NS": { label: "Por Jugar", color: "primary" },
  "TBD": { label: "Por Definir", color: "muted" },
  "PST": { label: "Pospuesto", color: "muted" },
  "CANC": { label: "Cancelado", color: "muted" },
  "ABD": { label: "Abandonado", color: "muted" },
  "AWD": { label: "Victoria Admin", color: "muted" },
  "WO": { label: "W.O.", color: "muted" },
}

export function AgendaGrid() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/football?type=today")
      const data: MatchesResponse = await res.json()
      setMatches(data.matches || [])
      setIsDemo(data.isDemo || false)
      setLastUpdate(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }))
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchMatches()
    
    // Auto-refresh every 60 seconds for live matches
    const interval = setInterval(() => {
      fetchMatches()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const liveMatches = matches.filter((m) => m.isLive)
  const upcomingMatches = matches.filter((m) => !m.isLive && m.status === "NS")
  const finishedMatches = matches.filter((m) => ["FT", "AET", "PEN"].includes(m.status))
  const displayedMatches = showAll ? matches : matches.slice(0, 8)

  const formatTime = (dateString: string) => {
    if (!mounted) return "--:--"
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Demo Notice */}
      {isDemo && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl glass border border-accent/30">
          <AlertCircle className="h-5 w-5 text-accent" />
          <p className="text-sm text-muted-foreground">
            Mostrando datos de demostracion. Conecta tu API key de Football-API para ver partidos en tiempo real.
          </p>
        </div>
      )}

      {/* Last Update & Refresh */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {lastUpdate && mounted && (
            <span>Actualizado: {lastUpdate}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchMatches}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 text-destructive text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-destructive live-indicator" />
              EN VIVO AHORA
            </span>
            <span className="text-sm text-muted-foreground">{liveMatches.length} partidos</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} featured formatTime={formatTime} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Proximos Partidos</h2>
            <span className="text-sm text-muted-foreground">({upcomingMatches.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {upcomingMatches.slice(0, showAll ? upcomingMatches.length : 4).map((match) => (
              <MatchCard key={match.id} match={match} formatTime={formatTime} />
            ))}
          </div>
        </div>
      )}

      {/* Finished Matches */}
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

      {/* Show All Button */}
      {matches.length > 8 && !showAll && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50"
          >
            Ver Todos los Partidos ({matches.length})
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay partidos programados</h3>
          <p className="text-muted-foreground">Vuelve mas tarde para ver la agenda actualizada.</p>
        </div>
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
  const statusInfo = STATUS_MAP[match.status] || { label: match.statusLong, color: "muted" }

  return (
    <article className={`group relative rounded-2xl glass overflow-hidden card-hover ${featured ? "lg:flex" : ""}`}>
      {/* League Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border/50 ${featured ? "lg:hidden" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-secondary">
            {match.league.logo ? (
              <Image
                src={match.league.logo}
                alt={match.league.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-xs font-bold">
                {match.league.name.substring(0, 2)}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-medium text-foreground">{match.league.name}</span>
            {match.venue && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {match.venue}
              </div>
            )}
          </div>
        </div>
        {match.isLive ? (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive live-indicator" />
            {match.elapsed ? `${match.elapsed}&apos;` : statusInfo.label}
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
              <Image
                src={match.league.logo}
                alt={match.league.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-lg font-bold">
                {match.league.name.substring(0, 2)}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-foreground text-center">{match.league.name}</span>
          {match.isLive && (
            <span className="mt-2 flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive live-indicator" />
              {match.elapsed ? `${match.elapsed}&apos;` : "LIVE"}
            </span>
          )}
        </div>
      )}

      {/* Match Content */}
      <div className={`p-4 flex-1 ${featured ? "lg:p-6" : ""}`}>
        <div className="flex flex-col gap-3">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                {match.homeTeam.logo ? (
                  <Image
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs font-bold">
                    {match.homeTeam.name.substring(0, 2)}
                  </span>
                )}
              </div>
              <span className={`font-semibold text-foreground truncate ${featured ? "text-lg" : ""}`}>
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
                  <Image
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs font-bold">
                    {match.awayTeam.name.substring(0, 2)}
                  </span>
                )}
              </div>
              <span className={`font-semibold text-foreground truncate ${featured ? "text-lg" : ""}`}>
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

        {/* Meta Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatTime(match.date)}</span>
            </div>
            {match.league.country && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{match.league.country}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Button 
            className={`w-full ${
              match.isLive 
                ? "bg-destructive hover:bg-destructive/90 text-white glow-orange" 
                : "bg-primary hover:bg-primary/90 text-background glow-green"
            } font-semibold`}
            asChild
          >
            <Link href="/canales-premium">
              <Play className="mr-2 h-4 w-4" />
              {match.isLive 
                ? `Ver ${match.homeTeam.name} vs ${match.awayTeam.name} En Vivo` 
                : `Ver ${match.homeTeam.name} vs ${match.awayTeam.name}`}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
