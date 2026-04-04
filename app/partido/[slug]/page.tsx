import Link from "next/link"
import { Play, ShieldCheck, Trophy, Calendar } from "lucide-react"

// 🔥 MAGIA SEO: Genera el Título y Descripción para Google automáticamente
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slugParts = params.slug.split('-');
  // Extraemos los nombres de la URL (ej: millonarios-vs-nacional-1234)
  const isVs = params.slug.includes('-vs-');
  let title = "Partido en Vivo";
  
  if (isVs) {
      const parts = params.slug.split('-vs-');
      const local = parts[0].replace(/-/g, ' ').toUpperCase();
      const visitante = parts[1].replace(/[0-9-]/g, ' ').toUpperCase().trim();
      title = `${local} vs ${visitante} EN VIVO HOY`;
  }

  return {
    title: `Dónde ver ${title} | Canales y Horarios Gratis`,
    description: `Disfruta del partido ${title} en directo y en calidad HD. Revisa la agenda, los canales de transmisión como Win Sports, ESPN y sigue el minuto a minuto.`,
  }
}

export default function PartidoPage({ params }: { params: { slug: string } }) {
  const isVs = params.slug.includes('-vs-');
  let local = "Equipo Local";
  let visitante = "Equipo Visitante";

  if (isVs) {
      const parts = params.slug.split('-vs-');
      local = parts[0].replace(/-/g, ' ').toUpperCase();
      visitante = parts[1].replace(/[0-9-]/g, ' ').toUpperCase().trim();
  }

  return (
    <div className="min-h-screen section-gradient pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Cabecera del Partido */}
        <div className="glass rounded-3xl p-8 md:p-12 text-center border border-white/10 relative overflow-hidden mb-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm mb-6">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
             Transmisión Oficial
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {local} <span className="text-slate-500 text-3xl">vs</span> {visitante}
          </h1>

          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Sigue el minuto a minuto de este gran encuentro. Conéctate a nuestros servidores premium para disfrutar del evento sin cortes y en máxima calidad.
          </p>

          <Link href="/canales-premium" className="inline-flex items-center justify-center gap-3 bg-destructive hover:bg-destructive/90 text-white px-8 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)] w-full md:w-auto">
            <Play className="w-6 h-6 fill-current" />
            REPRODUCIR SEÑAL AHORA
          </Link>
        </div>

        {/* Texto SEO para posicionar en Google */}
        <article className="glass rounded-2xl p-8 border border-white/5 text-slate-300 leading-relaxed space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-primary w-6 h-6" /> ¿Dónde y cómo ver el partido hoy?
            </h2>
            <p>
                Si te estás preguntando dónde ver el partido de <strong>{local} contra {visitante}</strong>, estás en la plataforma indicada. Este evento forma parte de la cartelera deportiva más esperada de la jornada. 
            </p>
            <p>
                A diferencia de otras plataformas que sufren caídas, en <strong>OleadaTV</strong> indexamos las mejores señales para canales deportivos. Dependiendo de la liga, este partido podría ser transmitido oficialmente por cadenas como ESPN, Fox Sports, DSports o Win Sports+.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 p-4 rounded-xl flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-white">Agenda Completa</h4>
                        <p className="text-sm text-slate-400">Verifica los horarios en tu zona local ingresando al reproductor.</p>
                    </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-white">Señal Segura</h4>
                        <p className="text-sm text-slate-400">Servidores optimizados para Smart TVs y dispositivos móviles.</p>
                    </div>
                </div>
            </div>
        </article>

      </div>
    </div>
  )
}