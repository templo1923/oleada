"use client"

import { Film, Star, Sparkles, Clock } from "lucide-react"

export function MoviesHero() {
  return (
    <section className="relative py-16 lg:py-24 hero-gradient overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-accent/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-destructive/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Catalogo Actualizado Diariamente</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Cine &
            <span className="block gradient-text-orange mt-2">Estrenos</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Las mejores peliculas en calidad HD. Estrenos de Hollywood, cine latinoamericano, documentales y mucho mas.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:gap-8">
            {[
              { icon: Film, label: "10,000+ Peliculas" },
              { icon: Star, label: "Calidad HD" },
              { icon: Clock, label: "24/7" },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 text-muted-foreground">
                <feature.icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
