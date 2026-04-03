import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AgendaHero } from "@/components/agenda/agenda-hero"
import { AgendaFilters } from "@/components/agenda/agenda-filters"
import { AgendaGrid } from "@/components/agenda/agenda-grid"

export const metadata: Metadata = {
  title: "Agenda Deportiva | Partidos de Hoy En Vivo | OleadaTV Premium",
  description: "Donde ver partidos hoy en vivo. Futbol, Champions League, Copa Libertadores, Liga BetPlay, NBA, Tenis, UFC y mas eventos deportivos del dia.",
  keywords: "donde ver partidos hoy, futbol en vivo, champions league en vivo, libertadores en vivo, liga betplay, nba en vivo, tenis en vivo",
  openGraph: {
    title: "Agenda Deportiva | Partidos de Hoy En Vivo",
    description: "Donde ver partidos hoy en vivo. Futbol, Champions, Libertadores, NBA, Tenis y mas.",
    type: "website",
  },
}

export default function AgendaDeportivaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <AgendaHero />
        <section className="py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AgendaFilters />
            <AgendaGrid />
          </div>
        </section>
      </main>
      <Footer />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": "Agenda Deportiva - Partidos de Hoy",
            "description": "Programacion de eventos deportivos en vivo",
            "location": {
              "@type": "VirtualLocation",
              "url": "https://oleadatv.com/agenda-deportiva"
            }
          })
        }}
      />
    </div>
  )
}
