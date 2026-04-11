// app/eventos-hoy/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";

async function getEventos() {
  // Forzamos que no use caché para que siempre veas los partidos nuevos
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
    cache: 'no-store' 
  });
  return res.ok ? res.json() : [];
}

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const eventosData = await getEventos();
  
  // CORRECCIÓN AQUÍ: 
  // Como tu JSON no tiene campo "slug", generamos uno temporal 
  // basado en el título para comparar con la URL
  const partido = eventosData.find((e: any) => {
    const tempSlug = e.titulo
      .toLowerCase()
      .replace(/[^\w ]+/g, '') // Quita símbolos raros
      .replace(/ +/g, '-');    // Cambia espacios por guiones
    
    return tempSlug === params.slug;
  });

  if (!partido) {
    return notFound(); // Si no coincide el nombre, lanza el 404
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black mb-8 text-white uppercase border-l-4 border-red-600 pl-4">
          {partido.titulo}
        </h1>
        
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10 mb-10">
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-lg">
            {partido.contenido}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <a 
            href="/SportLive/agenda.html"
            className="group flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-bounce"
          >
            <PlayCircle className="w-8 h-8" />
            VER PARTIDO EN VIVO
          </a>
          <p className="mt-6 text-zinc-500 text-sm font-bold tracking-tighter uppercase">
            Transmisión oficial SportLive HD
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}