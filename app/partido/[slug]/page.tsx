import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Trophy, Timer, ArrowLeft, Activity, Radio, CheckCircle2, Star, CalendarDays } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

// ==========================================
// 🧠 CEREBRO SEO PARA EVENTOS DEPORTIVOS
// ==========================================
function procesarPartido(rawName: string) {
  const nombreLimpio = decodeURIComponent(rawName).replace(/-/g, ' ').toUpperCase();
  
  // Separamos los equipos (buscando ' x ' o ' vs ')
  let equipoA = "Local";
  let equipoB = "Visitante";
  
  if (nombreLimpio.includes(' VS ')) {
    const partes = nombreLimpio.split(' VS ');
    equipoA = partes[0].trim();
    equipoB = partes[1].trim();
  } else if (nombreLimpio.includes(' X ')) {
    const partes = nombreLimpio.split(' X ');
    equipoA = partes[0].trim();
    equipoB = partes[1].trim();
  } else {
    equipoA = nombreLimpio;
  }

  const tituloSeo = `Ver ${equipoA} vs ${equipoB} EN VIVO | Transmisión Online HD Hoy`;
  const descSeo = `No te pierdas el partido ${equipoA} vs ${equipoB} en directo. Disfruta de la mejor señal streaming, sin cortes, en Full HD y totalmente gratis. ¡Link oficial aquí!`;
  const keywordsSeo = `${equipoA} vs ${equipoB} en vivo, ver ${equipoA} hoy, transmision ${equipoB} gratis, futbol online hd, link partido ${equipoA}`;

  return { equipoA, equipoB, nombreLimpio, tituloSeo, descSeo, keywordsSeo };
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const rawN = searchParams?.n ? String(searchParams.n) : "Evento Deportivo";
  const { tituloSeo, descSeo, keywordsSeo } = procesarPartido(rawN);
  
  return {
    title: tituloSeo,
    description: descSeo,
    keywords: keywordsSeo,
  }
}

export default async function PartidoPage(props: any) {
  const searchParams = await props.searchParams;
  const r = searchParams?.r ? String(searchParams.r) : "";
  const n = searchParams?.n ? String(searchParams.n) : "Evento Deportivo";
  
  const { equipoA, equipoB, nombreLimpio } = procesarPartido(n);
  
  // Enlace al reproductor
  const linkReproductor = `/ver.html?r=${r}&n=${encodeURIComponent(n)}`;

  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit']">
      <Navbar />
      
      <main className="pt-24 pb-12 flex-1 w-full flex flex-col items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full relative z-10">
          
          {/* Botón Volver */}
          <Link href="/agenda-deportiva" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Agenda
          </Link>

          {/* 🏟️ BANNER DE ESTADIO (HERO) */}
          <div className="w-full bg-gradient-to-b from-[#111827] to-[#080c14] rounded-[2.5rem] border border-white/10 p-8 sm:p-14 mb-10 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
            
            {/* Marcador Estético */}
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Transmisión Verificada
              </div>

              {/* Duelo de Equipos */}
              <div className="flex items-center justify-center gap-4 sm:gap-12 w-full">
                <div className="flex-1 text-right">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">{equipoA}</h2>
                </div>
                <div className="shrink-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center rotate-45 backdrop-blur-md">
                    <span className="text-xl sm:text-2xl font-black text-primary -rotate-45 italic">VS</span>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-300 leading-tight">{equipoB}</h2>
                </div>
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-slate-400 uppercase tracking-widest mt-4">
                Evento en vivo • <span className="text-white">Calidad 1080p / 60fps</span>
              </h1>

              <div className="w-full max-w-sm mt-4">
                <Button size="lg" className="w-full py-8 rounded-2xl font-black text-lg uppercase tracking-widest bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-[1.03] transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]" asChild>
                  <Link href={linkReproductor} target="_blank">
                    <Play className="w-6 h-6 mr-3 fill-current" /> Iniciar Transmisión
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* 📝 SECCIÓN DE SEO NATIVO (EL "HP" DEL SEO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            <div className="bg-[#111827]/60 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm">
              <h2 className="text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                <Trophy className="text-primary w-6 h-6" /> ¿Dónde ver {nombreLimpio}?
              </h2>
              <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
                <p>
                  Si te preguntas cómo ver el partido de <strong className="text-white">{equipoA} vs {equipoB}</strong> hoy, has llegado al lugar indicado. En <strong>SportLive</strong> hemos habilitado una señal premium de alta velocidad.
                </p>
                <p>
                  A diferencia de otros sitios, nuestro enlace para <strong className="text-white">{nombreLimpio}</strong> cuenta con optimización de datos para que puedas disfrutar del evento incluso en redes móviles 4G/5G sin el molesto lag.
                </p>
              </div>
            </div>

            <div className="bg-[#111827]/60 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm">
              <h2 className="text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                <ShieldCheck className="text-primary w-6 h-6" /> Garantía SportLive
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 100% Libre de registros y pagos.
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Servidores seguros con cifrado SSL.
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Soporte multi-dispositivo (Smart TV/Móvil).
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}