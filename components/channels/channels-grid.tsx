"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Star, Play, X, Clock, Calendar, Flame, Tv } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import channelsData from "@/data/channels.json"

interface ScheduleItem {
  time: string
  program: string
}

interface Channel {
  id: string
  name: string
  logo: string
  category: string
  description: string
  isLive: boolean
  currentProgram: string
  schedule: ScheduleItem[]
}

const categories = [
  { id: "all", name: "Todos" },
  { id: "deportes", name: "Deportes" },
  { id: "entretenimiento", name: "Entretenimiento" },
  { id: "documentales", name: "Documentales" },
  { id: "noticias", name: "Noticias" },
]

export function ChannelsGrid() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [showLiveOnly, setShowLiveOnly] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load channels from JSON
    setChannels(channelsData.channels)
    setIsLoading(false)
  }, [])

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || channel.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesLive = !showLiveOnly || channel.isLive
    return matchesSearch && matchesCategory && matchesLive
  })

  const liveCount = channels.filter((c) => c.isLive).length

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar canales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-base glass border-border/50 focus:border-primary/50 bg-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-primary to-[#00d4ff] text-background glow-green"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Live Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLiveOnly(!showLiveOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showLiveOnly
                  ? "bg-destructive/20 text-destructive"
                  : "glass-light text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showLiveOnly ? "bg-destructive live-indicator" : "bg-muted-foreground"}`} />
              Solo En Vivo ({liveCount})
            </button>
            <span className="text-sm text-muted-foreground">
              {filteredChannels.length} canales encontrados
            </span>
          </div>
        </div>

        {/* Channels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className="group relative rounded-2xl glass overflow-hidden card-hover text-left"
              >
                {/* Live Badge */}
                {channel.isLive && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/90 text-white text-[10px] font-semibold">
                      <span className="w-1 h-1 rounded-full bg-white live-indicator" />
                      LIVE
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium">
                    {channel.category}
                  </span>
                </div>

                {/* Channel Logo */}
                <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-secondary to-muted/50 overflow-hidden p-4">
                  {channel.logo.startsWith("http") ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={channel.logo}
                        alt={channel.name}
                        width={120}
                        height={60}
                        className="object-contain max-h-12"
                        onError={(e) => {
                          // Fallback to text if image fails
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            const fallback = document.createElement("span")
                            fallback.className = "text-2xl font-black text-foreground/80 tracking-tighter"
                            fallback.textContent = channel.name.substring(0, 4).toUpperCase()
                            parent.appendChild(fallback)
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-foreground/80 tracking-tighter">
                      {channel.name.substring(0, 4).toUpperCase()}
                    </span>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-background glow-green">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-foreground text-sm truncate">{channel.name}</h3>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">
                    {channel.currentProgram}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <Tv className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron canales</h3>
            <p className="text-muted-foreground">Intenta con otros filtros o terminos de busqueda.</p>
          </div>
        )}

        {/* Channel Modal */}
        {selectedChannel && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            onClick={() => setSelectedChannel(null)}
          >
            <div 
              className="relative w-full max-w-lg rounded-2xl glass overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 pb-0">
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg glass-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-muted/50 p-3 overflow-hidden">
                    {selectedChannel.logo.startsWith("http") ? (
                      <Image
                        src={selectedChannel.logo}
                        alt={selectedChannel.name}
                        width={80}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl font-black text-foreground">
                        {selectedChannel.name.substring(0, 4).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-foreground">{selectedChannel.name}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedChannel.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {selectedChannel.isLive && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive live-indicator" />
                          EN VIVO
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Ahora: {selectedChannel.currentProgram}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedChannel.description}
                </p>

                {/* Schedule */}
                <div className="mt-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    Programacion de Hoy
                  </h3>
                  <div className="space-y-2">
                    {selectedChannel.schedule.map((item, index) => {
                      let isCurrent = false
                      if (mounted) {
                        const now = new Date()
                        const [hours, minutes] = item.time.split(":").map(Number)
                        const scheduleTime = new Date()
                        scheduleTime.setHours(hours, minutes, 0, 0)
                        const isCurrentOrPast = scheduleTime <= now
                        const nextItem = selectedChannel.schedule[index + 1]
                        const nextTime = nextItem ? new Date() : null
                        if (nextTime && nextItem) {
                          const [nh, nm] = nextItem.time.split(":").map(Number)
                          nextTime.setHours(nh, nm, 0, 0)
                        }
                        isCurrent = isCurrentOrPast && (!nextTime || now < nextTime)
                      }

                      return (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            isCurrent 
                              ? "bg-primary/20 border border-primary/30" 
                              : "glass-light"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className={`h-4 w-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-foreground"}`}>
                              {item.time}
                            </span>
                            {isCurrent && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">
                                <span className="w-1 h-1 rounded-full bg-primary live-indicator" />
                                AHORA
                              </span>
                            )}
                          </div>
                          <span className={`text-sm ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {item.program}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-primary to-[#00d4ff] text-background font-semibold text-base py-6 shine glow-green hover:opacity-90 transition-opacity"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver {selectedChannel.name} En Vivo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
