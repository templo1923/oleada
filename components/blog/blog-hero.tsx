"use client"

import { FileText, TrendingUp, BookOpen, Users } from "lucide-react"

export function BlogHero() {
  return (
    <section className="relative py-16 lg:py-24 hero-gradient overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#00d4ff]/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Actualizado Diariamente</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Blog &
            <span className="block gradient-text mt-2">Guias</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Guias completas, comparativas y tutoriales sobre streaming, deportes en vivo y entretenimiento digital.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:gap-8">
            {[
              { icon: FileText, label: "50+ Articulos" },
              { icon: BookOpen, label: "Guias Detalladas" },
              { icon: Users, label: "100K+ Lectores" },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 text-muted-foreground">
                <feature.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
