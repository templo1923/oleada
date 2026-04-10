import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Términos de Uso | SportLive',
  description: 'Términos y condiciones de uso de la plataforma SportLive.',
}

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit']">
      <Navbar />
      
      <main className="pt-32 pb-16 flex-1 w-full flex flex-col items-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
          </Link>

          <div className="bg-[#111827]/80 border border-white/10 rounded-[2rem] p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-emerald-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">Términos de Uso</h1>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-8">
              <p className="text-lg">
                Bienvenido a SportLive (SportLive Tv Premium). Si continúa navegando y utilizando este sitio web, acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso.
              </p>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">1.</span> Exención de Garantías
                </h2>
                <p>
                  El contenido de las páginas de este sitio web es solo para su información general y uso. Está sujeto a cambios sin previo aviso. Ni nosotros ni ningún tercero ofrecemos ninguna garantía en cuanto a la exactitud, puntualidad, rendimiento, integridad o idoneidad de la información y los materiales encontrados u ofrecidos en este sitio para ningún propósito particular.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">2.</span> Enlaces a Terceros
                </h2>
                <p>
                  SportLive funciona como un índice de contenido de terceros. A través de este sitio web usted puede enlazar a otros sitios web que no están bajo el control de nuestra plataforma. No tenemos control sobre la naturaleza, el contenido y la disponibilidad de dichos sitios. La inclusión de cualquier enlace no implica necesariamente una recomendación ni respalda las opiniones expresadas en ellos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">3.</span> Disponibilidad del Servicio
                </h2>
                <p>
                  Se hace todo lo posible para mantener el sitio web en funcionamiento sin problemas. Sin embargo, SportLive no se hace responsable de que el sitio web no esté disponible temporalmente debido a problemas técnicos fuera de nuestro control. Las transmisiones en vivo y enlaces indexados dependen de servidores externos y pueden dejar de funcionar en cualquier momento sin previo aviso.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">4.</span> Modificaciones
                </h2>
                <p>
                  Nos reservamos el derecho de revisar estos Términos de Uso en cualquier momento. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos Términos y Condiciones. Cualquier reclamo o disputa relacionada con el uso de nuestro sitio debe dirigirse a nuestro contacto oficial: <a href="mailto:admin@oleadatvpremium.com" className="text-primary hover:underline">admin@oleadatvpremium.com</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}