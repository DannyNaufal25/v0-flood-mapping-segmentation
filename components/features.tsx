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
}
