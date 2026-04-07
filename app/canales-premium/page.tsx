import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Tv, ArrowLeft, MonitorPlay, WifiHigh, Info, CheckCircle2, Search, ListVideo, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

// 1. METADATOS SEO
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const rawN = searchParams?.n || '';
  const nombreCanal = rawN ? String(rawN) : params?.slug?.replace(/-/g, ' ').toUpperCase() || 'CANAL';
  
  return {
    title: `Ver ${nombreCanal} EN VIVO HD Gratis | SportLive`,
    description: `Transmisión oficial de ${nombreCanal} en vivo por internet. Disfruta de la mejor programación deportiva y de entretenimiento 24/7 en calidad Full HD, sin cortes.`,
    keywords: `ver ${nombreCanal} en vivo, ${nombreCanal} online gratis, señal ${nombreCanal} por internet, ${nombreCanal} hd sin cortes, streaming tv en vivo, canales deportivos gratis`
  }
}

// 2. COMPONENTE PRINCIPAL
export default async function CanalPage(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const cleanId = params?.slug || '';
  const nombreCanal = searchParams?.n ? String(searchParams.n) : cleanId.replace(/-/g, ' ').toUpperCase();
  const categoria = searchParams?.c ? String(searchParams.c) : 'TV PREMIUM';
  
  const logoUrl = searchParams?.l ? String(searchParams.l) : `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCanal)}&background=1e3a8a&color=fff&bold=true`;

  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?canal=${cleanId}`;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden flex flex-col w-full">
      <Navbar />
      
      <main className="pt-32 pb-12 flex-1 w-full flex flex-col items-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative z-10">
          
          <div className="text-center mb-10">
            <Link href="/canales-premium" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Explorar más canales
            </Link>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl p-3 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center border border-white/20 hover:scale-105 transition-transform duration-300">
                 <img src={logoUrl} alt={`Logo del canal ${nombreCanal}`} className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-4">
              <div className="inline-flex items-center gap-2 text-destructive font-black text-xs uppercase tracking-widest bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                Señal 24/7
              </div>
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                <Star className="w-3 h-3" /> Premium
              </div>
              <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <ListVideo className="w-3 h-3" /> {categoria}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight uppercase">
              Ver <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00d4ff]">{nombreCanal}</span> En Vivo
            </h1>
            
            <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Transmisión oficial de {nombreCanal}. Haz clic en el botón para abrir el reproductor seguro y disfrutar de la programación sin interrupciones.
            </p>

            <div className="flex justify-center mb-16">
              <Button size="lg" className="w-full sm:w-auto min-w-[300px] px-10 py-8 rounded-2xl font-black text-lg uppercase tracking-wider bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-[1.03] shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all border border-white/20" asChild>
                <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                  <Play className="w-7 h-7 mr-3 fill-current" /> Reproducir Señal
                </Link>
              </Button>
            </div>
          </div>

          {/* 🚨 SEO BAIT TEXT: INFORMACIÓN RICA PARA GOOGLE 🚨 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Tarjeta 1: ¿Qué es? */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
                 <Tv className="w-6 h-6 text-[#00d4ff]" />
                 <h2 className="text-xl font-black text-white">Sobre {nombreCanal}</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                <strong>{nombreCanal}</strong> es uno de los canales más populares en la categoría de <strong>{categoria.toLowerCase()}</strong>. A través de nuestra plataforma, puedes acceder a su señal oficial por internet de forma totalmente gratuita.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ya sea que busques eventos deportivos en directo, noticias de última hora, películas estreno o series exclusivas, la programación de este canal está disponible las 24 horas del día.
              </p>
            </div>

            {/* Tarjeta 2: Beneficios (Palabras Clave) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
                 <Search className="w-6 h-6 text-[#00d4ff]" />
                 <h2 className="text-xl font-black text-white">¿Dónde ver {nombreCanal} online?</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                En SportLive garantizamos una experiencia de streaming superior. Al reproducir la señal de {nombreCanal} obtienes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Calidad Full HD (1080p):</strong> Imagen nítida adaptable a tu conexión a internet.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Compatibilidad Total:</strong> Funciona en Smart TV, Android, iPhone, PC y Mac.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Servidor Anti-Caídas:</strong> Enlaces redundantes para evitar cortes en momentos clave.</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta 3: Instrucciones de Seguridad */}
            <div className="md:col-span-2 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 mt-4">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-6 h-6 text-primary" />
                 <h2 className="text-xl font-black text-white">Transmisión Segura y Sin Registro</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Para disfrutar de <strong>{nombreCanal} en vivo</strong> no necesitas crear cuentas, ingresar tarjetas de crédito ni descargar aplicaciones extrañas. Solo debes hacer clic en el botón "Reproducir Señal" ubicado en la parte superior de esta página y el reproductor web integrado se abrirá de inmediato. Nuestro sistema cuenta con cifrado de conexión (<span className="text-primary font-bold">SSL Activo</span>) garantizando que tu navegación sea 100% privada y segura.
              </p>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}