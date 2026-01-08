"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card" // Tambah import Card
import { Download, Eye, EyeOff, Clock, Info } from "lucide-react" // Tambah icon Clock & Info
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
    <div className="space-y-8">
      {/* BAGIAN 1: HASIL INFERENSI (GAMBAR & WAKTU) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                📸 Hasil Deteksi
            </h3>
             <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                <Clock className="w-4 h-4" />
                <span>Waktu Proses: <strong className="text-foreground">{results.processingTime.toFixed(2)}s</strong></span>
            </div>
        </div>

        <Card className="p-1 overflow-hidden border-2">
            <div className="relative aspect-video bg-background rounded-md overflow-hidden">
            <img
                src={showMask ? results.maskImage : results.segmentedImage}
                alt="Segmentation result"
                className="w-full h-full object-contain"
            />
            <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs sm:text-sm shadow-sm"
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
        </Card>

        <div className="flex flex-col sm:flex-row gap-2">
            <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleDownload(results.segmentedImage, "segmented.png")}
            >
            <Download className="w-4 h-4 mr-2" />
            Download Hasil
            </Button>
            <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleDownload(results.maskImage, "mask.png")}
            >
            <Download className="w-4 h-4 mr-2" />
            Download Binary Mask
            </Button>
        </div>
      </section>

      {/* BAGIAN 2: SPESIFIKASI MODEL (DATA GLOBAL/STATIS) */}
      <section className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
             <Info className="w-4 h-4" />
             <p className="text-sm font-medium">Referensi Performa Model (Dataset Testing)</p>
        </div>
        
        {/* Pass prop isGlobalContext agar MetricsDisplay tahu ini data global */}
        <MetricsDisplay metrics={results.metrics} model={model} isGlobalContext={true} />
      </section>
    </div>
  )
}