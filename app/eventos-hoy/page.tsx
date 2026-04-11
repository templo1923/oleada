import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Zap, ChevronRight, Calendar, Activity } from "lucide-react";

// 1. Función para obtener todos los eventos desde tu hosting
async function getTodosLosEventos() {
  try {
    const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function CarteleraEventosPage() {
  const eventos = await getTodosLosEventos();
  const fechaHoy = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="container mx-auto pt-32 pb-20 px-4">
        {/* Cabecera de la Sección */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-4 py-1.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
              Cobertura Global en Vivo
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">
            Eventos de <span className="text-red-600">Hoy</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Toda la agenda deportiva del <span className="text-white capitalize">{fechaHoy}</span>. 
            Análisis, alineaciones y señales en alta definición.
          </p>
        </div>

        {/* Cuadrícula de Eventos */}
        {eventos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento: any) => (
              <Link 
                key={evento.id} 
                href={`/eventos-hoy/${evento.slug}`}
                className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 hover:bg-zinc-900 transition-all hover:border-red-600/50 hover:-translate-y-2 shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-md uppercase italic tracking-tighter">
                    Live HD
                  </span>
                  <Activity className="w-5 h-5 text-white/10 group-hover:text-red-600 transition-colors" />
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-red-500 transition-colors leading-tight">
                  {evento.title}
                </h2>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                  {evento.content}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Competición</span>
                    <span className="text-xs font-bold text-white uppercase">{evento.liga}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-all">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
            <Zap className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">Actualizando agenda para hoy...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}