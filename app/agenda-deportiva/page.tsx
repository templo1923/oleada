import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SportsSection } from "@/components/home/sports-section"
import { ChannelsSection } from "@/components/home/channels-section"
import { MoviesSection } from "@/components/home/movies-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    {/* 🚨 AQUÍ EL SEGUNDO CANDADO: overflow-x-hidden w-full 🚨 */}
    <div className="min-h-screen bg-background overflow-x-hidden w-full flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1 w-full">
        <HeroSection />
        <SportsSection />
        <ChannelsSection />
        <MoviesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}