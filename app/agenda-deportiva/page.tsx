import Link from "next/link"

export const metadata = {
  title: "Partidos de Hoy EN VIVO | Agenda Deportiva Completa",
  description: "Lista completa de transmisiones para hoy. Fútbol, NBA, MMA y más."
}

export default async function AgendaCompleta() {
  // Traemos los datos directamente en el servidor para que Google los vea de una
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sports?sport=football`, { cache: 'no-store' });
  const { matches } = await res.json();

  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-white mb-4">Agenda Deportiva de Hoy</h1>
      <p className="text-slate-400 mb-10">Haz clic en tu partido favorito para ver los canales disponibles en la App.</p>

      <div className="grid gap-2">
        {matches.map((m: any) => (
          <Link 
            key={m.id} 
            href={`/partido/${m.slug}`}
            className="flex items-center justify-between p-4 glass rounded-xl border border-white/5 hover:bg-primary/10 transition-all group"
          >
            <div className="flex items-center gap-4">
               {m.isLive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
               <span className="text-white font-bold group-hover:text-primary transition-colors">{m.title}</span>
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Transmitiendo →</span>
          </Link>
        ))}
      </div>
      
      {/* Texto al final para SEO */}
      <footer className="mt-20 text-[10px] text-slate-600 leading-relaxed">
        <p>Oleada TV ofrece enlaces a los principales eventos de la Liga BetPlay, Champions League y NBA. Todos los nombres y logos son propiedad de sus respectivos dueños.</p>
      </footer>
    </div>
  )
}