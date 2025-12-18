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
}

export function MetricsDisplay({ metrics, model, compact = false }: MetricsDisplayProps) {
  const metricsData = [
    {
      label: "IoU Score",
      value: metrics.iou,
      icon: Grid3x3,
      description: "Intersection over Union",
    },
    {
      label: "Dice Score",
      value: metrics.dice,
      icon: Target,
      description: "F1 Score for segmentation",
    },
    {
      label: "Pixel Accuracy",
      value: metrics.pixelAccuracy,
      icon: TrendingUp,
      description: "Overall accuracy",
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
          <h4 className="text-sm font-semibold">Metrik Performa</h4>
          <span className="text-xs text-muted-foreground">{model === "unet" ? "U-Net" : "U-Net + MobileNetV2"}</span>
        </div>
      )}

      <div className="grid gap-2">
        {metricsData.map((metric) => {
          const Icon = metric.icon
          const percentage = (metric.value * 100).toFixed(1)

          return (
            <Card key={metric.label} className="p-3 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className="text-lg font-bold text-primary">{percentage}%</span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
