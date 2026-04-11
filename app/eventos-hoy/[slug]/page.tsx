// app/eventos-hoy/[slug]/page.tsx
import { notFound } from "next/navigation"

export default async function EventoPage({ params }: { params: { slug: string } }) {
  // 1. Buscamos los datos en tu API de PHP
  const res = await fetch('https://api.telelatinomax.shop/api/eventos-auto.json', { cache: 'no-store' });
  const eventos = await res.json();

  // 2. Buscamos el partido que coincida con el slug de la URL
  const evento = eventos.find((e: any) => 
    e.titulo.toLowerCase().replace(/ /g, '-').includes(params.slug.split('-vs-')[0])
  );

  if (!evento) {
    return notFound(); // Si no existe el partido en el JSON, da 404
  }

  return (
    <main className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">{evento.titulo}</h1>
      <div className="bg-card p-6 rounded-lg border">
        <p className="whitespace-pre-line text-lg mb-8">
          {evento.contenido}
        </p>
        <a 
          href="/agenda-deportiva" 
          className="bg-primary text-white px-6 py-3 rounded-full font-bold animate-pulse"
        >
          VER EN VIVO HD
        </a>
      </div>
    </main>
  );
}