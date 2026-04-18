import { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from "@/components/footer"
import { Play, ShieldCheck, Trophy, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import eventosData from "@/data/eventos-auto.json";

export const dynamic = 'force-dynamic';

// ==========================================
// 🧠 CEREBRO LIMPIADOR EXTREMO PARA EVENTOS DEPORTIVOS
// ==========================================
function procesarPartido(rawName: string) {
  let limpio = decodeURIComponent(rawName);

  // 1. Limpieza de basura: Quitar paréntesis, corchetes y su contenido (ej: (SEÑAL ACTIVA), [1080p])
  limpio = limpio.replace(/\[.*?\]|\(.*?\)/g, '').trim();
  limpio = limpio.replace(/<[^>]*>?/gm, '').trim();
  
  // Normalizar guiones largos a cortos para facilitar la lectura
  limpio = limpio.replace(/[–—]/g, '-');
  limpio = limpio.toUpperCase();

  // Eliminar la palabra "FOOTBALL", "FUTBOL" o similares si están solas al principio
  limpio = limpio.replace(/^(FOOTBALL|FÚTBOL|FUTBOL|SOCCER|BASKETBALL|BALONCESTO|TENNIS|TENIS|BASEBALL|BÉISBOL|HOCKEY|NHL|NFL|MLB|NBA)\s*/i, '');

  // 2. Extraer el Torneo/Liga (Si hay dos puntos ":")
  let torneo = "EVENTO DEPORTIVO";
  if (limpio.includes(':')) {
    const partes = limpio.split(':');
    torneo = partes[0].trim(); // Ej: "COPA DE CAMPEONES DE LA CONCACAF"
    limpio = partes.slice(1).join(':').trim(); // Nos quedamos solo con "TOLUCA - LA GALAXY"
  }

  // Quitar comas o guiones sueltos a los lados
  limpio = limpio.replace(/^[,\-\s]+|[,\-\s]+$/g, '');

  // 3. Separar los equipos inteligentemente
  let equipoA = "Local";
  let equipoB = "Visitante";
  let esPartido = false;

  if (limpio.includes(' VS ')) {
    const p = limpio.split(' VS '); equipoA = p[0].trim(); equipoB = p[1].trim(); esPartido = true;
  } else if (limpio.includes(' X ')) {
    const p = limpio.split(' X '); equipoA = p[0].trim(); equipoB = p[1].trim(); esPartido = true;
  } else if (limpio.includes(' V ')) {
    const p = limpio.split(' V '); equipoA = p[0].trim(); equipoB = p[1].trim(); esPartido = true;
  } else if (limpio.includes(' - ')) {
    // Si usaron guion para separar los equipos (Ej: TOLUCA - LA GALAXY)
    const p = limpio.split(' - '); equipoA = p[0].trim(); equipoB = p[1].trim(); esPartido = true;
  } else {
    // Es un evento único (Ej: UFC 300, Carrera de F1)
    equipoA = limpio; 
    esPartido = false;
  }

  // Limpieza final por si quedó alguna coma pegada al nombre del equipo
  if (equipoA.endsWith(',')) equipoA = equipoA.slice(0, -1).trim();
  if (equipoB.endsWith(',')) equipoB = equipoB.slice(0, -1).trim();

  // Generamos el SEO Dinámico
  const tituloSeo = esPartido ? `Ver ${equipoA} vs ${equipoB} EN VIVO | ${torneo} Online HD` : `Ver ${equipoA} EN VIVO | ${torneo} Online HD`;
  const descSeo = esPartido ? `No te pierdas el partido ${equipoA} vs ${equipoB} en directo por la ${torneo}. Disfruta de la mejor señal streaming, sin cortes y totalmente gratis.` : `No te pierdas ${equipoA} en directo por la ${torneo}. Disfruta de la mejor señal streaming, sin cortes y totalmente gratis.`;
  const keywordsSeo = esPartido ? `${equipoA} vs ${equipoB} en vivo, ver ${equipoA} hoy, transmision ${equipoB} gratis, futbol online hd, ${torneo}` : `${equipoA} en vivo, ver ${equipoA} gratis, streaming hd, ${torneo}`;

  return { equipoA, equipoB, torneo, esPartido, tituloSeo, descSeo, keywordsSeo };
}

export async function generateMetadata(props: any): Promise<Metadata> {
  // En Next.js moderno es mejor desenvolver los params por si la URL trae la info ahí
  const resolvedParams = await props.params;
  const searchParams = await props.searchParams;
  
  // Leemos de ?n= o del slug de la URL
  const slugLimpio = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug).replace(/-/g, ' ') : "";
  const rawN = searchParams?.n ? String(searchParams.n) : slugLimpio || "Evento Deportivo";
  
  // Pasamos el texto por tu cerebro limpiador
  const { tituloSeo, descSeo, keywordsSeo } = procesarPartido(rawN);
  
  return {
    title: tituloSeo, // Esto lo lee Google
    description: descSeo, // Esto lo lee Google
    keywords: keywordsSeo,
    
    // 🔥 ESTO LO LEE WHATSAPP, FACEBOOK Y TELEGRAM 🔥
    openGraph: {
      title: tituloSeo,
      description: descSeo,
      type: "website",
      images: [
        {
          url: "https://oleadatvpremium.com/SportLive/icons/icon-512x512.png", // Tu logo premium siempre seguro
          width: 512,
          height: 512,
          alt: tituloSeo,
        }
      ]
    },
    
    // 🔥 ESTO LO LEE TWITTER / X 🔥
    twitter: {
      card: "summary_large_image",
      title: tituloSeo,
      description: descSeo,
      images: ["https://oleadatvpremium.com/SportLive/icons/icon-512x512.png"],
    }
  }
}

export default async function PartidoPage(props: any) {
  const searchParams = await props.searchParams;
  const r = searchParams?.r ? String(searchParams.r) : "";
  const n = searchParams?.n ? String(searchParams.n) : "Evento Deportivo";
  
  const { equipoA, equipoB, torneo, esPartido } = procesarPartido(n);
  
  // Apunta directamente a tu reproductor
  const linkReproductor = `https://oleadatvpremium.com/SportLive/ver.html?r=${r}&n=${encodeURIComponent(n)}`;

  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit']">
      >
      
      <main className="pt-24 pb-12 flex-1 w-full flex flex-col items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full relative z-10">
          
          <Link href="/agenda-deportiva" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la Agenda
          </Link>

          {/* 🏟️ BANNER DE ESTADIO (HERO) */}
          <div className="w-full bg-gradient-to-b from-[#111827] to-[#080c14] rounded-[2.5rem] border border-white/10 p-8 sm:p-14 mb-10 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
            
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Transmisión Verificada
              </div>

              {/* 🔥 MAGIA DE DISEÑO: Si es partido muestra el VS, si es evento único centra el título 🔥 */}
              {esPartido ? (
                <div className="flex items-center justify-center gap-4 sm:gap-12 w-full">
                  <div className="flex-1 text-right">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">{equipoA}</h2>
                  </div>
                  <div className="shrink-0">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center rotate-45 backdrop-blur-md">
                      <span className="text-xl sm:text-2xl font-black text-primary -rotate-45 italic">VS</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-300 leading-tight">{equipoB}</h2>
                  </div>
                </div>
              ) : (
                <div className="text-center w-full max-w-4xl">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">{equipoA}</h2>
                </div>
              )}

              {/* El Torneo extraído luce como un subtítulo épico */}
              <h1 className="text-lg sm:text-xl font-bold text-slate-400 uppercase tracking-widest mt-4">
                {torneo} • <span className="text-white">Calidad 1080p</span>
              </h1>

              {/* 🔥 HACK DE SEGURIDAD: Formulario invisible para ocultar la URL al pasar el mouse 🔥 */}
              <div className="w-full max-w-sm mt-4">
                <form action="https://oleadatvpremium.com/SportLive/ver.html" method="GET" target="_blank">
                  {/* Pasamos los parámetros de forma oculta */}
                  <input type="hidden" name="r" value={r} />
                  <input type="hidden" name="n" value={n} />
                  
                  {/* Le quitamos el 'asChild' al Button y le ponemos type="submit" */}
                  <Button type="submit" size="lg" className="w-full py-8 rounded-2xl font-black text-lg uppercase tracking-widest bg-gradient-to-r from-primary to-[#00d4ff] hover:scale-[1.03] transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                    <Play className="w-6 h-6 mr-3 fill-current" /> Iniciar Transmisión
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* 📝 SECCIÓN DE SEO DINÁMICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            <div className="bg-[#111827]/60 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm">
              <h2 className="text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                <Trophy className="text-primary w-6 h-6" /> ¿Dónde ver {esPartido ? `${equipoA} vs ${equipoB}` : equipoA}?
              </h2>
              <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
                <p>
                  Si te preguntas cómo ver {esPartido ? "el partido de" : "el evento"} <strong className="text-white">{esPartido ? `${equipoA} vs ${equipoB}` : equipoA}</strong> hoy por la competición de <strong>{torneo}</strong>, has llegado al lugar indicado. En <strong>SportLive</strong> hemos habilitado una señal premium de alta velocidad.
                </p>
                <p>
                  A diferencia de otros sitios, nuestro enlace cuenta con optimización de datos para que puedas disfrutar del evento incluso en redes móviles 4G/5G sin el molesto lag.
                </p>
              </div>
            </div>

            <div className="bg-[#111827]/60 border border-white/5 rounded-[2rem] p-8 backdrop-blur-sm">
              <h2 className="text-xl font-black text-white uppercase flex items-center gap-3 mb-6">
                <ShieldCheck className="text-primary w-6 h-6" /> Garantía SportLive
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 100% Libre de registros y pagos.
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Servidores seguros con cifrado SSL.
                </li>
                <li className="flex items-center gap-3 text-slate-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Soporte multi-dispositivo (Smart TV/Móvil).
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}