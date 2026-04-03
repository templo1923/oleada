"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ChevronRight, Play, Trophy, RefreshCw } from "lucide-react"
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

export function SportsSection() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all")
  const [mounted, setMounted] = useState(false)

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/football?type=today")
      const data = await res.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchMatches()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMatches, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true
    if (filter === "live") return match.isLive
    if (filter === "upcoming") return match.status === "NS"
    return true
  })

  const liveCount = matches.filter((m) => m.isLive).length

  const formatTime = (dateString: string) => {
    if (!mounted) return "--:--"
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <section className="py-16 lg:py-24 section-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-destructive glow-orange">
                <Trophy className="h-5 w-5 text-background" />
              </div>
              <span className="text-sm font-medium text-accent uppercase tracking-wider">Deportes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Hoy en el Deporte</h2>
            <p className="mt-2 text-muted-foreground">Los eventos deportivos mas importantes del dia</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "Todos" },
              { key: "live", label: `En Vivo (${liveCount})` },
              { key: "upcoming", label: "Proximos" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === item.key
                    ? "bg-primary text-background"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMatches.slice(0, 8).map((match) => (
              <article 
                key={match.id} 
                className="group relative rounded-2xl glass overflow-hidden card-hover"
              >
                {/* League Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-secondary">
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
                    <span className="text-xs font-medium text-muted-foreground truncate max-w-[100px]">
                      {match.league.name}
                    </span>
                  </div>
                  {match.isLive && (
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive live-indicator" />
                      {match.elapsed ? `${match.elapsed}&apos;` : "LIVE"}
                    </span>
                  )}
                </div>

                {/* Match Content */}
                <div className="p-4">
                  <div className="flex flex-col gap-3">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                          {match.homeTeam.logo ? (
                            <Image
                              src={match.homeTeam.logo}
                              alt={match.homeTeam.name}
                              fill
                              className="object-contain p-0.5"
                            />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">
                              {match.homeTeam.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-foreground truncate text-sm">
                          {match.homeTeam.name}
                        </span>
                      </div>
                      {match.homeTeam.score !== null && (
                        <span className="text-lg font-bold text-foreground ml-2">
                          {match.homeTeam.score}
                        </span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                          {match.awayTeam.logo ? (
                            <Image
                              src={match.awayTeam.logo}
                              alt={match.awayTeam.name}
                              fill
                              className="object-contain p-0.5"
                            />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full text-[10px] font-bold">
                              {match.awayTeam.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-foreground truncate text-sm">
                          {match.awayTeam.name}
                        </span>
                      </div>
                      {match.awayTeam.score !== null && (
                        <span className="text-lg font-bold text-foreground ml-2">
                          {match.awayTeam.score}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Time & CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(match.date)}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className={`${
                        match.isLive 
                          ? "bg-destructive hover:bg-destructive/90 text-white" 
                          : "bg-primary hover:bg-primary/90 text-background"
                      } font-semibold`}
                      asChild
                    >
                      <Link href="/canales-premium">
                        <Play className="mr-1 h-3 w-3" />
                        {match.isLive ? "Ver Ahora" : "Ver"}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay partidos disponibles en este momento.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50 font-medium"
            asChild
          >
            <Link href="/agenda-deportiva">
              <Calendar className="mr-2 h-5 w-5" />
              Explorar Agenda Completa
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
