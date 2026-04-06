"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Tv, ArrowLeft, Zap, MonitorPlay, WifiHigh } from 'lucide-react'
import { Button } from "@/components/ui/button"

function PartidoContenido({ slug }: { slug: string }) {
  const searchParams = useSearchParams()
  const r = searchParams.get('r')
  const n = searchParams.get('n')

  // Descodificamos el nombre para mostrarlo hermoso, o usamos el slug si falla
  const nombrePartido = n ? decodeURIComponent(n) : slug.replace(/-/g, ' ').toUpperCase();
  
  // Link real que abre tu reproductor
  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?r=${r}&n=${n}`;

  return (
    <main className="pt-28 pb-12 flex-1 w-full flex flex-col items-center justify-center relative">
      {/* Fondo con brillo para darle toque premium */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center relative z-10">
        
        <Link href="/agenda-deportiva" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Agenda
        </Link>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Transmisión Activa
          </div>
        </div>

        {/* 🚨 ESTE H1 ES EL QUE GOOGLE INDEXARÁ 🚨 */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight text-balance uppercase">
          Ver <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00d4ff]">{nombrePartido}</span> En Vivo
        </h1>
        
        <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-medium">
          Disfruta de este evento en calidad Full HD, sin cortes y totalmente optimizado para cualquier dispositivo. Haz clic abajo para abrir el reproductor.
        </p>

        {/* Tarjeta del Reproductor */}
        <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-inner">
               <Tv className="w-10 h-10 text-primary" />
            </div>
            
            <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-8 sm:px-12 py-7 sm:py-8 rounded-2xl font-black uppercase tracking-wider bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all border border-white/20" asChild>
              <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-3 fill-current" /> Iniciar Transmisión
              </Link>
            </Button>
            
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-8">
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Servidor Seguro
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-bold">
                <MonitorPlay className="w-4 h-4 text-blue-400" /> Multi-Dispositivo
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-bold">
                <WifiHigh className="w-4 h-4 text-purple-400" /> Sin Cortes (Anti-Lag)
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default function PartidoPage({ params }: { params: { slug: string } }) {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden flex flex-col w-full">
      <Navbar />
      {/* Usamos Suspense porque useSearchParams lo requiere en Next.js */}
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-primary font-bold animate-pulse">Cargando evento...</div>}>
        <PartidoContenido slug={params.slug} />
      </Suspense>
      <Footer />
    </div>
  )
}