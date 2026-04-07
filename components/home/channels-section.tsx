import Link from "next/link"
import { Tv, ChevronRight, Play, Star, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getFeaturedChannels() {
  try {
    const fetchOptions = { 
      next: { revalidate: 300 }, 
      headers: { 'Origin': 'https://oleadatvpremium.com', 'Referer': 'https://oleadatvpremium.com/' } 
    };
    const res = await fetch('https://api.telelatinomax.shop/canales.php', fetchOptions);
    const data = await res.json();
    
    let allChannels: any[] = [];
    
    const categories = Object.keys(data).sort((a, b) => {
      if (a.toUpperCase().includes('DEPORT')) return -1;
      if (b.toUpperCase().includes('DEPORT')) return 1;
      return 0;
    });

    for (const cat of categories) {
      if (!cat.toUpperCase().includes("EVENTO")) { 
        const activos = data[cat].filter((c: any) => c.Estado !== "Inactivo");
        activos.forEach((c: any) => c.categoriaAsignada = cat);
        allChannels = [...allChannels, ...activos];
      }
    }
    
    return allChannels.slice(0, 8);
  } catch (error) {
    return [];
  }
}

export async function ChannelsSection() {
  const featuredChannels = await getFeaturedChannels();

  return (
    <section className="py-16 lg:py-24 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00d4ff] to-primary glow-blue">
                <Tv className="h-5 w-5 text-background" />
              </div>
              <span className="text-sm font-medium text-[#00d4ff] uppercase tracking-wider">Canales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Canales Premium en Tendencia</h2>
            <p className="mt-2 text-muted-foreground">La mejor programación 24/7 disponible ahora</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href="/canales-premium">
              Ver Todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredChannels.map((channel, idx) => {
            const cleanId = channel.Canal.toLowerCase().replace(/\s+/g, '').replace(/\+/g, 'plus');
            const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.Canal)}&background=1e3a8a&color=fff&bold=true`;
            const realLogo = channel.Logo || fallbackLogo;
            
            // 🚨 AQUÍ ESTÁ EL AJUSTE: Ahora apunta a la página SEO del canal 🚨
            const urlSEO = `/canal/${cleanId}?n=${encodeURIComponent(channel.Canal)}&c=${encodeURIComponent(channel.categoriaAsignada)}&l=${encodeURIComponent(realLogo)}`;

            return (
              <Link
                key={idx}
                href={urlSEO} 
                className="group relative rounded-2xl glass overflow-hidden card-hover block"
              >
                <div className="absolute top-3 right-3 z-10">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-black uppercase">
                    <Star className="h-3 w-3 fill-current" /> Premium
                  </span>
                </div>

                <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-secondary to-muted/50 overflow-hidden p-4 w-full">
                  <img 
                    src={realLogo} 
                    alt={channel.Canal} 
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                  
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/90 text-white text-[10px] font-black tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-white live-indicator" /> LIVE
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-background glow-green">
                      <Play className="h-6 w-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/20">
                  <h3 className="font-bold text-white truncate text-sm">{channel.Canal}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">{channel.categoriaAsignada}</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <Flame className="h-3 w-3" /> Estable
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#00d4ff] to-primary text-background font-semibold shine glow-blue hover:opacity-90 transition-opacity"
            asChild
          >
            <Link href="/canales-premium">
              <Tv className="mr-2 h-5 w-5" /> Ver Todos los Canales Premium
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}