import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MoviesHero } from "@/components/movies/movies-hero"
import { MoviesCatalog } from "@/components/movies/movies-catalog"

export const metadata: Metadata = {
  title: "Peliculas y Estrenos HD | Cine Online Gratis | SportLive Tv Premium",
  description: "Ver peliculas online gratis en HD. Estrenos de cine, accion, terror, comedia, drama y mas generos. Catalogo actualizado diariamente.",
  keywords: "ver peliculas online gratis, estrenos de cine, peliculas hd, peliculas accion, peliculas terror, peliculas comedia",
  openGraph: {
    title: "Peliculas y Estrenos HD | Cine Online Gratis",
    description: "Ver peliculas online gratis en HD. Estrenos de cine actualizados diariamente.",
    type: "website",
  },
}

export default function CineEstrenosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <MoviesHero />
        <MoviesCatalog />
      </main>
      <Footer />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Catalogo de Peliculas",
            "description": "Peliculas y estrenos de cine en HD",
            "numberOfItems": 100,
            "itemListElement": [
              { "@type": "Movie", "position": 1, "name": "Estrenos 2024" },
              { "@type": "Movie", "position": 2, "name": "Peliculas Populares" },
            ]
          })
        }}
      />
    </div>
  )
}
