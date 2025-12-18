import { Header } from "@/components/header"
import { SegmentationTool } from "@/components/segmentation-tool"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { BackendStatus } from "@/components/backend-status"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main>
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs sm:text-sm font-medium text-primary mb-3 sm:mb-4">
              AI-Powered Flood Analysis
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance px-4">
              Segmentasi Gambar Banjir dengan <span className="text-primary">Deep Learning</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance px-4">
              Analisis cepat dan akurat menggunakan arsitektur U-Net dan U-Net + MobileNetV2 untuk identifikasi area
              banjir
            </p>
          </div>

          <div className="max-w-7xl mx-auto mb-6">
            <BackendStatus />
          </div>

          <SegmentationTool />
        </section>

        <Features />
      </main>
      <Footer />
    </div>
  )
}
