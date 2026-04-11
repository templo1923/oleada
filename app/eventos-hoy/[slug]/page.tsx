import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PlayCircle, Tv, Calendar, ShieldCheck, Zap } from "lucide-react";

// 📡 CONEXIÓN AL MOTOR DE TU HOSTING
async function getEventos() {
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
    cache: 'no-store' 
  });
  return res.ok ? res.json() : [];
}

// 🎯 SEO NIVEL EXPERTO (GOOGLE & REDES SOCIALES)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const eventosData = await getEventos();
  const partido = eventosData.find((e: any) => e.slug === resolvedParams.slug);

  if (!partido) return { title: 'Evento no encontrado' };

  // Creamos una descripción limpia para Google basada en lo que escribió la IA
  const descCorta = partido.content ? partido.content.substring(0, 155) + "..." : "Transmisión HD gratis en SportLive Premium.";

  return {
    title: `${partido.title} EN VIVO | SportLive Premium`,
    description: descCorta,
    keywords: `${partido.title}, ver futbol en vivo, alineaciones hoy, agenda deportiva, ${partido.liga}`,
    openGraph: {
      title: `🔴 EN VIVO: ${partido.title}`,
      description: descCorta,
      url: `https://oleadatvpremium.com/eventos-hoy/${resolvedParams.slug}`,
      images: [{ url: "https://oleadatvpremium.com/public/SportLive/icons/icon2-512x512.png" }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `🔴 EN VIVO: ${partido.title}`,
      description: descCorta,
      images: ["https://oleadatvpremium.com/public/SportLive/icons/icon2-512x512.png"],
    }
  }
}

// 📺 INTERFAZ VISUAL PREMIUM
export default async function EventoPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const eventosData = await getEventos();
  const partido = eventosData.find((e: any) => e.slug === resolvedParams.slug);

  if (!partido) return notFound();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      {/* 🌌 HEADER CON EFECTO DEGRADADO */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1 animate-pulse">
              <Zap className="w-3 h-3 fill-current" /> Transmisión Activa
            </span>
            <span className="bg-white/10 text-white/80 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-white/10">
              {partido.liga}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent italic leading-tight">
            {partido.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-white/40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Tv className="w-4 h-4" /> 4K STREAM</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> SEÑAL VIP</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto pb-24 px-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8">
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
              <h2 className="text-red-500 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                <div className="w-8 h-[2px] bg-red-500" /> Información del Partido
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                {partido.content}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-gradient-to-br from-zinc-900 to-black border border-red-500/20 p-8 rounded-3xl shadow-2xl">
              <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-6">
                Control de Acceso
              </p>
              
              {/* BOTÓN DE ARBITRAJE - MANDA A TU AGENDA */}
              <form action="/SportLive/agenda.html" method="GET">
                <button 
                  type="submit"
                  className="w-full group flex flex-col items-center gap-2 px-6 py-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(220,38,38,0.3)] cursor-pointer border-none"
                >
                  <PlayCircle className="w-12 h-12 mb-2 group-hover:rotate-12 transition-transform" />
                  <span className="text-xl font-black uppercase tracking-tighter">Ver ahora</span>
                  <span className="text-[10px] font-bold opacity-70">Acceso Ultra HD</span>
                </button>
              </form>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-white/60 uppercase">Streaming: <span className="text-white">Online</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}