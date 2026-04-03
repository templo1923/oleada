"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const sports = [
  { id: "all", name: "Todos", icon: "ALL" },
  { id: "futbol", name: "Futbol", icon: "FUT" },
  { id: "baloncesto", name: "Baloncesto", icon: "NBA" },
  { id: "tenis", name: "Tenis", icon: "ATP" },
  { id: "motor", name: "Motor", icon: "F1" },
  { id: "mma", name: "MMA/UFC", icon: "UFC" },
  { id: "boxeo", name: "Boxeo", icon: "BOX" },
  { id: "golf", name: "Golf", icon: "PGA" },
]

const leagues = [
  { id: "all", name: "Todas las Ligas" },
  { id: "champions", name: "Champions League" },
  { id: "libertadores", name: "Copa Libertadores" },
  { id: "betplay", name: "Liga BetPlay" },
  { id: "premier", name: "Premier League" },
  { id: "laliga", name: "La Liga" },
  { id: "seriea", name: "Serie A" },
  { id: "nba", name: "NBA" },
  { id: "atp", name: "ATP Tour" },
]

export function AgendaFilters() {
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedLeague, setSelectedLeague] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar equipos, ligas o eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-base glass border-border/50 focus:border-primary/50 bg-transparent"
        />
      </div>

      {/* Sport Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedSport === sport.id
                ? "bg-gradient-to-r from-accent to-destructive text-background glow-orange"
                : "glass text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <span className="text-xs font-bold opacity-70">{sport.icon}</span>
            {sport.name}
          </button>
        ))}
      </div>

      {/* League Filter Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Liga:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {leagues.slice(0, 6).map((league) => (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLeague === league.id
                  ? "bg-primary text-background"
                  : "glass-light text-muted-foreground hover:text-foreground"
              }`}
            >
              {league.name}
            </button>
          ))}
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
            Ver mas +
          </Button>
        </div>
      </div>
    </div>
  )
}
