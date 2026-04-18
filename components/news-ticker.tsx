import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export async function NewsTicker() {
  let news: any[] = [];

  try {
    // 🔥 EL FETCH AHORA LO HACE EL SERVIDOR (Adiós errores de CORS) 🔥
    const res = await fetch("https://tucentral.store/Sportlive/eventos-auto.json", {
      next: { revalidate: 300 } // Se actualiza cada 5 minutos
    });
    
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        news = data.slice(0, 10); // Tomamos los 10 primeros
      }
    }
  } catch (e) {
    console.error("Error en Ticker:", e);
  }

  // Si no hay noticias o hubo un error, no mostramos nada
  if (news.length === 0) return null;

  return (
    <div className="fixed top-[64px] md:top-[72px] left-0 w-full bg-red-600 overflow-hidden h-9 md:h-10 flex items-center border-y border-white/10 z-[40]">
      {/* Etiqueta Fija de "ÚLTIMO MOMENTO" */}
      <div className="bg-black text-white px-3 md:px-4 h-full flex items-center gap-2 z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)] border-r border-red-500">
        <Zap className="w-3 h-3 md:w-4 md:h-4 fill-red-600 text-red-600 animate-pulse" />
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter whitespace-nowrap italic">
          Último Momento
        </span>
      </div>

      {/* Contenedor Animado */}
      <div className="flex-grow overflow-hidden relative flex items-center h-full">
        <div className="animate-marquee h-full flex items-center">
          {news.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/eventos-hoy/${item.slug}`}
              className="flex items-center gap-2 mx-6 md:mx-8 group"
            >
              <span className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                [{item.liga}]
              </span>
              <span className="text-white text-[10px] md:text-xs font-black uppercase italic group-hover:underline transition-all">
                {item.title ? item.title.replace(/\*\*/g, "") : "Evento en Vivo"}
              </span>
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mx-2" />
            </Link>
          ))}
          {/* Duplicamos los items para el efecto visual infinito */}
          {news.map((item, idx) => (
            <Link
              key={`dup-${item.id}-${idx}`}
              href={`/eventos-hoy/${item.slug}`}
              className="flex items-center gap-2 mx-6 md:mx-8 group"
            >
              <span className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                [{item.liga}]
              </span>
              <span className="text-white text-[10px] md:text-xs font-black uppercase italic group-hover:underline transition-all">
                {item.title ? item.title.replace(/\*\*/g, "") : "Evento en Vivo"}
              </span>
              <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mx-2" />
            </Link>
          ))}
        </div>
      </div>

      {/* CSS para la animación */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}