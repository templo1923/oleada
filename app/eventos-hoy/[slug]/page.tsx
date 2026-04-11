// app/eventos-hoy/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";

// 1. Cambiamos la importación para leer de tu API externa en lugar del archivo local
async function getEventos() {
  const res = await fetch('https://api.telelatinomax.shop/api/eventos-auto.json', { 
    cache: 'no-store' 
  });
  return res.ok ? res.json() : [];
}

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const eventosData = await getEventos();
  const partido = eventosData.find((e: any) => e.slug === params.slug);

  if (!partido) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black text-center mb-8 uppercase text-primary">
          {partido.title}
        </h1>
        
        <div className="prose prose-invert max-w-none mb-10 text-slate-300 leading-relaxed whitespace-pre-line">
          {/* Usamos whitespace-pre-line para que los saltos de línea del bot se vean bien */}
          {partido.content}
        </div>

        <div className="flex flex-col items-center justify-center border-t border-white/10 pt-10">
          {/* IMPORTANTE: Cambiamos el Button por un <a> (Enlace)
              Esto evita el error de servidor y funciona perfecto para arbitraje.
          */}
          <a 
            href="/SportLive/agenda.html"
            className="group relative flex items-center gap-3 px-12 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse"
          >
            <PlayCircle className="w-8 h-8" />
            VER TRANSMISIÓN EN VIVO
          </a>
          <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
            Señal HD • Sin Cortes • Agenda SportLive
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}