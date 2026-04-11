// app/eventos-hoy/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, Calendar, User, ArrowLeft, PlayCircle } from "lucide-react";

export default async function EventoEstiloBlog({ params }: { params: { slug: string } }) {
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { cache: 'no-store' });
  const eventos = await res.json();
  const partido = eventos.find((e: any) => e.slug === params.slug);

  if (!partido) return notFound();

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-4xl">
        
        {/* CABECERA (Igual a tu Blog) */}
        <header className="mb-10">
          <span className="bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
            {partido.liga}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight italic uppercase">
            {partido.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-bold border-y border-white/10 py-4 mb-8 uppercase">
            <div className="flex items-center gap-2">
              <img src={partido.author.avatar} className="w-8 h-8 rounded-full border border-red-600" />
              <span className="text-white">{partido.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>{new Date(partido.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>5 min de lectura</span>
            </div>
          </div>

          <img src={partido.image} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl border border-white/5 mb-10" />
        </header>

        {/* CUERPO DEL ARTÍCULO */}
        <div className="bg-zinc-900/40 p-8 md:p-12 rounded-[3rem] border border-white/5 backdrop-blur-md mb-12">
          <div className="prose prose-invert prose-lg max-w-none text-slate-300 whitespace-pre-line">
            {partido.content}
          </div>
        </div>

        {/* BOTÓN FLOTANTE (LLAMADO A LA ACCIÓN) */}
        <div className="sticky bottom-6 flex justify-center">
          <a href="/SportLive/agenda.html" className="group flex items-center gap-3 px-10 py-5 bg-red-600 text-white text-xl font-black rounded-2xl shadow-[0_10px_50px_rgba(220,38,38,0.5)] animate-bounce">
            <PlayCircle className="w-8 h-8" /> VER EN VIVO AHORA
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}