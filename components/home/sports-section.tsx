// Archivo: components/home/sports-section.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy, ChevronRight } from "lucide-react"
import { SportsWidget } from "@/components/sports/sports-widget"

export function SportsSection() {
  // Estado para controlar qué deporte está viendo el usuario
  const [sport, setSport] = useState("football")

  const sportsMenu = [
    { id: "football", label: "Fútbol", icon: "⚽" },
    { id: "nba", label: "NBA", icon: "🏀" },
    { id: "f1", label: "Fórmula 1", icon: "🏎️" },
    { id: "mma", label: "UFC / MMA", icon: "🥊" }
  ]

  return (
    <section className="py-12 section-gradient overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO Y MENÚ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="text-primary w-6 h-6" /> 
              Agenda <span className="text-primary">Destacada</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Selecciona un deporte y mira los resultados oficiales.</p>
          </div>

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

        {/* AQUÍ LLAMAMOS AL WIDGET MÁGICO */}
        {/* Dependiendo del botón que toque el usuario, le pasamos el deporte correcto al widget */}
        <div className="min-h-[400px]">
          {sport === "football" && <SportsWidget sport="football" type="games" />}
          {sport === "nba" && <SportsWidget sport="nba" type="games" />}
          {sport === "f1" && <SportsWidget sport="f1" type="races" />}
          {sport === "mma" && <SportsWidget sport="mma" type="fights" />}
        </div>

        {/* BOTÓN PARA IR A LA AGENDA COMPLETA */}
        <div className="mt-10 text-center">
           <Link href="/agenda-deportiva" className="inline-flex items-center justify-center glass border border-dashed border-white/20 rounded-[2rem] px-8 py-4 font-bold text-white hover:bg-white/5 hover:border-primary/50 transition-all group">
             Explorar el Directorio Completo <ChevronRight className="ml-2 w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

      </div>
    </section>
  )
}