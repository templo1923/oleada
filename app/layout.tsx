import type { Metadata, Viewport } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script' // 🚀 Importación del Script añadida aquí arriba
import './globals.css'

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  // 🔥 1. METADATABASE: Obligatorio para que Next.js resuelva bien las imágenes
  metadataBase: new URL('https://oleadatvpremium.com'),
  
  // 🔥 2. TEMPLATE: Para que las subpáginas hereden el nombre de la marca
  title: {
    template: '%s | SportLive Tv Premium',
    default: 'SportLive Tv Premium | Deportes en Vivo, Canales TV y Cine',
  },
  description: 'Tu hub de entretenimiento premium. Agenda deportiva en vivo, canales de TV premium, estrenos de cine y mucho mas. ESPN, Win Sports, HBO y mas.',
  keywords: 'ver partidos en vivo, futbol gratis, canales deportivos online, win sports en vivo, espn en vivo, peliculas estrenos, streaming deportes',
  generator: 'SportLive Tv Premium',
  authors: [{ name: 'OleadaTV' }], // O Kiamber Systems ;)
  
  openGraph: {
    title: 'SportLive Tv Premium | Deportes en Vivo, Canales TV y Cine',
    description: 'Tu hub de entretenimiento premium. Agenda deportiva en vivo, canales de TV premium, estrenos de cine.',
    url: 'https://oleadatvpremium.com',
    type: 'website',
    locale: 'es_ES', // Si tu público es mayormente de Colombia/Latam, puedes usar 'es_CO' o 'es_LA'
    siteName: 'SportLive Tv Premium',
    // 🔥 3. IMÁGENES: ESTO ES LO QUE LEE WHATSAPP Y FACEBOOK 🔥
    images: [
      {
        url: '/SportLive/icons/icon-512x512.png', // Asegúrate de que esta ruta exista en tu carpeta public
        width: 512,
        height: 512,
        alt: 'SportLive Premium Logo',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SportLive Tv Premium',
    description: 'Tu hub de entretenimiento premium',
    // 🔥 IMAGEN PARA TWITTER / X 🔥
    images: ['/SportLive/icons/icon-512x512.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#080c14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SportLive Tv Premium",
              "description": "Hub de entretenimiento premium con deportes en vivo, canales de TV y cine",
              "url": "https://oleadatvpremium.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://oleadatvpremium.com/buscar?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* 🚀 INTEGRACIÓN ONESIGNAL (Campanita y Solicitud de Permisos) 🚀 */}
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "e017f9e9-c78d-4693-bb09-0e26b2f6d66c",
                  safari_web_id: "web.onesignal.auto.0be2159b-fe04-48af-91ed-a963117d84ac",
                  notifyButton: {
                    enable: false,
                    colors: {
                      'circle.background': '#ef4444',
                      'circle.foreground': 'white',
                      'badge.background': '#3b82f6',
                      'badge.foreground': 'white',
                      'badge.bordercolor': 'white',
                      'pulse.color': '#ef4444',
                      'dialog.button.background.hovering': '#dc2626',
                      'dialog.button.background.active': '#dc2626',
                      'dialog.button.background': '#ef4444',
                      'dialog.button.foreground': 'white',
                    }
                  },
                  promptOptions: {
                    slidedown: {
                      prompts: [{
                        type: "push",
                        autoPrompt: true,
                        text: {
                          actionMessage: "Recibe alertas de los mejores partidos en vivo y eventos estelares.",
                          acceptButton: "¡Claro que sí!",
                          cancelButton: "No, gracias"
                        },
                        delay: {
                          pageViews: 1,
                          timeDelay: 3
                        }
                      }]
                    }
                  }
                });
              });
            `
          }}
        />
      </head>
      {/* 🚨 AQUÍ ESTÁ EL AJUSTE: Agregado overflow-x-hidden para matar el espacio negro 🚨 */}
      <body className={`${outfit.variable} ${geistMono.variable} font-sans antialiased overflow-x-hidden w-full`} suppressHydrationWarning>
        {children}
        <Analytics />
        
        <Script 
          src="https://widgets.api-sports.io/3.1.0/widgets.js" 
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}