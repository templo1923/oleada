import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export async function NewsTicker() {
  let news: any[] = [];

  try {
    const res = await fetch("https://tucentral.store/Sportlive/eventos-auto.json", {
      next: { revalidate: 300 }
    });
    
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        news = data.slice(0, 10);
      }
    }
  } catch (e) {
    console.error("Error en Ticker:", e);
  }

  if (news.length === 0) return null;

  return (
    // 🔥 Diseño de "Píldora" flotante, centrada, con bordes redondeados y efecto cristal 🔥
    <div className="fixed top-[75px] md:top-[85px] left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-full h-10 md:h-11 flex items-center overflow-hidden z-[45] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Etiqueta "Tendencias" elegante */}
      <div className="bg-red-600/10 text-red-500 px-4 md:px-6 h-full flex items-center gap-2 z-10 border-r border-red-500/20">
        <Zap className="w-3 h-3 md:w-4 md:h-4 fill-current animate-pulse" />
        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
          Tendencias
        </span>
      </div>

      {/* Contenedor Animado con bordes difuminados */}
      <div className="flex-grow overflow-hidden relative flex items-center h-full mask-edges">
        <div className="animate-marquee h-full flex items-center">
          {news.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/eventos-hoy/${item.slug}`}
              className="flex items-center gap-2 mx-4 md:mx-6 group"
            >
              <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest group-hover:text-white/70 transition-colors">
                {item.liga}
              </span>
              <span className="text-slate-300 text-[10px] md:text-sm font-medium group-hover:text-white transition-colors whitespace-nowrap">
                {item.title ? item.title.replace(/\*\*/g, "") : "Evento en Vivo"}
              </span>
              {/* Separador de puntos sutil */}
              <span className="w-1 h-1 bg-red-600/50 rounded-full mx-2" />
            </Link>
          ))}
          {/* Array duplicado para el bucle infinito */}
          {news.map((item, idx) => (
            <Link
              key={`dup-${item.id}-${idx}`}
              href={`/eventos-hoy/${item.slug}`}
              className="flex items-center gap-2 mx-4 md:mx-6 group"
            >
              <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest group-hover:text-white/70 transition-colors">
                {item.liga}
              </span>
              <span className="text-slate-300 text-[10px] md:text-sm font-medium group-hover:text-white transition-colors whitespace-nowrap">
                {item.title ? item.title.replace(/\*\*/g, "") : "Evento en Vivo"}
              </span>
              <span className="w-1 h-1 bg-red-600/50 rounded-full mx-2" />
            </Link>
          ))}
        </div>
      </div>

      {/* CSS Interno */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        /* 🔥 Magia CSS: Difumina los textos antes de que toquen los bordes de la barra 🔥 */
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}} />
    </div>
  );
}