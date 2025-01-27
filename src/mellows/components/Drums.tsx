import { Button } from "@/components/ui/button"
import { useState } from "react"

const drumParts = [
  { name: "Kick", frequency: 60 },
  { name: "Snare", frequency: 200 },
  { name: "Hi-Hat", frequency: 1000 },
]

interface DrumsProps {
  playNote: (frequency: number, duration: number) => void
}

export function Drums({ playNote }: DrumsProps) {
  const [hue, setHue] = useState(0)

  const handleDrumPlay = (frequency: number) => {
    playNote(frequency, 0.1)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg flex justify-center backdrop-blur-md">
      <div className="grid grid-cols-3 gap-4">
        {drumParts.map((part) => (
          <Button
            key={part.name}
            className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300"
            onClick={() => handleDrumPlay(part.frequency)}
            style={{
              background: `hsl(${hue}, 70%, 50%)`,
            }}
          >
            {part.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

