"use client"

import { Droplets, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function Header() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "#tool", label: "Analisis" },
    { href: "#features", label: "Fitur" },
    { href: "#about", label: "Tentang" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary text-primary-foreground">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-bold text-base sm:text-lg">FloodAI</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
          Dokumentasi
        </Button>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </a>
              ))}
              <Button variant="outline" className="mt-4 w-full bg-transparent">
                Dokumentasi
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
