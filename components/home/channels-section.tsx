"use client"

import Link from "next/link"
import { Tv, ChevronRight, Play, Star, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Channel {
  id: number
  name: string
  category: string
  logo: string
  isLive: boolean
  isPremium: boolean
  viewers?: number
}

const featuredChannels: Channel[] = [
  { id: 1, name: "ESPN", category: "Deportes", logo: "ESPN", isLive: true, isPremium: true, viewers: 45000 },
  { id: 2, name: "Win Sports", category: "Deportes", logo: "WIN", isLive: true, isPremium: true, viewers: 32000 },
  { id: 3, name: "Fox Sports", category: "Deportes", logo: "FOX", isLive: true, isPremium: true, viewers: 28000 },
  { id: 4, name: "HBO", category: "Cine", logo: "HBO", isLive: true, isPremium: true, viewers: 22000 },
  { id: 5, name: "beIN Sports", category: "Deportes", logo: "beIN", isLive: true, isPremium: true, viewers: 18000 },
  { id: 6, name: "TNT Sports", category: "Deportes", logo: "TNT", isLive: true, isPremium: false, viewers: 15000 },
  { id: 7, name: "TUDN", category: "Deportes", logo: "TUDN", isLive: true, isPremium: false, viewers: 12000 },
  { id: 8, name: "Star+", category: "Entretenimiento", logo: "STAR", isLive: true, isPremium: true, viewers: 20000 },
]

export function ChannelsSection() {
  return (
    <section className="py-16 lg:py-24 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4ff] to-primary glow-blue">
                <Tv className="h-5 w-5 text-background" />
              </div>
              <span className="text-sm font-medium text-[#00d4ff] uppercase tracking-wider">Canales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Canales Premium en Tendencia</h2>
            <p className="mt-2 text-muted-foreground">Los canales mas vistos ahora mismo</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href="/canales-premium">
              Ver Todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredChannels.map((channel) => (
            <Link
              key={channel.id}
              href="/canales-premium"
              className="group relative rounded-2xl glass overflow-hidden card-hover"
            >
              {/* Premium Badge */}
              {channel.isPremium && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                    <Star className="h-3 w-3 fill-current" />
                    Premium
                  </span>
                </div>
              )}

              {/* Channel Logo Area */}
              <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-secondary to-muted/50 overflow-hidden">
                <span className="text-4xl font-black text-foreground/80 tracking-tighter">{channel.logo}</span>
                
                {/* Live Indicator */}
                {channel.isLive && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/90 text-white text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white live-indicator" />
                      LIVE
                    </span>
                  </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-background glow-green">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>

              {/* Channel Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate">{channel.name}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{channel.category}</span>
                  {channel.viewers && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="h-3 w-3 text-accent" />
                      {(channel.viewers / 1000).toFixed(1)}K
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#00d4ff] to-primary text-background font-semibold shine glow-blue hover:opacity-90 transition-opacity"
            asChild
          >
            <Link href="/canales-premium">
              <Tv className="mr-2 h-5 w-5" />
              Ver Todos los Canales Premium
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
