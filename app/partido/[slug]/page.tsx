"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Tv, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function PartidoPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const r = searchParams.get('r')
  const n = searchParams.get('n')

  // Descodificamos el nombre para mostrarlo bonito, o si falla, usamos el slug
  const nombrePartido = n ? decodeURIComponent(n) : params.slug.replace(/-/g, ' ').toUpperCase();
  
  // Aquí está el link real que lleva a tu WebApp a monetizar
  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?r=${r}&n=${n}`;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden flex flex-col w-full">
      <Navbar />
      
      <main className="pt-28 pb-12 flex-1 w-full flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 text-center">
          
          <Link href="/agenda-deportiva" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Agenda
          </Link>

          <div className="inline-flex items-center gap-2 mb-4 text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-md border border-emerald-400/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Transmisión Disponible
          </div>

          {/* 🚨 ESTE H1 ES EL QUE LEE GOOGLE 🚨 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight text-balance">
            Ver <span className="text-primary">{nombrePartido}</span> en Vivo y Gratis
          </h1>
          
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Estás a un solo clic de disfrutar este evento en calidad Full HD. Sin cortes, sin registros y 100% seguro.
          </p>

          <div className="glass border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Tv className="w-16 h-16 text-slate-500 mb-6 opacity-50" />
              
              <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-8 rounded-2xl font-black uppercase tracking-wider bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all" asChild>
                <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                  <Play className="w-6 h-6 mr-3 fill-current" /> Reproducir Partido Ahora
                </Link>
              </Button>
              
              <div className="flex items-center gap-2 mt-6 text-slate-400 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Transmisión Segura y Verificada
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}