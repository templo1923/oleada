import { Newspaper, ArrowRight } from "lucide-react";
import Link from "next/link";

// 1. Función para obtener los datos frescos de tu hosting
async function getNoticias() {
  try {
    const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
      cache: 'no-store' // Obliga a Next.js a buscar datos nuevos en cada visita
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error cargando noticias:", error);
    return [];
  }
}

export async function NewsSection() {
  const eventosData = await getNoticias();

  // Si no hay noticias (o el PHP aún no corre), no mostramos la sección
  if (!eventosData || eventosData.length === 0) return null;

  // Tomamos solo las primeras 4 para que la landing se vea ordenada
  const noticiasPrincipales = eventosData.slice(0, 4);

  return (
    <section className="py-12 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Newspaper className="text-primary w-6 h-6 md:w-8 md:h-8" /> 
            Noticias y <span className="text-primary">Previas</span>
          </h2>
          <Link href="/eventos-hoy" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {noticiasPrincipales.map((evento: any) => (
            <Link 
              key={evento.id} 
              href={`/eventos-hoy/${evento.slug}`}
              className="group bg-slate-800/40 border border-white/5 rounded-xl p-5 hover:bg-slate-800/60 transition-all hover:border-primary/30 flex flex-col h-full"
            >
              <div className="mb-3 flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded">
                  {evento.liga || "Previa del Día"}
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