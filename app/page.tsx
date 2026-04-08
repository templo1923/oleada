import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SportsSection } from "@/components/home/sports-section"
import { ChannelsSection } from "@/components/home/channels-section"
import { MoviesSection } from "@/components/home/movies-section"
import { CTASection } from "@/components/home/cta-section"

// 🔥 1. IMPORTAMOS EL COMPONENTE DE EVENTOS DESTACADOS 🔥
import { FeaturedEvents } from "@/components/featured-events"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        
        {/* 🔥 2. LO COLOCAMOS AQUÍ, JUSTO ANTES DE LOS DEPORTES 🔥 */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
          <FeaturedEvents />
        </div>

        <SportsSection />
        <ChannelsSection />
        <MoviesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}