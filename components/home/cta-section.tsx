"use client"

import Link from "next/link"
import { Zap, Play, Shield, Clock, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Play,
    title: "Streaming HD",
    description: "Calidad hasta 4K sin buffering",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Navegacion protegida y privada",
  },
  {
    icon: Clock,
    title: "24/7 Disponible",
    description: "Contenido las 24 horas del dia",
  },
  {
    icon: Star,
    title: "Sin Anuncios",
    description: "Experiencia premium sin interrupciones",
  },
]

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#00d4ff]">
                  <Zap className="h-5 w-5 text-background" />
                </div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Acceso Premium</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Accede a Todo el
                <span className="block gradient-text">Contenido Premium</span>
              </h2>

              <p className="mt-4 text-muted-foreground text-lg max-w-lg">
                Deportes en vivo, canales de television premium, peliculas en HD y mucho mas. Todo sin limites.
              </p>

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg glass-light text-primary flex-shrink-0">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-[#00d4ff] text-background font-semibold text-base px-8 shine glow-green hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href="/canales-premium">
                    <Play className="mr-2 h-5 w-5" />
                    Comenzar Ahora
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border/50 bg-secondary/50 hover:bg-secondary hover:border-primary/50 font-medium"
                  asChild
                >
                  <Link href="/blog">
                    Saber Mas
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block bg-gradient-to-br from-primary/20 via-[#00d4ff]/10 to-accent/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Floating Cards */}
                  <div className="absolute -top-20 -left-10 glass rounded-xl p-4 animate-float">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20 text-destructive font-bold text-xs">LIVE</span>
                      <span className="text-sm text-foreground">Champions League</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-16 -right-5 glass rounded-xl p-4 animate-float" style={{ animationDelay: "0.5s" }}>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-accent fill-current" />
                      <span className="text-sm text-foreground">4.9 Rating</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-20 glass rounded-xl p-4 animate-float" style={{ animationDelay: "1s" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold gradient-text">500+</span>
                      <span className="text-xs text-muted-foreground">Canales</span>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-[#00d4ff] glow-green">
                    <Play className="h-16 w-16 text-background fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
