"use client"

import { Play, Calendar, Tv, Film, ChevronRight, Zap } from "lucide-react"
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 live-indicator" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">En Vivo Ahora</span>
              <span className="text-sm text-muted-foreground">+50 eventos deportivos</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Tu Centro de
              <span className="block gradient-text mt-2">Entretenimiento Premium</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Deportes en vivo, canales de TV premium y los mejores estrenos del cine mundial. Todo en un solo lugar, disponible 24/7.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-[#00d4ff] text-background font-semibold text-base px-8 shine glow-green hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/canales-premium">
                  <Play className="mr-2 h-5 w-5" />
                  Ver Canales En Vivo
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border/50 bg-secondary/50 text-foreground hover:bg-secondary hover:border-primary/50 font-medium text-base"
                asChild
              >
                <Link href="/agenda-deportiva">
                  <Calendar className="mr-2 h-5 w-5" />
                  Agenda del Dia
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: "500+", label: "Canales" },
                { value: "24/7", label: "En Vivo" },
                { value: "HD", label: "Calidad" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards Grid */}
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
                href: "/canales-premium",
                gradient: "from-accent/20 to-accent/5",
                iconColor: "text-accent",
              },
              {
                icon: Film,
                title: "Cine & Estrenos",
                desc: "Peliculas HD",
                href: "/cine-estrenos",
                gradient: "from-[#00d4ff]/20 to-[#00d4ff]/5",
                iconColor: "text-[#00d4ff]",
              },
              {
                icon: Zap,
                title: "Blog & Guias",
                desc: "Articulos",
                href: "/blog",
                gradient: "from-destructive/20 to-destructive/5",
                iconColor: "text-destructive",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative overflow-hidden rounded-2xl glass p-6 card-hover bg-gradient-to-br ${card.gradient}`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl glass mb-4 ${card.iconColor}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
                <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
