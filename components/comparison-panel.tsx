"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Clock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SegmentationResult } from "./segmentation-tool"

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
    <div className="space-y-6">
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
        <Card className="p-4 space-y-3 bg-muted/30 border-2">
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
          <div className="relative aspect-video bg-background rounded-lg overflow-hidden border shadow-sm">
            <img
              src={viewMode === "overlay" ? unetResult.segmentedImage : unetResult.maskImage}
              alt="U-Net Result"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Processing Time Only */}
          <div className="flex items-center justify-center gap-2 p-2 bg-background/50 rounded-md border text-muted-foreground">
             <Clock className="w-4 h-4" />
             <p className="text-xs font-medium">
               Waktu Proses: <span className="text-foreground font-bold">{unetResult.processingTime.toFixed(2)}s</span>
             </p>
          </div>
        </Card>

        {/* U-Net + MobileNetV2 Results */}
        <Card className="p-4 space-y-3 bg-muted/30 border-2">
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
          <div className="relative aspect-video bg-background rounded-lg overflow-hidden border shadow-sm">
            <img
              src={viewMode === "overlay" ? mobilenetResult.segmentedImage : mobilenetResult.maskImage}
              alt="U-Net + MobileNetV2 Result"
              className="w-full h-full object-contain"
            />
          </div>
           {/* Processing Time Only */}
           <div className="flex items-center justify-center gap-2 p-2 bg-background/50 rounded-md border text-muted-foreground">
             <Clock className="w-4 h-4" />
             <p className="text-xs font-medium">
               Waktu Proses: <span className="text-foreground font-bold">{mobilenetResult.processingTime.toFixed(2)}s</span>
             </p>
          </div>
        </Card>
      </div>

      {/* Metrics Comparison (Global Specs) */}
      <Card className="p-6 bg-card shadow-sm border">
        <div className="mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2">
            📊 Spesifikasi Performa Model
          </h4>
          <p className="text-sm text-muted-foreground">
            Perbandingan rata-rata metrik evaluasi pada dataset testing (Global Metrics).
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 text-center divide-x">
          {/* IoU Score */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Mean IoU</p>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center px-4 max-w-[200px] mx-auto">
                <span className="text-sm text-muted-foreground">U-Net</span>
                <span className="font-mono font-bold">{(unetResult.metrics.iou * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center px-4 max-w-[200px] mx-auto">
                <span className="text-sm font-semibold text-primary">+MobileNet</span>
                <span className="font-mono font-bold text-primary">{(mobilenetResult.metrics.iou * 100).toFixed(1)}%</span>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  + {((mobilenetResult.metrics.iou - unetResult.metrics.iou) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Dice Score */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Mean Dice</p>
            <div className="space-y-1 mt-2">
               <div className="flex justify-between items-center px-4 max-w-[200px] mx-auto">
                <span className="text-sm text-muted-foreground">U-Net</span>
                <span className="font-mono font-bold">{(unetResult.metrics.dice * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center px-4 max-w-[200px] mx-auto">
                <span className="text-sm font-semibold text-primary">+MobileNet</span>
                <span className="font-mono font-bold text-primary">{(mobilenetResult.metrics.dice * 100).toFixed(1)}%</span>
              </div>
               <div className="pt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  + {((mobilenetResult.metrics.dice - unetResult.metrics.dice) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Pixel Accuracy */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pixel Accuracy</p>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between items-center px-4 max-w-[200px] mx-auto">
                <span className="text-sm text-muted-foreground">U-Net</span>
                <span className="font-mono font-bold">{(unetResult.metrics.pixelAccuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center px-4 max-w-[200px] mx-auto">
                <span className="text-sm font-semibold text-primary">+MobileNet</span>
                <span className="font-mono font-bold text-primary">{(mobilenetResult.metrics.pixelAccuracy * 100).toFixed(1)}%</span>
              </div>
               <div className="pt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  + {((mobilenetResult.metrics.pixelAccuracy - unetResult.metrics.pixelAccuracy) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}