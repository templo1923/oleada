import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SportsSection } from "@/components/home/sports-section"
import { ChannelsSection } from "@/components/home/channels-section"
import { MoviesSection } from "@/components/home/movies-section"
import { CTASection } from "@/components/home/cta-section"
import { NewsSection } from "@/components/home/news-section"
import { Metadata } from 'next'

// 🔥 2. SEO ESPECÍFICO PARA LA LANDING PAGE 🔥
// Al exportar esto, Next.js sobrescribe los datos del layout.tsx solo para esta página
export const metadata: Metadata = {
  title: 'Inicio', // Como usamos template en el layout, el resultado será "Inicio | SportLive Premium"
  description: 'Descubre SportLive Premium. La plataforma definitiva para ver deportes y televisión en vivo desde cualquier dispositivo.',
  openGraph: {
    title: 'Descarga SportLive Premium 🚀',
    description: 'La mejor App de entretenimiento ha llegado. Instálala ahora y no te pierdas ningún partido.',
    images: [
      {
        url: 'https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png', 
        width: 512,
        height: 512,
      },
    ],
  },
}

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