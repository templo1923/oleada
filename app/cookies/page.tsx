import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Cookie, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Política de Cookies | SportLive',
  description: 'Información sobre el uso de cookies en la plataforma SportLive.',
}

export default function CookiesPage() {
  return (
    <div className="relative min-h-screen bg-[#080c14] flex flex-col w-full font-['Outfit']">
      <Navbar />
      
      <main className="pt-32 pb-16 flex-1 w-full flex flex-col items-center relative z-10">
        {/* Glow de fondo anaranjado para "Cookies" */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
          </Link>

          <div className="bg-[#111827]/80 border border-white/10 rounded-[2rem] p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Cookie className="w-7 h-7 text-orange-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">Política de Cookies</h1>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-8">
              <p className="text-lg">
                Esta es la política de cookies para SportLive (SportLive Tv Premium). Aquí te explicamos qué son las cookies, cómo las utilizamos y por qué a veces necesitamos almacenar estos pequeños archivos en tu dispositivo.
              </p>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-orange-500">1.</span> ¿Qué son las Cookies?
                </h2>
                <p>
                  Como es práctica común en casi todos los sitios web profesionales, este sitio utiliza "cookies", que son pequeños archivos que se descargan en su computadora o dispositivo móvil, para mejorar su experiencia.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-orange-500">2.</span> Cómo utilizamos las Cookies
                </h2>
                <p>
                  En SportLive utilizamos cookies para almacenar información, incluidas las preferencias de los visitantes y las páginas del sitio web a las que el visitante accedió. La información se utiliza para optimizar la experiencia de los usuarios personalizando el contenido de nuestra página web en función de su tipo de navegador, dispositivo y hábitos de navegación.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-orange-500">3.</span> Cookies de Terceros (Anunciantes)
                </h2>
                <p>
                  En algunos casos especiales, también utilizamos cookies proporcionadas por terceros de confianza. Los servidores de anuncios o redes publicitarias de terceros utilizan tecnologías (como cookies, JavaScript o Web Beacons) que se envían directamente a su navegador para medir la efectividad de sus campañas publicitarias y/o personalizar el contenido publicitario.
                </p>
                <p className="mt-2 text-slate-400 italic">
                  Tenga en cuenta que SportLive no tiene acceso ni control sobre estas cookies que son utilizadas por anunciantes de terceros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-orange-500">4.</span> Desactivación de Cookies
                </h2>
                <p>
                  Puede evitar la configuración de cookies ajustando la configuración de su navegador (consulte la Ayuda de su navegador para saber cómo hacerlo). Tenga en cuenta que deshabilitar las cookies afectará la funcionalidad de este y muchos otros sitios web que visite. 
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