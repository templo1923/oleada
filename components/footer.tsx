import Link from "next/link"
import { Zap, Twitter, Instagram, Youtube, Mail } from "lucide-react"

const footerLinks = {
  plataforma: [
    { label: "Inicio", href: "/" },
    { label: "Agenda Deportiva", href: "/agenda-deportiva" },
    { label: "Canales Premium", href: "/canales-premium" },
    { label: "Cine y Estrenos", href: "/cine-estrenos" },
  ],
  legal: [
    { label: "Terminos de Uso", href: "/terminos" },
    { label: "Politica de Privacidad", href: "/privacidad" },
    { label: "Cookies", href: "/cookies" },
    { label: "DMCA", href: "/dmca" },
  ],
  recursos: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contacto", href: "/contacto" },
    { label: "Soporte", href: "/soporte" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: "#", label: "Email" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#00d4ff]">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold gradient-text">OleadaTV</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Premium</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Tu hub de entretenimiento premium. Deportes en vivo, canales de TV y los mejores estrenos de cine en un solo lugar.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg glass-light text-muted-foreground hover:text-primary hover:glow-green transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Plataforma</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.plataforma.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recursos</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.recursos.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} OleadaTV Premium. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hub informativo de entretenimiento. No alojamos contenido.
          </p>
        </div>
      </div>
    </footer>
  )
}
