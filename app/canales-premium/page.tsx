import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { ChannelsHero } from "@/components/channels/channels-hero"
import { ChannelsGrid } from "@/components/channels/channels-grid"

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  // Lo dejamos corto porque el layout le suma " | SportLive Tv Premium"
  title: "Canales Premium TV en Vivo", 
  description: "Ver canales de TV premium en vivo. ESPN en vivo, Win Sports online, Fox Sports, HBO, y más canales gratis en HD.",
  keywords: "ver canales deportivos gratis, win sports online, espn en vivo, fox sports gratis, hbo en vivo, canales premium tv",
  
  // 🔥 LA TARJETA PARA WHATSAPP / FACEBOOK 🔥
  openGraph: {
    title: "Canales Premium TV en Vivo 📺 | SportLive",
    description: "Disfruta de ESPN, Win Sports, Fox Sports, HBO y más de 500 canales premium totalmente gratis en HD.",
    url: "https://oleadatvpremium.com/canales-premium", // 👈 La ruta exacta
    images: [
      {
        url: "https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png",
        width: 512,
        height: 512,
      },
    ],
  },
  
  // 🔥 LA TARJETA PARA TWITTER / X 🔥
  twitter: {
    card: "summary_large_image",
    title: "Canales Premium TV en Vivo 📺 | SportLive",
    description: "Disfruta de más de 500 canales premium totalmente gratis en HD.",
    images: ["https://oleadatvpremium.com/SportLive/icons/icon2-512x512.png"],
  }
}

// 🚨 MOTOR: Listado completo 🚨
// 🚨 Ajuste en la función getFullCatalog
// 🚨 Motor: Listado ajustado y filtrado
async function getFullCatalog() {
  try {
    const fetchOptions = { 
      next: { revalidate: 300 }, 
      headers: { 
        'Origin': 'https://oleadatvpremium.com', 
        'Referer': 'https://oleadatvpremium.com/' 
      } 
    };
    const res = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);
    const data = await res.json();
    
    let allChannels: any[] = [];
    
    for (const cat in data) {
      const catUpper = cat.toUpperCase();

      // 1. FILTRO: Saltamos categorías de EVENTOS y CINE 24/7
      if (!catUpper.includes("CINE 24/7")) { 
        
        // 2. Filtramos solo canales activos
        const activos = data[cat].filter((c: any) => c.Estado !== "Inactivo");

        // 3. LIMITACIÓN: Tomamos solo los primeros 20 canales por categoría 
        // para que la landing cargue rápido y no sea infinita
        const limitados = activos.slice(0, 20);
        
        const formatted = limitados.map((c: any) => ({
            // 4. FIX 404: Limpieza profunda del ID para que la URL sea válida
            id: c.Canal.toLowerCase()
                .trim()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita tildes
                .replace(/\s+/g, '-') // Espacios por guiones
                .replace(/[^\w\-]+/g, '') // Quita símbolos raros
                .replace(/\+/g, 'plus'),
            name: c.Canal,
            logo: c.Logo,
            category: cat,
            description: `Disfruta de la mejor programación de ${c.Canal} en alta calidad Full HD.`,
            isLive: true,
            currentProgram: "Programación Regular",
            schedule: [
                { time: "00:00", program: "Transmisión Activa" }
            ]
        }));
        
        allChannels = [...allChannels, ...formatted];
      }
    }
    return allChannels;
  } catch (error) {
    console.error("Error en catálogo:", error);
    return [];
  }
}

export default async function CanalesPremiumPage() {
  const canales = await getFullCatalog();

  return (
    <div className="min-h-screen bg-background">
      >
      <main className="pt-16">
        <ChannelsHero />
        {/* Pasamos los datos al componente interactivo */}
        <ChannelsGrid initialChannels={canales} />
      </main>
      <Footer />
    </div>
  )
}