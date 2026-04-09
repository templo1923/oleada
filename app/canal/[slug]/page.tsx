import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Trophy, Tv, ArrowLeft, Activity, Radio, Info, CheckCircle2, Search, CalendarDays } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic';

// ==========================================
// 🧠 1. CEREBRO SEO PRO (Detecta si es Partido o Canal aunque venga pegado)
// ==========================================
function analizarContenido(rawName: string) {
  let nombreLimpio = rawName.replace(/[-_]/g, ' ').toUpperCase();
  // ... (tu lógica de limpieza de espacios VS que ya tenemos)

  const esPartido = nombreLimpio.includes(' VS ') || nombreLimpio.includes(' X ');
  
  if (esPartido) {
    return {
      nombreLimpio,
      esPartido,
      // 🔥 Título directo al grano para Google
      tituloSeo: `¿Dónde ver ${nombreLimpio} EN VIVO? | Link Hoy HD`, 
      descSeo: `¿Buscas dónde ver ${nombreLimpio} en vivo por internet? Haz clic aquí para acceder a la transmisión oficial en HD, sin cortes y totalmente gratis. link actualizado hoy.`,
      h1Titulo: `¿Dónde ver ${nombreLimpio} en vivo?`, // El H1 es clave
      tipoContenido: 'Evento Deportivo'
    };
  } else {
    return {
      nombreLimpio,
      esPartido,
      tituloSeo: `¿Cómo ver ${nombreLimpio} Online Gratis? | Señal 24/7`,
      descSeo: `Sintoniza la señal de ${nombreLimpio} en vivo por internet. Disfruta de toda la programación premium en alta definición desde cualquier dispositivo.`,
      h1Titulo: `Ver ${nombreLimpio} En Vivo por Internet`,
      tipoContenido: 'Canal Premium'
    };
  }
}

// ==========================================
// 🤖 2. METADATOS PARA GOOGLE BOT
// ==========================================
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const rawN = searchParams?.n ? String(searchParams.n) : params?.slug || '';
  const analisis = analizarContenido(rawN);
  
  return {
    title: analisis.tituloSeo,
    description: analisis.descSeo,
    keywords: analisis.keywordsSeo,
    openGraph: {
      title: analisis.tituloSeo,
      description: analisis.descSeo,
      type: "website",
    }
  }
}

