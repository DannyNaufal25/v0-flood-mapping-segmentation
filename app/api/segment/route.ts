import { type NextRequest, NextResponse } from "next/server"

const PYTHON_BACKEND_URL = "https://composed-levels-prepaid-robust.trycloudflare.com"

export async function POST(request: NextRequest) {
  try {
    const { image, model } = await request.json()

    if (!image || !model) {
      return NextResponse.json({ error: "Image and model are required" }, { status: 400 })
    }

    let base64Image = image
    if (image.includes(",")) {
      base64Image = image.split(",")[1]
    }

    const requestBody = {
      image: base64Image, // Send only base64 string without data URL prefix
      model: model === "unet" ? "unet" : "unet_mobilenet",
    }

    console.log("[v0] Sending request to backend:", PYTHON_BACKEND_URL)
    console.log("[v0] Model:", requestBody.model)
    console.log("[v0] Image data length:", base64Image.length)

    const response = await fetch(`${PYTHON_BACKEND_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error:", errorText)
      return NextResponse.json(
        {
          error: `Backend error: ${response.status}`,
          details: errorText,
          hint: "Pastikan backend Python sudah running dan endpoint /predict tersedia",
        },
        { status: 502 },
      )
    }

    const data = await response.json()
    console.log("[v0] Successfully received data from backend")

    const result = {
      originalImage: image,
      segmentedImage: data.segmented_image?.startsWith("data:")
        ? data.segmented_image
        : `data:image/png;base64,${data.segmented_image}`,
      maskImage: data.mask_image?.startsWith("data:") ? data.mask_image : `data:image/png;base64,${data.mask_image}`,
      metrics: {
        iou: data.metrics?.iou || data.iou || 0,
        dice: data.metrics?.dice || data.dice || 0,
        pixelAccuracy: data.metrics?.pixel_accuracy || data.pixel_accuracy || 0,
      },
      processingTime: data.processing_time || data.time || 0,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Segmentation API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
