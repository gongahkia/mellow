import { Button } from "@/components/ui/button"
import { useState } from "react"

const strings = ["E", "A", "D", "G"]
const frets = [0, 1, 2, 3, 4, 5]

const baseFrequencies = {
  E: 41.2,
  A: 55.0,
  D: 73.42,
  G: 98.0,
}

interface BassProps {
  playNote: (frequency: number, duration: number) => void
}

export function Bass({ playNote }: BassProps) {
  const [hue, setHue] = useState(0)

  const handleNotePlay = (string: string, fret: number) => {
    const baseFrequency = baseFrequencies[string as keyof typeof baseFrequencies]
    const frequency = baseFrequency * Math.pow(2, fret / 12)
    playNote(frequency, 1)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg flex justify-center backdrop-blur-md">
      <div className="flex flex-col">
        {strings.map((string) => (
          <div key={string} className="flex mb-3">
            {frets.map((fret) => (
              <Button
                key={`${string}${fret}`}
                className="w-20 h-10 border border-gray-300 rounded-none flex items-center justify-center text-white transition-colors duration-300"
                onClick={() => handleNotePlay(string, fret)}
                style={{
                  background: `hsl(${hue}, 70%, 50%)`,
                }}
              >
                {string}
                {fret}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

