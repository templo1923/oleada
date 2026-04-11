import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";

async function getEventos() {
  const res = await fetch('https://tucentral.store/Sportlive/eventos-auto.json', { 
    cache: 'no-store' 
  });
  return res.ok ? res.json() : [];
}

// 🔥 MAGIA SEO DINÁMICA PARA REDES SOCIALES Y GOOGLE 🔥
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const eventosData = await getEventos();
  
  // Usamos e.slug directo del JSON
  const partido = eventosData.find((e: any) => e.slug === resolvedParams.slug);

  if (!partido) return { title: 'Evento no encontrado' };

  // Usamos partido.content (en inglés, como viene en el JSON)
  const descCorta = partido.content ? partido.content.substring(0, 150) + "..." : "Transmisión HD gratis en SportLive Premium.";

  return {
    title: `${partido.title} EN VIVO`, // partido.title en lugar de titulo
    description: descCorta,
    openGraph: {
      title: `🔴 EN VIVO: ${partido.title}`,
      description: descCorta,
      url: `https://oleadatvpremium.com/eventos-hoy/${resolvedParams.slug}`,
      type: "website",
      images: [{ url: "https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png", width: 512, height: 512 }]
    },
    twitter: {
      card: "summary_large_image",
      title: `🔴 EN VIVO: ${partido.title}`,
      description: descCorta,
      images: ["https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png"],
    }
  }
}

// 📺 LA PÁGINA VISUAL 
export default async function EventoPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const eventosData = await getEventos();
  
  // 🔥 CORRECCIÓN: Tu PHP ya manda el slug perfecto, solo lo comparamos.
  const partido = eventosData.find((e: any) => e.slug === resolvedParams.slug);

  if (!partido) {
    return notFound(); 
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black mb-8 text-white uppercase border-l-4 border-red-600 pl-4">
          {partido.title} {/* Corregido: title */}
        </h1>
        
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10 mb-10">
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-lg">
            {partido.content} {/* Corregido: content */}
          </div>
        </div>

        {/* Formulario invisible de seguridad */}
        <div className="flex flex-col items-center justify-center">
          <form action="/SportLive/agenda.html" method="GET" className="m-0 p-0">
            <button 
              type="submit"
              className="group flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-bounce cursor-pointer border-none"
            >
              <PlayCircle className="w-8 h-8" />
              VER PARTIDO EN VIVO
            </button>
          </form>
          <p className="mt-6 text-zinc-500 text-sm font-bold tracking-tighter uppercase">
            Transmisión oficial SportLive HD
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}