import { Card } from "@/components/ui/card"
import { Brain, Zap, BarChart3, Shield } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "Deep Learning",
      description: "Menggunakan arsitektur U-Net dan MobileNetV2 untuk segmentasi yang akurat",
    },
    {
      icon: Zap,
      title: "Proses Cepat",
      description: "Analisis gambar dalam hitungan detik dengan inferensi yang optimal",
    },
    {
      icon: BarChart3,
      title: "Metrik Detail",
      description: "IoU, Dice Score, dan Pixel Accuracy untuk evaluasi performa lengkap",
    },
    {
      icon: Shield,
      title: "Akurat & Reliable",
      description: "Trained pada dataset banjir dengan validasi cross-validation",
    },
  ]

  return (
    <section id="features" className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Fitur Unggulan</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Teknologi terdepan untuk analisis dan segmentasi gambar banjir
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="p-5 sm:p-6 hover:shadow-lg transition-shadow bg-card">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
