import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { Metadata } from 'next';

// 1. Lógica para traer los datos desde tu hosting
async function getEventos() {
  const res = await fetch('https://api.telelatinomax.shop/api/eventos-auto.json', { 
    next: { revalidate: 600 } // Se actualiza cada 10 min
  });
  return res.ok ? res.json() : [];
}

// 2. SEO DINÁMICO: Esto es lo que te posiciona en Google
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const eventos = await getEventos();
  const partido = eventos.find((e: any) => e.slug === params.slug);
  
  if (!partido) return { title: 'Evento no encontrado' };

  return {
    title: `${partido.title} | Alineaciones y Dónde Ver`,
    description: partido.content.substring(0, 160),
    openGraph: {
      title: partido.title,
      description: 'Sigue la transmisión en vivo, alineaciones y pronóstico aquí.',
      type: 'article'
    }
  };
}

export default async function EventoPage({ params }: { params: { slug: string } }) {
  const eventos = await getEventos();
  const partido = eventos.find((e: any) => e.slug === params.slug);

  if (!partido) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-3xl">
        <article>
          <h1 className="text-3xl sm:text-4xl font-black text-center mb-8 uppercase text-primary">
            {partido.title}
          </h1>
          
          <div className="prose prose-invert max-w-none mb-10 text-slate-300 leading-relaxed">
            {/* El contenido de la IA de Groq */}
            {partido.content.split('\n').map((line: string, i: number) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-10">
             <a 
              href="/SportLive/agenda.html"
              className="group relative flex items-center gap-3 px-12 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              <PlayCircle className="w-8 h-8" />
              ACCEDER A LA SEÑAL EN VIVO
            </a>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Calidad 4K • Sin Cortes • Agenda SportLive
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}