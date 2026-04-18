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
        news = data.slice(0, 8); // Suficiente con los 8 más recientes
      }
    }
  } catch (e) {
    return null;
  }

  if (news.length === 0) return null;

  return (
    <div className="w-full bg-black border-b border-white/5 h-8 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        {/* Etiqueta roja sutil */}
        <div className="flex items-center gap-1.5 mr-4 bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20">
          <Zap className="w-3 h-3 text-red-500 fill-current animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-red-500 italic">En Vivo</span>
        </div>

        {/* Cinta de noticias lenta y limpia */}
        <div className="flex-grow overflow-hidden relative h-full flex items-center">
          <div className="animate-ticker flex whitespace-nowrap items-center">
            {news.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={`/eventos-hoy/${item.slug}`}
                className="flex items-center gap-2 mx-6 group"
              >
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{item.liga}</span>
                <span className="text-slate-300 text-[11px] font-semibold group-hover:text-red-500 transition-colors">
                  {item.title.replace(/\*\*/g, "")}
                </span>
                <span className="text-white/10 ml-4">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite; /* Mucho más lento y legible */
          width: max-content;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}