"use client"

import { Play, Calendar, Tv, Film, ChevronRight, Zap, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00d4ff]/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenido Izquierdo */}
          <div className="text-center lg:text-left">
            {/* Badge SEO */}
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6 border border-primary/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 live-indicator" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Transmisiones 24/7</h2>
              <span className="text-sm font-black text-primary ml-1">¡Gratis!</span>
            </div>

            {/* Título Matador para SEO */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Fútbol en Vivo y 
              <span className="block bg-gradient-to-r from-primary to-[#00d4ff] bg-clip-text text-transparent mt-2">TV Premium Libre</span>
            </h1>

            {/* Descripción */}
            <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Mira los partidos de hoy, más de 500 canales en HD y los últimos estrenos del cine. <span className="text-white font-bold bg-primary/20 px-2 rounded">Sin tarjetas, sin registros.</span> Entra y dale play.
            </p>

            {/* CTAs (Sin el animate-bounce que rompía el layout) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-[#00d4ff] text-white font-black text-lg px-10 py-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                asChild
              >
                <Link href="https://oleadatvpremium.com/SportLive/index.html" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-6 w-6 fill-current" />
                  Abrir WebApp Gratis
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold text-base px-8 py-6 rounded-2xl transition-all"
                asChild
              >
                <Link href="/agenda-deportiva">
                  <Calendar className="mr-2 h-5 w-5" />
                  Ver Partidos de Hoy
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { value: "100%", label: "Gratis" },
                { value: "+500", label: "Canales TV" },
                { value: "FHD", label: "Resolución" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards Grid (Lado Derecho) */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Calendar,
                title: "Agenda Deportiva",
                desc: "Partidos del dia",
                href: "/agenda-deportiva",
                gradient: "from-primary/20 to-primary/5",
                iconColor: "text-primary",
              },
              {
                icon: Tv,
                title: "Canales Premium",
                desc: "TV en vivo",
                href: "https://sportlivetvpremium.vercel.app/canales-premium",
                gradient: "from-accent/20 to-accent/5",
                iconColor: "text-accent",
              },
              {
                icon: Film,
                title: "Cine & Estrenos",
                desc: "Peliculas HD",
                href: "https://sportlivetvpremium.vercel.app/cine-estrenos",
                gradient: "from-[#00d4ff]/20 to-[#00d4ff]/5",
                iconColor: "text-[#00d4ff]",
              },
              {
                icon: Zap,
                title: "Blog & Guias",
                desc: "Articulos",
                href: "https://sportlivetvpremium.vercel.app/blog",
                gradient: "from-destructive/20 to-destructive/5",
                iconColor: "text-destructive",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                target="_blank" 
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-2xl glass p-6 card-hover bg-gradient-to-br ${card.gradient}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl glass mb-4 ${card.iconColor}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{card.desc}</p>
                <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  )
}