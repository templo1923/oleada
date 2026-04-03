"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Tv, Calendar, Film, FileText, Zap, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Inicio", icon: Zap },
  { href: "/agenda-deportiva", label: "Agenda Deportiva", icon: Calendar },
  { href: "/canales-premium", label: "Canales TV", icon: Tv },
  { href: "/cine-estrenos", label: "Cine", icon: Film },
  { href: "/blog", label: "Blog", icon: FileText },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#00d4ff] glow-green">
              <Zap className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight gradient-text">OleadaTV</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Premium</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
              >
                <link.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search & CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
            <Button className="bg-gradient-to-r from-primary to-[#00d4ff] text-background font-semibold shine glow-green hover:opacity-90 transition-opacity">
              Ver En Vivo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 px-4">
                <Button className="w-full bg-gradient-to-r from-primary to-[#00d4ff] text-background font-semibold shine glow-green">
                  Ver En Vivo
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
