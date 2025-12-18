"use client"

import { Card } from "@/components/ui/card"
import { Check, Zap, Layers } from "lucide-react"
import type { ModelType } from "./segmentation-tool"

interface ModelSelectorProps {
  selectedModel: ModelType
  onModelChange: (model: ModelType) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const models = [
    {
      id: "unet" as ModelType,
      name: "U-Net",
      description: "Model baseline dengan akurasi tinggi",
      icon: Layers,
      specs: ["16-128 filters", "3 encoder levels", "~1M parameters"],
    },
    {
      id: "unet-mobilenet" as ModelType,
      name: "U-Net + MobileNetV2",
      description: "Model advanced dengan transfer learning",
      icon: Zap,
      specs: ["MobileNetV2 encoder", "Skip connections", "~2M parameters"],
    },
  ]

  return (
    <div className="grid gap-3">
      {models.map((model) => {
        const Icon = model.icon
        const isSelected = selectedModel === model.id

        return (
          <Card
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={`p-3 sm:p-4 cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "border-2 border-primary bg-primary/5" : "border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm sm:text-base">{model.name}</h4>
                  {isSelected && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">{model.description}</p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {model.specs.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
