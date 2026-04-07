import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Tv, ArrowLeft, MonitorPlay, WifiHigh, Info, CheckCircle2, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

// 🚨 1. LA MAGIA SEO: PALABRAS CLAVE ESPECÍFICAS DE TV 🚨
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const rawN = searchParams?.n || '';
  const nombreCanal = rawN ? String(rawN) : params?.slug?.replace(/-/g, ' ').toUpperCase() || 'CANAL';
  
  return {
    title: `Ver ${nombreCanal} EN VIVO HD Gratis | SportLive`,
    description: `Transmisión oficial de ${nombreCanal} en vivo por internet. Disfruta de la programación 24/7 en calidad Full HD, estable y sin cortes en cualquier dispositivo.`,
    keywords: `ver ${nombreCanal} en vivo, ${nombreCanal} online gratis, señal ${nombreCanal} por internet, ${nombreCanal} hd sin cortes, streaming tv en vivo`
  }
}

// 2. COMPONENTE DE SERVIDOR BLINDADO
export default async function CanalPage(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const cleanId = params?.slug || '';
  const nombreCanal = searchParams?.n ? String(searchParams.n) : cleanId.replace(/-/g, ' ').toUpperCase();
  const categoria = searchParams?.c ? String(searchParams.c) : 'TV PREMIUM';
  
  // Recuperamos el logo si viene en la URL, si no usamos el avatar con iniciales
  const logoUrl = searchParams?.l ? String(searchParams.l) : `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCanal)}&background=1e3a8a&color=fff&bold=true`;

  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?canal=${cleanId}`;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden flex flex-col w-full">
      <Navbar />
      
      <main className="pt-32 pb-12 flex-1 w-full flex flex-col items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center relative z-10">
          
          <Link href="/canales-premium" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Canales
          </Link>

          {/* Logo del Canal Centrado */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl p-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center border border-white/20">
               <img src={logoUrl} alt={nombreCanal} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 text-destructive font-black text-xs uppercase tracking-widest bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
              Señal 24/7 En Vivo
            </div>
            <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 ml-2">
              {categoria}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight text-balance uppercase">
            Ver <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00d4ff]">{nombreCanal}</span> Online
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">
            Disfruta de la programación de {nombreCanal} en calidad Full HD. Servidor optimizado para cargar rápido y sin cortes en cualquier dispositivo.
          </p>

          {/* TARJETA INSTRUCTIVA */}
          <div className="glass border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden mb-12 max-w-3xl mx-auto text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <Tv className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Acceso a la Transmisión</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Disponibilidad</p>
                     <p className="text-sm font-black text-white">Online 24 Horas</p>
                   </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                   <MonitorPlay className="w-5 h-5 text-blue-400" />
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Calidad de Video</p>
                     <p className="text-sm font-black text-white">Alta Definición (HD)</p>
                   </div>
                 </div>
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" className="w-full sm:w-[80%] text-sm sm:text-base px-8 py-8 rounded-2xl font-black uppercase tracking-wider bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all border border-white/20" asChild>
                  <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                    <Play className="w-6 h-6 mr-3 fill-current" /> Reproducir Señal Ahora
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* 🚨 SEO BAIT PARA CANALES 🚨 */}
          <div className="text-left bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 max-w-3xl mx-auto relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
               <Search className="w-5 h-5 text-primary" />
               <h2 className="text-xl font-bold text-white">¿Cómo ver {nombreCanal} por internet?</h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Si quieres sintonizar <strong>{nombreCanal}</strong> desde tu celular, computadora o Smart TV, SportLive te ofrece la mejor señal gratuita. Nuestra plataforma actualiza los servidores constantemente para garantizar que la transmisión de la categoría <strong>{categoria}</strong> no tenga interrupciones.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Señal directa sin registro
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Compatible con Chromecast
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}