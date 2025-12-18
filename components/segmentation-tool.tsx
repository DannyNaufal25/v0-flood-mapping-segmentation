"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, RefreshCcw, ChevronRight } from "lucide-react"
import { ModelSelector } from "@/components/model-selector"
import { ResultsPanel } from "@/components/results-panel"
import { ComparisonPanel } from "@/components/comparison-panel"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export type ModelType = "unet" | "unet-mobilenet"

export interface SegmentationResult {
  originalImage: string
  segmentedImage: string
  maskImage: string
  metrics: {
    iou: number
    dice: number
    pixelAccuracy: number
  }
  processingTime: number
}

export function SegmentationTool() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("unet")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<SegmentationResult | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [comparisonResults, setComparisonResults] = useState<{
    unet: SegmentationResult | null
    unetMobilenet: SegmentationResult | null
  }>({ unet: null, unetMobilenet: null })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format file tidak valid",
          description: "Silakan pilih file gambar (JPG, PNG, dll.)",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setResults(null)
        setComparisonResults({ unet: null, unetMobilenet: null })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSegment = async () => {
    if (!uploadedImage) {
      toast({
        title: "Tidak ada gambar",
        description: "Silakan upload gambar terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      if (compareMode) {
        const [unetResult, mobilenetResult] = await Promise.all([
          processSegmentation(uploadedImage, "unet"),
          processSegmentation(uploadedImage, "unet-mobilenet"),
        ])

        setComparisonResults({
          unet: unetResult,
          unetMobilenet: mobilenetResult,
        })

        toast({
          title: "Perbandingan berhasil!",
          description: "Kedua model berhasil memproses gambar",
        })
      } else {
        const result = await processSegmentation(uploadedImage, selectedModel)
        setResults(result)

        toast({
          title: "Segmentasi berhasil!",
          description: `Model ${selectedModel === "unet" ? "U-Net" : "U-Net + MobileNetV2"} berhasil memproses gambar`,
        })
      }
    } catch (error) {
      console.error("[v0] Segmentation error:", error)
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal memproses gambar. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const processSegmentation = async (image: string, model: ModelType): Promise<SegmentationResult> => {
    const response = await fetch("/api/segment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        model,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    // Validate response data
    if (!data.segmentedImage || !data.maskImage) {
      throw new Error("Format respons backend tidak valid")
    }

    return data
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResults(null)
    setComparisonResults({ unet: null, unetMobilenet: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCompareModeChange = (checked: boolean) => {
    setCompareMode(checked)
    setResults(null)
    setComparisonResults({ unet: null, unetMobilenet: null })
  }

  return (
    <div id="tool" className="max-w-7xl mx-auto">
      <Card className="p-4 sm:p-6 md:p-8 shadow-lg border-2">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">1. Upload Gambar</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed rounded-lg p-6 sm:p-8 hover:border-primary transition-colors cursor-pointer bg-muted/30 hover:bg-muted/50"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-48 sm:h-64 object-contain rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Ganti Gambar
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Klik untuk upload gambar</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">PNG, JPG, atau JPEG (Max. 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="compare-mode" className="text-sm font-medium">
                  Mode Perbandingan
                </Label>
                <p className="text-xs text-muted-foreground">Bandingkan kedua model secara bersamaan</p>
              </div>
              <Switch id="compare-mode" checked={compareMode} onCheckedChange={handleCompareModeChange} />
            </div>

            {!compareMode && (
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Pilih Model</h3>
                <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSegment} disabled={!uploadedImage || isProcessing} className="flex-1" size="lg">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{compareMode ? "Bandingkan Model" : "Analisis Gambar"}</span>
                    <span className="sm:hidden">{compareMode ? "Bandingkan" : "Analisis"}</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              {(uploadedImage || results || comparisonResults.unet) && (
                <Button variant="outline" size="lg" onClick={handleReset} disabled={isProcessing}>
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="lg:min-h-[600px]">
            <h3 className="text-lg font-semibold mb-4">{compareMode ? "Perbandingan Hasil" : "3. Hasil Segmentasi"}</h3>
            {compareMode ? (
              comparisonResults.unet && comparisonResults.unetMobilenet ? (
                <ComparisonPanel
                  unetResult={comparisonResults.unet}
                  mobilenetResult={comparisonResults.unetMobilenet}
                />
              ) : (
                <div className="border-2 border-dashed rounded-lg h-full min-h-[400px] flex items-center justify-center bg-muted/30">
                  <div className="text-center space-y-2 px-4">
                    <p className="text-sm sm:text-base text-muted-foreground">Perbandingan hasil akan muncul di sini</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Upload gambar untuk membandingkan kedua model
                    </p>
                  </div>
                </div>
              )
            ) : results ? (
              <ResultsPanel results={results} model={selectedModel} />
            ) : (
              <div className="border-2 border-dashed rounded-lg h-full min-h-[400px] flex items-center justify-center bg-muted/30">
                <div className="text-center space-y-2 px-4">
                  <p className="text-sm sm:text-base text-muted-foreground">Hasil segmentasi akan muncul di sini</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Upload gambar dan pilih model untuk memulai
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
