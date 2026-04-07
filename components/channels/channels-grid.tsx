"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Play, X, Clock, Calendar, Tv } from "lucide-react"
import { Input } from "@/components/ui/input"

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

export function ChannelsGrid({ initialChannels }: { initialChannels: Channel[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("TODOS")
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [showLiveOnly, setShowLiveOnly] = useState(false)
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    const cats = new Set<string>();
    initialChannels.forEach(c => cats.add(c.category.toUpperCase()));
    
    const catArray = Array.from(cats).map(c => ({ id: c, name: c }));
    catArray.unshift({ id: "TODOS", name: "Todos" });
    setCategories(catArray);
  }, [initialChannels]);

  const filteredChannels = initialChannels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "TODOS" || channel.category.toUpperCase() === selectedCategory
    const matchesLive = !showLiveOnly || channel.isLive
    return matchesSearch && matchesCategory && matchesLive
  })

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar canal por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-base glass border-border/50 focus:border-primary/50 bg-transparent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all uppercase tracking-wider ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-primary to-[#00d4ff] text-background glow-green"
                    : "glass text-muted-foreground hover:text-white hover:bg-secondary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLiveOnly(!showLiveOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                showLiveOnly ? "bg-destructive/20 text-destructive" : "glass-light text-muted-foreground hover:text-white"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showLiveOnly ? "bg-destructive live-indicator" : "bg-muted-foreground"}`} />
              Verificados ({filteredChannels.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredChannels.map((channel) => {
            const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1e3a8a&color=fff&bold=true`;
            
            return (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className="group relative rounded-2xl glass overflow-hidden card-hover text-left flex flex-col"
              >
                <div className="absolute top-3 left-3 z-10">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/90 text-white text-[10px] font-black tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider border border-white/10">
                    {channel.category}
                  </span>
                </div>

                <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-black to-slate-900 overflow-hidden p-6 w-full">
                  <img
                    src={channel.logo || fallbackLogo}
                    alt={channel.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-background glow-green">
                      <Play className="h-5 w-5 fill-current ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 flex-1 flex flex-col justify-end">
                  <h3 className="font-bold text-white text-sm truncate">{channel.name}</h3>
                  <p className="text-[10px] text-emerald-400 font-semibold truncate mt-1">Señal Estable</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Modal Interactivo */}
        {selectedChannel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedChannel(null)}>
            <div className="relative w-full max-w-lg rounded-3xl glass border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedChannel(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20">
                <X className="h-5 w-5" />
              </button>

              <div className="relative p-6 bg-gradient-to-br from-primary/20 to-transparent border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-3 shadow-xl">
                    <img src={selectedChannel.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChannel.name)}&background=1e3a8a&color=fff&bold=true`} alt={selectedChannel.name} className="w-full h-full object-contain"/>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase">{selectedChannel.name}</h2>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{selectedChannel.category}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-slate-300 text-sm font-medium mb-6">{selectedChannel.description}</p>
                <Link 
                  href={`https://oleadatvpremium.com/SportLive/ver.html?canal=${selectedChannel.id}`} 
                  target="_blank"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-primary to-[#00d4ff] text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl shine shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-transform"
                >
                  <Play className="mr-2 h-5 w-5 fill-current" /> Reproducir {selectedChannel.name}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}