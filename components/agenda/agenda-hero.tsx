"use client"

import { Calendar, Clock, Flame, Trophy } from "lucide-react"

export function AgendaHero() {
  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const formattedDate = today.toLocaleDateString('es-ES', dateOptions)

  return (
    <section className="relative py-16 lg:py-24 hero-gradient overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground capitalize">{formattedDate}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Agenda
            <span className="block gradient-text-orange mt-2">Deportiva</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Todos los eventos deportivos del dia en un solo lugar. Futbol, Baloncesto, Tenis, Motor y mucho mas.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 lg:gap-12">
            {[
              { icon: Trophy, value: "50+", label: "Eventos Hoy" },
              { icon: Flame, value: "12", label: "En Vivo Ahora" },
              { icon: Clock, value: "24/7", label: "Cobertura" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 glass rounded-xl px-5 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
