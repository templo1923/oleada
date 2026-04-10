import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Política DMCA | SportLive',
  description: 'Política de derechos de autor y notificaciones DMCA de SportLive.',
}

export default function DmcaPage() {
  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit']">
      <Navbar />
      
      <main className="pt-32 pb-16 flex-1 w-full flex flex-col items-center relative z-10">
        {/* Glow de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
          </Link>

          <div className="bg-[#111827]/80 border border-white/10 rounded-[2rem] p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">Política DMCA</h1>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-8">
              <p className="text-lg">
                Respetamos los derechos de propiedad intelectual de terceros y esperamos que nuestros usuarios hagan lo mismo. De acuerdo con la Ley de Derechos de Autor de la Era Digital (DMCA), responderemos de manera expedita a los avisos de presunta infracción de derechos de autor.
              </p>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-500">1.</span> Limitación de Responsabilidad
                </h2>
                <p>
                  SportLive (SportLive Tv Premium) es un proveedor de servicios de Internet que ofrece una plataforma que solo muestra enlaces a contenidos audiovisuales ubicados en servidores de terceros y proveídos y / o transmitidos por terceros. Nadie puede responsabilizar a nuestra plataforma de alojar contenido con derechos de autor ya que no alojamos ningún material con derechos de autor ni transmitimos ningún contenido audiovisual.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-500">2.</span> Notificación de Infracción
                </h2>
                <p className="mb-4">
                  Si usted es propietario de derechos de autor, o está autorizado para actuar en nombre de uno, y cree que algún material indexado en nuestro sitio infringe sus derechos, puede enviarnos una Notificación de Retirada detallando lo siguiente:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Identificación clara del material protegido por derechos de autor que afirma ha sido infringido.</li>
                  <li>Identificación clara de la URL exacta o el enlace en nuestro sitio donde se encuentra el material infractor.</li>
                  <li>Su información de contacto (nombre, dirección, número de teléfono y correo electrónico).</li>
                  <li>Una declaración de que usted cree de buena fe que el uso del material de la manera denunciada no está autorizado por el propietario de los derechos de autor, su agente o la ley.</li>
                  <li>Una declaración de que la información contenida en la notificación es exacta, y bajo pena de perjurio, que está autorizado a actuar en nombre del propietario.</li>
                  <li>Su firma física o electrónica.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-500">3.</span> Contacto para Retiradas
                </h2>
                <p>Envíe todas las notificaciones de DMCA al correo electrónico de nuestro equipo legal:</p>
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 inline-block">
                  <p className="font-bold text-white">Correo electrónico:</p>
                  <a href="mailto:admin@oleadatvpremium.com" className="text-primary hover:text-blue-400 transition-colors">admin@oleadatvpremium.com</a>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  Una vez recibido un reclamo válido y completo, procederemos a eliminar o deshabilitar los enlaces al material presuntamente infractor en un plazo de 24 a 48 horas hábiles.
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