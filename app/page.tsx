import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SportsSection } from "@/components/home/sports-section"
import { ChannelsSection } from "@/components/home/channels-section"
import { MoviesSection } from "@/components/home/movies-section"
import { CTASection } from "@/components/home/cta-section"
import { NewsSection } from "@/components/home/news-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        {/* Ya no llamamos a FeaturedEvents aquí */}
          <NewsSection />
        <SportsSection />
        <ChannelsSection />
        <MoviesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}