import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Tv, ArrowLeft, MonitorPlay, WifiHigh, Info, CheckCircle2, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"

// 🚨 1. LA MAGIA SEO: METADATOS DINÁMICOS PARA GOOGLE 🚨
// Esto cambia el título de la pestaña y la descripción en los resultados de búsqueda automáticamente.
export async function generateMetadata({ params, searchParams }: { params: { slug: string }, searchParams: { n?: string } }): Promise<Metadata> {
  const nombrePartido = searchParams.n ? decodeURIComponent(searchParams.n) : params.slug.replace(/-/g, ' ').toUpperCase();
  
  return {
    title: `Ver ${nombrePartido} EN VIVO HD | SportLive`,
    description: `¿Estás buscando dónde ver ${nombrePartido} en vivo? Entra ahora para disfrutar la transmisión online gratis, en calidad Full HD y sin cortes.`,
    keywords: `${nombrePartido} en vivo, ver ${nombrePartido} gratis, dónde ver ${nombrePartido}, streaming online, partido hd, transmisión en directo`
  }
}

// 2. COMPONENTE PRINCIPAL (Renderizado en el Servidor para Máximo Rendimiento)
export default function PartidoPage({ params, searchParams }: { params: { slug: string }, searchParams: { r?: string, n?: string } }) {
  const r = searchParams.r || '';
  const n = searchParams.n || '';
  const nombrePartido = n ? decodeURIComponent(n) : params.slug.replace(/-/g, ' ').toUpperCase();
  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?r=${r}&n=${n}`;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden flex flex-col w-full">
      <Navbar />
      
      <main className="pt-32 pb-12 flex-1 w-full flex flex-col items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center relative z-10">
          
          <Link href="/agenda-deportiva" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Agenda
          </Link>

          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Transmisión Verificada
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight text-balance uppercase mt-4">
            Ver <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00d4ff]">{nombrePartido}</span> En Vivo
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
            Prepara tu pantalla. Haz clic en el botón de abajo para ser redirigido al servidor oficial y disfrutar del evento sin interrupciones.
          </p>

          {/* TARJETA INSTRUCTIVA SUPER PRO */}
          <div className="glass border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden mb-12 max-w-3xl mx-auto text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <Tv className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Detalles de la Transmisión</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Estado del Servidor</p>
                     <p className="text-sm font-black text-white">Señal Activa y Estable</p>
                   </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                   <MonitorPlay className="w-5 h-5 text-blue-400" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Calidad de Video</p>
                     <p className="text-sm font-black text-white">1080p FHD / 60fps</p>
                   </div>
                 </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 mb-8">
                <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-blue-200 font-medium leading-relaxed">
                  <strong className="text-blue-400">Paso Final:</strong> Al hacer clic en el botón de abajo, nuestro sistema validará tu conexión y te llevará de forma automática y segura a la ventana de reproducción del evento.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" className="w-full sm:w-[80%] text-sm sm:text-base px-8 py-8 rounded-2xl font-black uppercase tracking-wider bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all border border-white/20" asChild>
                  <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                    <Play className="w-6 h-6 mr-3 fill-current" /> Iniciar Transmisión Ahora
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Servidor Cifrado
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <WifiHigh className="w-4 h-4 text-purple-400" /> Anti-Lag Activado
                </div>
              </div>
            </div>
          </div>

          {/* 🚨 BLOQUE DE TEXTO PARA GOOGLE (SEO BAIT) 🚨 */}
          <div className="text-left bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 max-w-3xl mx-auto relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
               <Search className="w-5 h-5 text-primary" />
               <h2 className="text-xl font-bold text-white">¿Dónde ver {nombrePartido} online?</h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Si te estabas preguntando en qué canal o plataforma transmiten el evento de <strong>{nombrePartido}</strong>, has llegado al lugar indicado. En SportLive recopilamos las mejores opciones de streaming para que no te pierdas ni un solo minuto de la acción.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transmisión HD gratuita
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compatible con Smart TV, PC y Móvil
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sin registros molestos
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actualización de enlaces en tiempo real
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}