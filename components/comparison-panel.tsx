"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SegmentationResult } from "./segmentation-tool"
import { MetricsDisplay } from "./metrics-display"

interface ComparisonPanelProps {
  unetResult: SegmentationResult
  mobilenetResult: SegmentationResult
}

export function ComparisonPanel({ unetResult, mobilenetResult }: ComparisonPanelProps) {
  const [viewMode, setViewMode] = useState<"overlay" | "mask">("overlay")

  const handleDownload = (imageData: string, filename: string) => {
    const link = document.createElement("a")
    link.href = imageData
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Toggle View Mode */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "overlay" | "mask")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overlay">Overlay</TabsTrigger>
          <TabsTrigger value="mask">Binary Mask</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Comparison Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* U-Net Results */}
        <Card className="p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">U-Net</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDownload(
                  viewMode === "overlay" ? unetResult.segmentedImage : unetResult.maskImage,
                  `unet-${viewMode}.png`,
                )
              }
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative aspect-video bg-background rounded-lg overflow-hidden border">
            <img
              src={viewMode === "overlay" ? unetResult.segmentedImage : unetResult.maskImage}
              alt="U-Net Result"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <MetricsDisplay metrics={unetResult.metrics} compact />
            <p className="text-xs text-muted-foreground">Processing Time: {unetResult.processingTime.toFixed(2)}s</p>
          </div>
        </Card>

        {/* U-Net + MobileNetV2 Results */}
        <Card className="p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">U-Net + MobileNetV2</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDownload(
                  viewMode === "overlay" ? mobilenetResult.segmentedImage : mobilenetResult.maskImage,
                  `unet-mobilenet-${viewMode}.png`,
                )
              }
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative aspect-video bg-background rounded-lg overflow-hidden border">
            <img
              src={viewMode === "overlay" ? mobilenetResult.segmentedImage : mobilenetResult.maskImage}
              alt="U-Net + MobileNetV2 Result"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <MetricsDisplay metrics={mobilenetResult.metrics} compact />
            <p className="text-xs text-muted-foreground">
              Processing Time: {mobilenetResult.processingTime.toFixed(2)}s
            </p>
          </div>
        </Card>
      </div>

      {/* Metrics Comparison */}
      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-sm">Perbandingan Metrik</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-2">IoU Score</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                U-Net: <span className="text-primary">{(unetResult.metrics.iou * 100).toFixed(1)}%</span>
              </p>
              <p className="text-sm font-medium">
                +MobileNet: <span className="text-primary">{(mobilenetResult.metrics.iou * 100).toFixed(1)}%</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Δ {((mobilenetResult.metrics.iou - unetResult.metrics.iou) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Dice Score</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                U-Net: <span className="text-primary">{(unetResult.metrics.dice * 100).toFixed(1)}%</span>
              </p>
              <p className="text-sm font-medium">
                +MobileNet: <span className="text-primary">{(mobilenetResult.metrics.dice * 100).toFixed(1)}%</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Δ {((mobilenetResult.metrics.dice - unetResult.metrics.dice) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Pixel Accuracy</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                U-Net: <span className="text-primary">{(unetResult.metrics.pixelAccuracy * 100).toFixed(1)}%</span>
              </p>
              <p className="text-sm font-medium">
                +MobileNet:{" "}
                <span className="text-primary">{(mobilenetResult.metrics.pixelAccuracy * 100).toFixed(1)}%</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Δ {((mobilenetResult.metrics.pixelAccuracy - unetResult.metrics.pixelAccuracy) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
