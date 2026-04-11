import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { Clock, Calendar, PlayCircle, Activity, ShieldCheck, ArrowLeft, Zap } from "lucide-react";

async function getEventos() {
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
    cache: 'no-store' 
  });
  return res.ok ? res.json() : [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const eventos = await getEventos();
  const partido = eventos.find((e: any) => e.slug === slug);
  if (!partido) return { title: 'Evento no encontrado' };

  return {
    title: `${partido.title}`,
    description: partido.excerpt,
    openGraph: {
      title: `🔴 EN VIVO: ${partido.title}`,
      images: [{ url: partido.image }]
    }
  }
}

export default async function EventoEstiloBlog({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const eventos = await getEventos();
  const partido = eventos.find((e: any) => e.slug === slug);

  if (!partido) return notFound();

  // Limpiamos los asteriscos del contenido si no usas una librería de Markdown
  const contenidoLimpio = partido.content?.replace(/\*\*/g, '');

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-4xl">
        
        <div className="mb-8">
          <a href="/eventos-hoy" className="inline-flex items-center text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Cartelera
          </a>
        </div>

        <header className="mb-10 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1 animate-pulse">
              <Zap className="w-3 h-3 fill-current" /> En Vivo
            </span>
            <span className="bg-white/10 text-white/80 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-white/10">
              {partido.liga}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-8 leading-tight italic uppercase tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            {partido.title}
          </h1>

          {/* 🖼️ AJUSTE DE IMAGEN: Ahora es un logo centrado, no una foto gigante vacía */}
          <div className="relative w-full max-w-sm mx-auto aspect-square mb-10 group">
             <div className="absolute inset-0 bg-red-600/20 blur-[80px] rounded-full group-hover:bg-red-600/40 transition-colors" />
             <img 
                src={partido.image} 
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                alt={partido.liga}
              />
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-500 text-[10px] font-bold border-y border-white/5 py-4 mb-8 uppercase tracking-widest">
            <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-red-600" /> Transmisión VIP</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-600" /> {new Date(partido.date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-red-600" /> 4K Ultra HD</div>
          </div>
        </header>

        <div className="bg-zinc-900/30 p-8 md:p-12 rounded-[3rem] border border-white/5 mb-12 backdrop-blur-xl shadow-2xl">
          <p className="text-xl text-white font-bold italic mb-10 border-l-4 border-red-600 pl-6 leading-relaxed">
            {partido.excerpt}
          </p>
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-line font-medium">
            {contenidoLimpio}
          </div>
        </div>

        {/* CTA FLOTANTE */}
        <div className="sticky bottom-6 z-50 flex justify-center px-4">
          <form action="/SportLive/agenda.html" method="GET" className="w-full max-w-md">
            <button type="submit" className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all hover:scale-105 shadow-[0_20px_50px_rgba(220,38,38,0.5)] cursor-pointer border-none uppercase italic text-xl">
              <PlayCircle className="w-8 h-8" /> ACCEDER A LA SEÑAL HD
            </button>
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}