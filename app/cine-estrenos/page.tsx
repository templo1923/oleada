import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MoviesHero } from "@/components/movies/movies-hero"
import { MoviesCatalog } from "@/components/movies/movies-catalog"

export const metadata: Metadata = {
  // Solo el nombre de la sección, el layout pondrá " | SportLive Tv Premium"
  title: "Cine y Estrenos 24/7", 
  description: "Ver películas online gratis en HD. Estrenos de cine, acción, terror, comedia, drama y más géneros. Catálogo actualizado diariamente.",
  keywords: "ver peliculas online gratis, estrenos de cine, peliculas hd, peliculas accion, peliculas terror, peliculas comedia",
  
  // 🔥 CONFIGURACIÓN PARA COMPARTIR (WhatsApp, Facebook, etc.)
  openGraph: {
    title: "Cine y Estrenos HD 🍿 | SportLive Tv Premium",
    description: "Disfruta de los mejores estrenos de cine y tus películas favoritas totalmente gratis y en calidad HD.",
    url: "https://oleadatvpremium.com/cine-estrenos",
    type: "website",
    images: [
      {
        url: "https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png", // Tu logo premium
        width: 512,
        height: 512,
        alt: "SportLive Premium Cine",
      },
    ],
  },
  
  // 🔥 CONFIGURACIÓN PARA TWITTER / X
  twitter: {
    card: "summary_large_image",
    title: "Cine y Estrenos HD 🍿 | SportLive Tv Premium",
    description: "Ver películas online gratis. Catálogo actualizado diariamente.",
    images: ["https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png"],
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
