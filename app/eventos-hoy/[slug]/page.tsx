// app/eventos-hoy/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { Clock, Calendar, PlayCircle, Activity, ShieldCheck, Zap } from "lucide-react";

async function getEventos() {
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
    cache: 'no-store' 
  });
  return res.ok ? res.json() : [];
}

export default async function EventoEstiloBlog({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const eventos = await getEventos();
  const partido = eventos.find((e: any) => e.slug === slug);

  if (!partido) return notFound();

  // Fecha por defecto si no existe en el JSON
  const fechaHoy = partido.date ? new Date(partido.date).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-4xl">
        
        <header className="mb-10 text-center">
          <span className="bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block animate-pulse">
             🔴 {partido.liga || "Evento en Vivo"}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight italic uppercase tracking-tighter">
            {partido.title}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 text-[10px] font-bold border-y border-white/10 py-4 mb-8 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-600" />
              <span>Transmisión Oficial</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <time>{fechaHoy}</time>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Calidad Ultra HD</span>
            </div>
          </div>

          {/* Fallback si no hay imagen en el JSON */}
          <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
            <img 
              src={partido.image || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200"} 
              className="w-full h-full object-cover" 
              alt={partido.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        </header>

        <div className="bg-zinc-900/40 p-6 sm:p-10 rounded-[3rem] border border-white/5 mb-12 backdrop-blur-sm shadow-2xl">
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line font-medium italic mb-6">
            {partido.excerpt}
          </div>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line font-normal">
            {partido.content}
          </div>
        </div>

        {/* BOTÓN FLOTANTE */}
        <div className="sticky bottom-6 z-50 flex justify-center mt-12 px-4">
           <form action="/SportLive/agenda.html" method="GET" className="w-full max-w-md">
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all hover:scale-105 shadow-[0_10px_40px_rgba(220,38,38,0.5)] cursor-pointer border-none uppercase italic text-xl"
            >
              <PlayCircle className="w-8 h-8" />
              VER EN VIVO AHORA
            </button>
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}