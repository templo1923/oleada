// app/eventos-hoy/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";
// Importamos el JSON generado por el bot de GitHub
import eventosData from "@/data/eventos-auto.json";

export default function EventoPage({ params }: { params: { slug: string } }) {
  // Buscamos el partido específico en el archivo por su slug
  const partido = eventosData.find((e: any) => e.slug === params.slug);

  // Si el bot no ha generado ese partido o el slug no existe, mostramos error 404
  if (!partido) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          {partido.title} {/* Ejemplo: Real Madrid vs Barcelona */}
        </h1>
        
        <div className="prose prose-invert max-w-none mb-10">
          <p className="text-lg leading-relaxed">
            {partido.content} {/* Aquí sale el texto que redactó Groq */}
          </p>
        </div>

        <div className="flex justify-center border-t border-muted pt-10">
          <Button 
            size="lg" 
            className="px-10 py-8 text-xl font-bold rounded-full animate-pulse bg-primary"
            onClick={() => {
              // 1. Dispara el anuncio (Direct Link) - Reemplaza con tu enlace de Monetag
              window.open('https://your-monetag-link.com', '_blank');
              // 2. Manda al usuario a tu agenda real de SportLive
              window.location.href = '/SportLive/agenda.html';
            }}
          >
            <PlayCircle className="mr-2" />
            VER TRANSMISIÓN EN VIVO
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}