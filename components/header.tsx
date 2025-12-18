"use client"

import { Droplets, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function Header() {
  const [open, setOpen] = useState(false)

  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary text-primary-foreground">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-bold text-base sm:text-lg">Buanjir</span>
        </div>

        {/* Desktop Navigation */}
       

       

        {/* Mobile Navigation */}
        
      </div>
    </header>
  )
}
