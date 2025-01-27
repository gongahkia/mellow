import { Button } from "@/components/ui/button"
import { useState } from "react"

const strings = ["E", "A", "D", "G", "B"]
const frets = [0, 1, 2, 3, 4]

interface GuitarProps {
  playNote: (string: string, fret: number) => void
}

export function Guitar({ playNote }: GuitarProps) {
  const [hue, setHue] = useState(0)

  const handleNotePlay = (string: string, fret: number) => {
    playNote(string, fret)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg flex justify-center backdrop-blur-md">
      <div className="flex flex-col">
        {strings.map((string) => (
          <div key={string} className="flex mb-2">
            {frets.map((fret) => (
              <Button
                key={`${string}${fret}`}
                className="w-16 h-8 border border-gray-300 rounded-none flex items-center justify-center text-white transition-colors duration-300"
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

