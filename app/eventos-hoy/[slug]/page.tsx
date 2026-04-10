// app/eventos-hoy/[slug]/page.tsx
import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PlayCircle, Calendar, Clock, Trophy } from "lucide-react"

// Esta interfaz representa la data que el Scraper insertará en tu DB o JSON
interface EventoData {
  titulo: string;
  descripcion: string;
  equipoLocal: string;
  equipoVisitante: string;
  hora: string;
  liga: string;
  imagen: string;
}

export default function EventoPage({ params }: { params: { slug: string } }) {
  // Aquí la lógica para traer la info del partido según el slug
  // Por ahora simulamos la data que vendría del Scraper
  const evento: EventoData = {
    titulo: "Real Madrid vs Manchester City en Vivo",
    descripcion: "No te pierdas el partidazo de la jornada. Análisis, alineaciones y dónde ver la transmisión oficial.",
    equipoLocal: "Real Madrid",
    equipoVisitante: "Manchester City",
    hora: "21:00",
    liga: "Champions League",
    imagen: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto pt-24 pb-12 px-4">
        <article className="max-w-4xl mx-auto space-y-8">
          
          {/* Encabezado del Evento */}
          <div className="text-center space-y-4">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              EN VIVO HOY
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
              {evento.equipoLocal} vs {evento.equipoVisitante}
            </h1>
            <div className="flex justify-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2"><Trophy size={18}/> {evento.liga}</span>
              <span className="flex items-center gap-2"><Clock size={18}/> {evento.hora}</span>
            </div>
          </div>

          {/* Imagen y Previa (SEO) */}
          <div className="aspect-video rounded-xl overflow-hidden border bg-muted">
             <img src={evento.imagen} alt={evento.titulo} className="w-full h-full object-cover opacity-80" />
          </div>

          <div className="prose prose-invert max-w-none text-lg">
            <p>{evento.descripcion}</p>
            <p>Para ver este evento en alta definición y sin interrupciones, accede a nuestra agenda oficial de canales premium a continuación.</p>
          </div>

          {/* EL BOTÓN DE ARBITRAJE (MÁGICO) */}
          <div className="flex justify-center py-10">
            <Button 
              size="lg" 
              className="px-12 py-8 text-2xl font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--primary),0.5)]"
              onClick={() => {
                // 1. Abrir Publicidad en pestaña nueva (Smartlink de Monetag)
                window.open('TU_LINK_DE_MONETAG_O_ADSTERRA', '_blank');
                
                // 2. Redirigir la pestaña actual a la agenda de SportLive
                window.location.href = '/SportLive/agenda.html';
              }}
            >
              <PlayCircle className="mr-3" size={32} />
              VER PARTIDO EN HD
            </Button>
          </div>

        </article>
      </main>
      <Footer />
    </div>
  )
}