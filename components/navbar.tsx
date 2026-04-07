"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Tv, Calendar, Film, FileText, Zap, Search, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

// 🚨 ENLACES REALES CONECTADOS AL ECOSISTEMA 🚨
const navLinks = [
  { href: "https://sportlive-one.vercel.app/", label: "Inicio", icon: Zap },
  { href: "/agenda-deportiva", label: "Agenda Deportiva", icon: Calendar },
  { href: "/canales-premium`", label: "Canales TV", icon: Tv },
  { href: "/cine", label: "Cine", icon: Film },
  { href: "https://sportlive-one.vercel.app/blog", label: "Blog", icon: FileText },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo SportLive */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#00d4ff] glow-green">
              <Zap className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-primary transition-colors">SportLive</span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Gratis</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
              >
                <link.icon className="h-4 w-4 transition-colors text-slate-400 group-hover:text-primary" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botón CTA Derecho */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button className="bg-gradient-to-r from-primary to-[#00d4ff] text-white font-black hover:scale-105 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-xl" asChild>
              <Link href="https://oleadatvpremium.com/SportLive/index.html" target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-4 w-4 fill-current" />
                Abrir App
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 bg-[#080c14]/95 backdrop-blur-xl absolute left-0 right-0 px-4 shadow-2xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                >
                  <link.icon className="h-5 w-5 text-primary" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-4">
                <Button className="w-full bg-gradient-to-r from-primary to-[#00d4ff] text-white font-black rounded-xl py-6" asChild>
                  <Link href="https://oleadatvpremium.com/SportLive/index.html" target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Abrir App
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}