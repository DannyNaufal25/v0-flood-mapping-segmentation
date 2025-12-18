"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, EyeOff } from "lucide-react"
import type { SegmentationResult, ModelType } from "./segmentation-tool"
import { MetricsDisplay } from "./metrics-display"

interface ResultsPanelProps {
  results: SegmentationResult
  model: ModelType
}

export function ResultsPanel({ results, model }: ResultsPanelProps) {
  const [showMask, setShowMask] = useState(false)

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border-2 aspect-video bg-background">
        <img
          src={showMask ? results.maskImage : results.segmentedImage}
          alt="Segmentation result"
          className="w-full h-full object-contain"
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs sm:text-sm"
          onClick={() => setShowMask(!showMask)}
        >
          {showMask ? (
            <>
              <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Lihat Overlay</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Lihat Mask</span>
            </>
          )}
        </Button>
      </div>

      <MetricsDisplay metrics={results.metrics} model={model} />

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          onClick={() => handleDownload(results.segmentedImage, "segmented.png")}
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Download Hasil</span>
          <span className="sm:hidden">Hasil</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          onClick={() => handleDownload(results.maskImage, "mask.png")}
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Download Mask</span>
          <span className="sm:hidden">Mask</span>
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Waktu proses: {results.processingTime.toFixed(2)}s
      </div>
    </div>
  )
}
