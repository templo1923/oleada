"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Trophy, Zap, ChevronRight, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Match {
  id: number
  homeTeam: { name: string; logo: string; score: number | null }
  awayTeam: { name: string; logo: string; score: number | null }
  league: { name: string; logo: string }
  isLive: boolean
  date: string
  slug: string
  status: string
}

export function SportsSection() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sport, setSport] = useState("football")
  const [mounted, setMounted] = useState(false)

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/sports?sport=${sport}`)
      const json = await res.json()
      // En el Home solo mostramos los 10 primeros para mantener el foco de Landing
      setMatches((json.matches || []).slice(0, 10))
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

  const sportsMenu = [
    { id: "football", label: "Fútbol", icon: "⚽" },
    { id: "nba", label: "NBA", icon: "🏀" },
    { id: "f1", label: "F1", icon: "🏎️" },
    { id: "mma", label: "MMA", icon: "🥊" }
  ]

  const formatTime = (dateString: string) => {
    if (!mounted) return "--:--"
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-CO", { 
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/Bogota" 
    })
  }

  return (
    <section className="py-12 section-gradient overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER UNIFICADO Y LIMPIO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6" /> 
              Eventos <span className="text-primary">Destacados</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Lo más importante del día en vivo.</p>
          </div>

          {/* ÚNICO MENÚ DE CATEGORÍAS TIPO PILL */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide bg-black/20 p-1.5 rounded-2xl border border-white/5">
            {sportsMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setSport(item.id)}
                className={`px-5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 text-xs ${
                  sport === item.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 SCROLL LATERAL (No es una web de noticias, es una vitrina) */}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="min-w-[280px] md:min-w-[320px] h-48 rounded-[2rem]" />
            ))}
          </div>
        ) : matches.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x select-none">
            {matches.map((match) => (
              <div key={match.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                <article className="glass border border-white/5 rounded-[2rem] p-6 hover:border-primary/40 transition-all group relative h-full flex flex-col justify-between">
                  
                  {/* Info Superior */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2 max-w-[150px]">
                        <img src={match.league.logo} alt="" className="w-4 h-4 object-contain opacity-70" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{match.league.name}</span>
                    </div>
                    {match.isLive ? (
                      <div className="flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[9px] font-black animate-pulse">
                        <Zap className="w-3 h-3 fill-current" /> LIVE
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                        <Clock className="w-3 h-3" /> {formatTime(match.date)}
                      </div>
                    )}
                  </div>

                  {/* Equipos / Atletas */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-full p-1.5 overflow-hidden">
                            <img src={match.homeTeam.logo || "/placeholder-logo.png"} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-white truncate w-32">{match.homeTeam.name}</span>
                      </div>
                      <span className={`text-xl font-black ${match.isLive ? 'text-primary' : 'text-white'}`}>{match.homeTeam.score ?? '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-full p-1.5 overflow-hidden">
                            <img src={match.awayTeam.logo || "/placeholder-logo.png"} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-white truncate w-32">{match.awayTeam.name}</span>
                      </div>
                      <span className={`text-xl font-black ${match.isLive ? 'text-primary' : 'text-white'}`}>{match.awayTeam.score ?? '-'}</span>
                    </div>
                  </div>

                  {/* Botón de Acción a la App */}
                  <Button 
                    className={`w-full rounded-2xl py-5 font-black text-[10px] tracking-widest uppercase transition-all ${
                      match.isLive 
                      ? "bg-primary text-white hover:scale-[1.02] shadow-lg shadow-primary/20" 
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                    asChild
                  >
                    <Link href={`/partido/${match.slug}`}>
                      <Play className="mr-2 h-3 w-3 fill-current" />
                      {match.isLive ? 'Ver en la App' : 'Ver Detalles'}
                    </Link>
                  </Button>

                  <Link href={`/partido/${match.slug}`} className="absolute inset-0 z-0 rounded-[2rem]">
                      <span className="sr-only">Abrir {match.slug}</span>
                  </Link>
                </article>
              </div>
            ))}
            
            {/* Botón de cierre de scroll */}
            <Link href="/agenda-deportiva" className="min-w-[180px] flex flex-col items-center justify-center glass border border-dashed border-white/10 rounded-[2rem] hover:bg-white/5 hover:border-primary/50 transition-all snap-start group">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-6 h-6 text-primary" />
               </div>
               <span className="text-xs font-bold text-slate-300">Explorar Todo</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-[2rem] border border-white/5">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-400 font-bold">No hay eventos activos ahora.</p>
          </div>
        )}

      </div>
    </section>
  )
}