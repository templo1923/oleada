import { Newspaper, ArrowRight } from "lucide-react";
import Link from "next/link";
import eventosData from "@/data/eventos-auto.json";

export function NewsSection() {
  if (!eventosData || eventosData.length === 0) return null;

  return (
    <section className="py-12 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Newspaper className="text-primary w-6 h-6 md:w-8 md:h-8" /> 
            Noticias y <span className="text-primary">Previas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventosData.map((evento: any) => (
            <Link 
              key={evento.id} 
              href={`/eventos-hoy/${evento.slug}`}
              className="group bg-slate-800/40 border border-white/5 rounded-xl p-5 hover:bg-slate-800/60 transition-all hover:border-primary/30 flex flex-col h-full"
            >
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded">
                  Previa del Día
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {evento.title}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                {evento.content}
              </p>
              <div className="flex items-center text-primary text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                Leer más <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}