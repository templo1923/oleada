"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Clock, Play, Trophy, ChevronDown, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Match {
  id: number
  homeTeam: { name: string; logo: string; score: number | null }
  awayTeam: { name: string; logo: string; score: number | null }
  league: { name: string; logo: string }
  status: string
  isLive: boolean
  date: string
  slug: string
  elapsed: number | null
}

export function AgendaGrid() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sport, setSport] = useState("football")
  const [mounted, setMounted] = useState(false)

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/sports?sport=${sport}`)
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
  }, [sport])

  // 🚀 Agrupamos los cientos de partidos por Liga automáticamente
  const groupedByLeague = useMemo(() => {
    const groups: Record<string, { league: any, matches: Match[], hasLive: boolean }> = {}
    matches.forEach((match) => {
      const leagueName = match.league?.name || "Otros Eventos"
      if (!groups[leagueName]) groups[leagueName] = { league: match.league, matches: [], hasLive: false }
      groups[leagueName].matches.push(match)
      if (match.isLive) groups[leagueName].hasLive = true
    })
    return Object.values(groups).sort((a, b) => (a.hasLive && !b.hasLive ? -1 : !a.hasLive && b.hasLive ? 1 : b.matches.length - a.matches.length))
  }, [matches])

  const formatTime = (date: string) => mounted ? new Date(date).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true }) : "--:--"

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto w-full pb-4 mb-6 scrollbar-hide">
        {[
          { id: "football", label: "Fútbol", icon: "⚽" },
          { id: "nba", label: "NBA", icon: "🏀" },
          { id: "f1", label: "Fórmula 1", icon: "🏎️" },
          { id: "mma", label: "UFC / MMA", icon: "🥊" }
        ].map((item) => (
          <button key={item.id} onClick={() => setSport(item.id)} className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 text-sm ${sport === item.id ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-primary" : "glass text-slate-400 hover:text-white border border-white/5"}`}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end mb-6">
        <Button variant="ghost" size="sm" onClick={fetchMatches} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByLeague.map((group, index) => (
            <LeagueSection key={index} group={group} formatTime={formatTime} />
          ))}
          {matches.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl border border-white/5">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Cartelera limpia</h3>
              <p className="text-muted-foreground">No hay eventos para hoy en esta categoría.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LeagueSection({ group, formatTime }: { group: any, formatTime: any }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 hover:bg-secondary/70 transition-colors">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-1">
            {group.league.logo ? <img src={group.league.logo} alt="" className="w-full h-full object-contain" /> : <Trophy className="w-4 h-4 text-primary" />}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white text-sm">{group.league.name}</h3>
            <span className="text-xs text-slate-400">{group.matches.length} partidos</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="divide-y divide-white/5">
          {group.matches.map((match: any) => (
            <Link key={match.id} href={`/partido/${match.slug}`} className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors group">
              <div className="w-16 flex-shrink-0 text-center">
                {match.isLive ? (
                  <div className="flex flex-col items-center gap-1"><span className="text-destructive font-bold text-xs">LIVE</span><span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /></div>
                ) : (
                  <span className="text-slate-400 font-semibold text-xs">{formatTime(match.date)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm truncate font-medium group-hover:text-primary transition-colors">{match.homeTeam.name}</span>
                  <span className={`font-bold text-sm ml-2 ${match.isLive ? "text-primary" : "text-slate-400"}`}>{match.homeTeam.score ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm truncate font-medium group-hover:text-primary transition-colors">{match.awayTeam.name}</span>
                  <span className={`font-bold text-sm ml-2 ${match.isLive ? "text-primary" : "text-slate-400"}`}>{match.awayTeam.score ?? '-'}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${match.isLive ? "bg-destructive/20 text-destructive group-hover:bg-destructive group-hover:text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background"}`}>
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}