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
  title: 'OleadaTV Premium | Deportes en Vivo, Canales TV y Cine',
  description: 'Tu hub de entretenimiento premium. Agenda deportiva en vivo, canales de TV premium, estrenos de cine y mucho mas. ESPN, Win Sports, HBO y mas.',
  keywords: 'ver partidos en vivo, futbol gratis, canales deportivos online, win sports en vivo, espn en vivo, peliculas estrenos, streaming deportes',
  generator: 'OleadaTV Premium',
  authors: [{ name: 'OleadaTV' }],
  openGraph: {
    title: 'OleadaTV Premium | Deportes en Vivo, Canales TV y Cine',
    description: 'Tu hub de entretenimiento premium. Agenda deportiva en vivo, canales de TV premium, estrenos de cine.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'OleadaTV Premium',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OleadaTV Premium',
    description: 'Tu hub de entretenimiento premium',
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
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
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
              "name": "OleadaTV Premium",
              "description": "Hub de entretenimiento premium con deportes en vivo, canales de TV y cine",
              "url": "https://oleadatv.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://oleadatv.com/buscar?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
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