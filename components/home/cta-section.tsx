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
    description: "Navegación protegida y privada",
  },
  {
    icon: Clock,
    title: "24/7 Disponible",
    description: "Contenido las 24 horas del día",
  },
  {
    icon: Star,
    title: "Acceso Libre",
    description: "Sin registros ni tarjetas de crédito",
  },
]

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden w-full max-w-[100vw]">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass overflow-hidden border border-white/5">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#00d4ff]">
                  <Zap className="h-5 w-5 text-background" />
                </div>
                <span className="text-sm font-black text-primary uppercase tracking-wider">Acceso Inmediato</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                No te quedes fuera del
                <span className="block bg-gradient-to-r from-primary to-[#00d4ff] bg-clip-text text-transparent mt-2">Juego Hoy Mismo</span>
              </h2>

              <p className="mt-6 text-slate-300 text-lg max-w-lg font-medium">
                Deportes en vivo, canales de televisión premium, películas en HD y mucho más. <strong className="text-white">Todo totalmente gratis y sin límites.</strong>
              </p>

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-primary flex-shrink-0">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-[#00d4ff] text-white font-black text-base px-8 py-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
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
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base px-8 py-6 rounded-2xl transition-all"
                  asChild
                >
                  <Link href="https://sportlivetvpremium.vercel.app/blog" target="_blank" rel="noopener noreferrer">
                    Saber Más
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
                  <div className="absolute -top-20 -left-10 glass border border-white/10 rounded-xl p-4 animate-float shadow-2xl">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-500 font-black text-xs animate-pulse">LIVE</span>
                      <span className="text-sm font-bold text-white">Champions League</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-16 -right-5 glass border border-white/10 rounded-xl p-4 animate-float shadow-2xl" style={{ animationDelay: "0.5s" }}>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-400 fill-current" />
                      <span className="text-sm font-bold text-white">Top Rating</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 -left-20 glass border border-white/10 rounded-xl p-4 animate-float shadow-2xl" style={{ animationDelay: "1s" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black bg-gradient-to-r from-primary to-[#00d4ff] bg-clip-text text-transparent">+500</span>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Canales</span>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-[#00d4ff] shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                    <Play className="h-16 w-16 text-white fill-current ml-2" />
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