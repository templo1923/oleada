import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Privacidad y Cookies | SportLive',
  description: 'Política de privacidad y uso de cookies en SportLive.',
}

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit']">
      <Navbar />
      
      <main className="pt-32 pb-16 flex-1 w-full flex flex-col items-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
          </Link>

          <div className="bg-[#111827]/80 border border-white/10 rounded-[2rem] p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">Privacidad & Cookies</h1>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-8">
              <p className="text-lg">
                En SportLive (OleadaTV Premium), accesible desde nuestro portal web, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de información que recopila y registra nuestra plataforma y cómo la utilizamos.
              </p>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-500">1.</span> Archivos de Registro
                </h2>
                <p>
                  SportLive sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida y posiblemente la cantidad de clics. El propósito de la información es analizar tendencias, administrar el sitio y rastrear el movimiento de los usuarios.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-500">2.</span> Política de Cookies
                </h2>
                <p>
                  Como cualquier otro sitio web moderno, SportLive utiliza "cookies". Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes y las páginas del sitio web a las que el visitante accedió. La información se utiliza para optimizar la experiencia de los usuarios personalizando el contenido de nuestra página web en función de su tipo de navegador y dispositivo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-500">3.</span> Políticas de Terceros (Anunciantes)
                </h2>
                <p>
                  Los servidores de anuncios o redes publicitarias de terceros utilizan tecnologías como cookies, JavaScript o Web Beacons que se envían directamente a su navegador. Reciben automáticamente su dirección IP cuando esto ocurre. Estas tecnologías se utilizan para medir la efectividad de sus campañas publicitarias y/o personalizar el contenido publicitario que usted ve en los sitios web que visita.
                </p>
                <p className="mt-2 text-slate-400 italic">
                  Tenga en cuenta que SportLive no tiene acceso ni control sobre estas cookies que son utilizadas por anunciantes de terceros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-500">4.</span> Consentimiento
                </h2>
                <p>
                  Al utilizar nuestro sitio web, usted acepta por la presente nuestra Política de Privacidad y Cookies, y acepta sus Términos y Condiciones. Si tiene preguntas adicionales o requiere más información, no dude en contactarnos a través de <a href="mailto:admin@oleadatvpremium.com" className="text-primary hover:underline">admin@oleadatvpremium.com</a>.
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