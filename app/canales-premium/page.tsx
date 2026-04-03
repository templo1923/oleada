import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChannelsHero } from "@/components/channels/channels-hero"
import { ChannelsGrid } from "@/components/channels/channels-grid"

export const metadata: Metadata = {
  title: "Canales Premium TV En Vivo | ESPN, Win Sports, HBO | OleadaTV",
  description: "Ver canales de TV premium en vivo. ESPN en vivo, Win Sports online, Fox Sports, HBO, beIN Sports y mas canales deportivos gratis en HD.",
  keywords: "ver canales deportivos gratis, win sports online, espn en vivo, fox sports gratis, hbo en vivo, canales premium tv",
  openGraph: {
    title: "Canales Premium TV En Vivo | ESPN, Win Sports, HBO",
    description: "Ver canales de TV premium en vivo. ESPN, Win Sports, Fox Sports, HBO y mas.",
    type: "website",
  },
}

export default function CanalesPremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ChannelsHero />
        <ChannelsGrid />
      </main>
      <Footer />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Canales de TV Premium",
            "description": "Lista de canales de television premium en vivo",
            "numberOfItems": 50,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "ESPN" },
              { "@type": "ListItem", "position": 2, "name": "Win Sports" },
              { "@type": "ListItem", "position": 3, "name": "Fox Sports" },
              { "@type": "ListItem", "position": 4, "name": "HBO" },
            ]
          })
        }}
      />
    </div>
  )
}
