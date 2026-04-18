"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ChevronRight } from "lucide-react";

export function CountdownTimer({ evento }: { evento: any }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!evento?.date) return;

    // Calculamos el tiempo basado en la fecha del evento
    const targetDate = new Date(evento.date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsLive(true);
        clearInterval(interval);
      } else {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [evento]);

  if (!evento) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 relative group">
      {/* Efecto de resplandor de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 blur-xl rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xl">
        
        {/* Decoración geométrica sutil */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>

        {/* Info del Partido */}
        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          <div className="w-16 h-16 bg-white/5 rounded-2xl p-2 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
            <img src={evento.image} alt={evento.liga} className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Timer className="w-3 h-3" /> Partido Destacado
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none">
              {evento.title.split(':')[0].replace(/\*\*/g, "")} {/* Solo muestra "Local vs Visita" */}
            </h3>
            <span className="text-slate-400 text-xs font-medium mt-1">{evento.liga}</span>
          </div>
        </div>

        {/* Cronómetro y Botón */}
        <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full md:w-auto justify-end">
          
          {isLive ? (
            <div className="bg-red-600/20 border border-red-500/30 px-6 py-3 rounded-xl flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-500 font-black tracking-widest uppercase text-sm">En Vivo Ahora</span>
            </div>
          ) : (
            <div className="flex gap-3 text-center">
              <div className="flex flex-col bg-black/50 border border-white/5 rounded-xl w-14 h-14 md:w-16 md:h-16 justify-center shadow-inner">
                <span className="text-xl md:text-2xl font-black text-white tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Hrs</span>
              </div>
              <div className="text-2xl font-black text-white/20 self-center mb-4">:</div>
              <div className="flex flex-col bg-black/50 border border-white/5 rounded-xl w-14 h-14 md:w-16 md:h-16 justify-center shadow-inner">
                <span className="text-xl md:text-2xl font-black text-white tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Min</span>
              </div>
              <div className="text-2xl font-black text-white/20 self-center mb-4">:</div>
              <div className="flex flex-col bg-black/50 border border-white/5 rounded-xl w-14 h-14 md:w-16 md:h-16 justify-center shadow-inner">
                <span className="text-xl md:text-2xl font-black text-red-500 tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Seg</span>
              </div>
            </div>
          )}

          <Link 
            href={`/eventos-hoy/${evento.slug}`}
            className="w-full md:w-auto bg-white text-black hover:bg-red-600 hover:text-white px-6 py-4 rounded-xl font-black uppercase tracking-wide text-xs transition-all flex items-center justify-center gap-2"
          >
            {isLive ? 'Ver Transmisión' : 'Ir a la Previa'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}