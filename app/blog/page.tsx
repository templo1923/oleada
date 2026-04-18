import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { BlogHero } from "@/components/blog/blog-hero"
import { BlogGrid } from "@/components/blog/blog-grid"

export const metadata: Metadata = {
  title: "Blog | Guias y Comparativas de Streaming | SportLive Tv Premium",
  description: "Guias, comparativas y articulos sobre streaming, deportes en vivo y peliculas. Alternativas a Pelota Libre, Roja Directa y mas.",
  keywords: "alternativas pelota libre, alternativas roja directa, ver futbol gratis, mejores paginas streaming, guias streaming",
  openGraph: {
    title: "Blog | Guias y Comparativas de Streaming",
    description: "Guias, comparativas y articulos sobre streaming y deportes en vivo.",
    type: "website",
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-16">
        <BlogHero />
        <BlogGrid />
      </main>
      <Footer />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "OleadaTV Blog",
            "description": "Guias y comparativas de streaming",
            "url": "https://oleadatvpremium.com/blog",
            "blogPost": [
              {
                "@type": "BlogPosting",
                "headline": "Alternativas a Pelota Libre",
                "description": "Las mejores alternativas para ver deportes en vivo"
              }
            ]
          })
        }}
      />
    </div>
  )
}
