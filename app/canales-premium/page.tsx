import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChannelsHero } from "@/components/channels/channels-hero"
import { ChannelsGrid } from "@/components/channels/channels-grid"

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Canales Premium TV En Vivo | ESPN, Win Sports, HBO | SportLive",
  description: "Ver canales de TV premium en vivo. ESPN en vivo, Win Sports online, Fox Sports, HBO, y más canales gratis en HD.",
  keywords: "ver canales deportivos gratis, win sports online, espn en vivo, fox sports gratis, hbo en vivo, canales premium tv",
}

// 🚨 MOTOR: Listado completo 🚨
async function getFullCatalog() {
  try {
const fetchOptions = { 
  next: { revalidate: 300 }, 
  headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } 
};
const res = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);


    const data = await res.json();
    
    let allChannels: any[] = [];
    
    for (const cat in data) {
      if (!cat.toUpperCase().includes("EVENTO")) { 
        const activos = data[cat].filter((c: any) => c.Estado !== "Inactivo");
        
        const formatted = activos.map((c: any) => ({
            id: c.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus'),
            name: c.Canal,
            logo: c.Logo,
            category: cat,
            description: `Disfruta de la mejor programación de ${c.Canal} en alta calidad Full HD, estable y sin cortes. Transmisión 24/7 en SportLive.`,
            isLive: true,
            currentProgram: "Programación Regular",
            schedule: [
                { time: "00:00", program: "Transmisión Activa 24 Horas" },
                { time: "12:00", program: "Programación en Vivo" }
            ]
        }));
        
        allChannels = [...allChannels, ...formatted];
      }
    }
    return allChannels;
  } catch (error) {
    return [];
  }
}

export default async function CanalesPremiumPage() {
  const canales = await getFullCatalog();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ChannelsHero />
        {/* Pasamos los datos al componente interactivo */}
        <ChannelsGrid initialChannels={canales} />
      </main>
      <Footer />
    </div>
  )
}