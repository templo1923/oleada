"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Play, Tv } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ScheduleItem { time: string; program: string }
interface Channel {
  id: string; name: string; logo: string; category: string;
  description: string; isLive: boolean; currentProgram: string; schedule: ScheduleItem[]
}

export function ChannelsGrid({ initialChannels }: { initialChannels: Channel[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("TODOS")
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredChannels.map((channel) => {
            const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=1e3a8a&color=fff&bold=true`;
            const realLogo = channel.logo || fallbackLogo;
            
            // 🚨 AQUÍ CREAMOS LA URL PARA EL SEO DEL CANAL 🚨
            const urlSEO = `/canal/${channel.id}?n=${encodeURIComponent(channel.name)}&c=${encodeURIComponent(channel.category)}&l=${encodeURIComponent(realLogo)}`;
            
            return (
              <Link
                key={channel.id}
                href={urlSEO}
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
                    src={realLogo}
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
                  <p className="text-[10px] text-emerald-400 font-semibold truncate mt-1">Señal Estable 24/7</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}