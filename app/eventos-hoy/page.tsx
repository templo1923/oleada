// app/eventos-hoy/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";

async function getTodosLosEventos() {
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { cache: 'no-store' });
  return res.ok ? res.json() : [];
}

export default async function TodosLosEventos() {
  const eventos = await getTodosLosEventos();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto pt-28 pb-20 px-4">
        <div className="text-center mb-12">
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-xs">Transmisiones Globales</span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-2">Partidos de <span className="text-red-600">Hoy</span></h1>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto font-medium">Accede a las previas, alineaciones y señales en vivo de los mejores eventos del mundo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento: any) => (
            <Link 
              key={evento.id} 
              href={`/eventos-hoy/${evento.slug}`}
              className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:bg-zinc-900 transition-all hover:border-red-600/50 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Zap className="w-12 h-12 text-red-600" />
              </div>
              <span className="text-[10px] font-black bg-red-600 px-2 py-1 rounded mb-4 inline-block uppercase italic">Live HD</span>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-red-500 transition-colors leading-tight">
                {evento.title}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-medium">
                {evento.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{evento.liga}</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}