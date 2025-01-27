"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [opacity, setOpacity] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    router.push("/studio")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <h1
        className="text-6xl font-bold text-white cursor-pointer transition-opacity duration-1000 ease-in-out"
        style={{ opacity }}
        onClick={handleClick}
      >
        Mellow
      </h1>
    </div>
  )
}

