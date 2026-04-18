import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Zap, ChevronRight, Calendar, Activity, Trophy } from "lucide-react";

// Función para obtener todos los eventos desde tu hosting
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
      >
      
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

        {/* Cuadrícula de Eventos ORDENADA */}
        {eventos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento: any) => {
              // 🔥 1. LIMPIEZA DE TEXTO: Adiós a los asteriscos de la IA 🔥
              const textoLimpio = evento.content?.replace(/\*\*/g, '') || '';
              
              return (
                <Link 
                  key={evento.id} 
                  href={`/eventos-hoy/${evento.slug}`}
                  className="group relative flex flex-col bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-3xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  {/* Etiqueta Superior y Logo de la Liga */}
                  <div className="flex justify-between items-start p-6 pb-2 relative z-10">
                    <div className="flex flex-col gap-2">
                      <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase italic tracking-tighter w-max flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        <Zap className="w-3 h-3 fill-current" /> Live HD
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                        <Trophy className="w-3 h-3 text-red-500" /> {evento.liga}
                      </span>
                    </div>
                    {/* 🔥 2. IMAGEN DE LA LIGA (Logo en la esquina) 🔥 */}
                    <div className="w-12 h-12 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm flex-shrink-0 flex items-center justify-center">
                      <img src={evento.image} alt={evento.liga} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-6 pt-2 flex-grow flex flex-col relative z-10">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-red-400 transition-colors leading-snug">
                      {evento.title}
                    </h2>
                    
                    {/* 🔥 3. ALTURA UNIFORME: El line-clamp-3 corta el texto largo con "..." 🔥 */}
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {textoLimpio}
                    </p>

                    {/* Botón inferior siempre alineado abajo gracias a mt-auto */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest group-hover:text-white transition-colors">
                        Ver Detalles
                      </span>
                      <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Decoración de luz de fondo (Efecto resplandor rojo) */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors pointer-events-none" />
                </Link>
              );
            })}
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