import { Card } from "@/components/ui/card"
import { TrendingUp, Target, Grid3x3 } from "lucide-react"
import type { ModelType } from "./segmentation-tool"

interface MetricsDisplayProps {
  metrics: {
    iou: number
    dice: number
    pixelAccuracy: number
  }
  model?: ModelType
  compact?: boolean
  isGlobalContext?: boolean // Prop baru untuk memperjelas konteks
}

export function MetricsDisplay({ metrics, model, compact = false, isGlobalContext = false }: MetricsDisplayProps) {
  const metricsData = [
    {
      label: "Mean IoU", // Diubah jadi Mean agar jelas rata-rata
      value: metrics.iou,
      icon: Grid3x3,
      description: "Rata-rata Intersection over Union",
    },
    {
      label: "Mean Dice Score",
      value: metrics.dice,
      icon: Target,
      description: "Rata-rata F1 Score segmentasi",
    },
    {
      label: "Pixel Accuracy",
      value: metrics.pixelAccuracy,
      icon: TrendingUp,
      description: "Akurasi piksel keseluruhan",
    },
  ]

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {metricsData.map((metric) => {
          const Icon = metric.icon
          const percentage = (metric.value * 100).toFixed(1)

          return (
            <div key={metric.label} className="text-center">
              <Icon className="w-3 h-3 text-primary mx-auto mb-1" />
              <p className="text-xs font-medium">{percentage}%</p>
              <p className="text-xs text-muted-foreground">{metric.label.split(" ")[0]}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {model && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            {isGlobalContext ? "Spesifikasi Rata-rata Model" : "Metrik Performa"}
          </h4>
          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
            {model === "unet" ? "Architecture: U-Net" : "Architecture: U-Net + MobileNetV2"}
          </span>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        {metricsData.map((metric) => {
          const Icon = metric.icon
          const percentage = (metric.value * 100).toFixed(1)

          return (
            <Card key={metric.label} className="p-3 bg-muted/30 border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-background rounded-md border">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                </div>
              </div>
              <div className="mb-2">
                 <span className="text-2xl font-bold tracking-tight">{percentage}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}