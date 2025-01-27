"use client"

import { useEffect, useRef } from "react"
import InstrumentPanel from "@/components/InstrumentPanel"
import RecordingControls from "@/components/RecordingControls"

export default function Studio() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0
    const loop = () => {
      time += 0.01
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 100; i++) {
        ctx.beginPath()
        ctx.arc(
          (Math.sin(time + i) * canvas.width) / 2 + canvas.width / 2,
          (Math.cos(time + i) * canvas.height) / 2 + canvas.height / 2,
          Math.abs(Math.sin(time)) * 20,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = `hsl(${time * 100 + i * 3}, 50%, 50%)`
        ctx.fill()
      }

      requestAnimationFrame(loop)
    }

    loop()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Mellow Studio</h1>
        <div className="space-y-6">
          <InstrumentPanel />
          <RecordingControls />
        </div>
      </div>
    </div>
  )
}