// ==========================================
// 🎨 3. COMPONENTE PRINCIPAL (Diseño Premium)
// ==========================================
export default async function CanalPage(props: any) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const cleanId = params?.slug || '';
  const rawName = searchParams?.n ? String(searchParams.n) : cleanId;
  const { nombreLimpio, esPartido, tipoContenido } = analizarContenido(rawName);
  
  // Extraemos datos de la URL (si vienen)
  const categoria = searchParams?.c ? String(searchParams.c).toUpperCase() : (esPartido ? 'DEPORTES EN VIVO' : 'TV PREMIUM');
  
  // Si es un partido, dividimos los equipos para un diseño más épico
  let equipoA = nombreLimpio;
  let equipoB = "";
  if (esPartido) {
    const partes = nombreLimpio.includes(' VS ') ? nombreLimpio.split(' VS ') : nombreLimpio.split(' X ');
    equipoA = partes[0].trim();
    equipoB = partes[1] ? partes[1].trim() : "";
  }

  // Fallback del logo
  const logoUrl = searchParams?.l ? String(searchParams.l) : (
    esPartido 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(equipoA.charAt(0)+equipoB.charAt(0))}&background=1e3a8a&color=fff&bold=true&size=200`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreLimpio)}&background=1e3a8a&color=fff&bold=true&size=200`
  );

  // Link al reproductor final
  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?canal=${cleanId}`;

  return (
    <div className="relative min-h-screen bg-[#080c14] overflow-x-hidden flex flex-col w-full font-['Outfit']">
      <Navbar />
      
      <main className="pt-24 pb-12 flex-1 w-full flex flex-col items-center relative">
        
        {/* Fondo Brillante (Hero Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-background to-background pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full relative z-10">
          
          {/* Botón Volver */}
          <div className="flex justify-start mb-6">
            <Link href={esPartido ? "/agenda-deportiva" : "/canales-premium"} className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver a {esPartido ? "la Agenda" : "los Canales"}
            </Link>
          </div>

          {/* 🔥 BANNER PRINCIPAL (HERO) 🔥 */}
          <div className="w-full bg-gradient-to-b from-[#111827] to-[#080c14] rounded-[2rem] border border-white/10 p-6 sm:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            
            {/* Decoración de fondo en el banner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              
              {/* Etiquetas Superiores */}
              <div className="flex justify-center flex-wrap gap-3 mb-8">
                <div className="inline-flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></span>
                  En Directo
                </div>
                <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest bg-blue-400/10 px-4 py-2 rounded-xl border border-blue-400/20">
                  <Activity className="w-3.5 h-3.5" /> HD 1080p
                </div>
                <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  {esPartido ? <Trophy className="w-3.5 h-3.5 text-yellow-500" /> : <Tv className="w-3.5 h-3.5" />} {categoria}
                </div>
              </div>

              {/* Lógica Visual: Si es partido, mostramos el "VS". Si es canal, solo el logo. */}
              {esPartido ? (
                <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 w-full max-w-3xl">
                  <div className="flex-1 flex justify-end">
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white text-right leading-tight">{equipoA}</h2>
                  </div>
                  <div className="shrink-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      <span className="text-sm sm:text-lg font-black text-blue-400 italic">VS</span>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-start">
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-300 text-left leading-tight">{equipoB}</h2>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-3xl p-4 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex items-center justify-center border border-white/10 mb-8 backdrop-blur-md">
                   <img src={logoUrl} alt={`Logo ${nombreLimpio}`} className="w-full h-full object-contain drop-shadow-xl" />
                </div>
              )}

              {/* Título y Descripción Principal */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight uppercase max-w-4xl">
                Transmisión Oficial de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00d4ff]">{esPartido ? "Este Encuentro" : nombreLimpio}</span>
              </h1>
              
              <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Haz clic en el botón de abajo para iniciar el reproductor seguro. Disfruta de la mejor calidad de streaming, sin interrupciones y totalmente gratis.
              </p>

              {/* Botón de Acción Gigante */}
              <div className="w-full sm:w-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-[#00d4ff] rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <Button size="lg" className="relative w-full sm:w-auto min-w-[280px] px-8 py-7 sm:py-8 rounded-2xl font-black text-base sm:text-lg uppercase tracking-widest bg-gradient-to-r from-blue-600 to-[#00d4ff] hover:scale-[1.02] transition-all border border-white/20 text-white shadow-xl" asChild>
                  <Link href={linkReproductor} target="_blank" rel="noopener noreferrer">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 mr-3 fill-current" /> Entrar a la Transmisión
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* ==========================================
              📝 CONTENIDO RICO PARA GOOGLE (SEO BAIT) 📝
              El texto cambia inteligentemente si es Canal o Partido
              ========================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            
            {/* Tarjeta 1: Información del Evento/Canal */}
            <div className="bg-[#111827]/80 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-5">
                 {esPartido ? <CalendarDays className="w-7 h-7 text-blue-400" /> : <Tv className="w-7 h-7 text-blue-400" />}
                 <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                   Detalles del {tipoContenido}
                 </h2>
              </div>
              
              {esPartido ? (
                // Texto SEO para PARTIDOS
                <div className="space-y-4 text-slate-400 text-[15px] leading-relaxed">
                  <p>
                    Estás a un paso de ver el esperado enfrentamiento entre <strong className="text-white">{equipoA}</strong> y <strong className="text-white">{equipoB}</strong>. Este evento deportivo está catalogado dentro de la competición de <strong>{categoria}</strong>.
                  </p>
                  <p>
                    Nuestra plataforma se encarga de recopilar las mejores señales públicas de la red para ofrecerte el minuto a minuto del encuentro. No te pierdas ninguna jugada, gol o punto decisivo con nuestra transmisión optimizada para navegadores móviles y de escritorio.
                  </p>
                </div>
              ) : (
                // Texto SEO para CANALES
                <div className="space-y-4 text-slate-400 text-[15px] leading-relaxed">
                  <p>
                    <strong className="text-white">{nombreLimpio}</strong> es una de las opciones televisivas más destacadas en la categoría de <strong>{categoria}</strong>. A través de este portal, puedes sintonizar su programación en directo las 24 horas del día.
                  </p>
                  <p>
                    Disfruta de tus programas favoritos, noticieros, series, películas o análisis deportivos emitidos por esta cadena, con una latencia mínima y calidad de video autoadaptable a la velocidad de tu internet.
                  </p>
                </div>
              )}
            </div>

            {/* Tarjeta 2: Beneficios y Keywords */}
            <div className="bg-[#111827]/80 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-5">
                 <Radio className="w-7 h-7 text-blue-400" />
                 <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                   ¿Cómo ver la señal online?
                 </h2>
              </div>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-6">
                Para acceder a la transmisión en vivo de <strong className="text-white">{nombreLimpio}</strong>, solo presiona el botón principal de reproducción. Nuestro reproductor nativo garantiza:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[14px] text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Estabilidad 1080p:</strong> Resolución en alta definición (Full HD) que se ajusta a tu ancho de banda.</span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Multiplataforma:</strong> Reproducción fluida desde celulares (Android/iOS), Tablets, PC y Smart TVs.</span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Servidores Espejo:</strong> Enlaces de respaldo automáticos para evitar pausas durante el {esPartido ? "partido" : "programa"}.</span>
                </li>
              </ul>
            </div>

            {/* Tarjeta 3: Seguridad y Aviso (A lo ancho) */}
            <div className="md:col-span-2 bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 rounded-[2rem] p-8 mt-2 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/30">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide mb-3">
                  Transmisión Segura y Gratuita
                </h2>
                <p className="text-slate-400 text-[14px] sm:text-[15px] leading-relaxed">
                  El acceso a <strong className="text-slate-200">{nombreLimpio}</strong> mediante nuestra web es directo. No requieres crear cuentas de usuario, instalar complementos sospechosos, ni proporcionar datos bancarios. Navegas bajo un protocolo de conexión cifrada (SSL) que protege tu privacidad digital en todo momento.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}