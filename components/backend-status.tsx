"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

const PYTHON_BACKEND_URL = "https://composed-levels-prepaid-robust.trycloudflare.com"

export function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")
  const [endpoints, setEndpoints] = useState<string[]>([])

  useEffect(() => {
    checkBackend()
  }, [])

  const checkBackend = async () => {
    try {
      const possibleEndpoints = ["/", "/health", "/api/health", "/predict", "/segment"]
      const foundEndpoints: string[] = []

      for (const endpoint of possibleEndpoints) {
        try {
          const response = await fetch(`${PYTHON_BACKEND_URL}${endpoint}`, {
            method: "GET",
          })
          if (response.ok || response.status === 405) {
            foundEndpoints.push(endpoint)
          }
        } catch (err) {
          // Skip failed endpoints
        }
      }

      if (foundEndpoints.length > 0) {
        setStatus("online")
        setEndpoints(foundEndpoints)
      } else {
        setStatus("offline")
      }
    } catch (error) {
      setStatus("offline")
    }
  }

  if (status === "checking") {
    return (
      <Alert className="mb-6">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Memeriksa koneksi ke backend Python...</AlertDescription>
      </Alert>
    )
  }

  if (status === "offline") {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Backend Python tidak terhubung. Pastikan server berjalan di {PYTHON_BACKEND_URL}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-6 border-green-500/50 bg-green-500/10">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-600">
        Backend Python terhubung. Endpoints tersedia: {endpoints.join(", ") || "/"}
      </AlertDescription>
    </Alert>
  )
}
