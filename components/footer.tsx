import { Droplets } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="font-bold">Buanjir</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            © 2025 Buanjir. Powered by U-Net & MobileNetV2 Deep Learning
          </p>

          
        </div>
      </div>
    </footer>
  )
}
