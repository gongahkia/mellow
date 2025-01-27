import { Button } from "@/components/ui/button"
import { useState } from "react"

const stringInstruments = ["Violin", "Viola", "Cello", "Double Bass"]
const notes = ["C", "D", "E", "F", "G", "A", "B"]

interface StringsProps {
  playNote: (instrument: string, note: string) => void
}

export function Strings({ playNote }: StringsProps) {
  const [hue, setHue] = useState(0)

  const handleNotePlay = (instrument: string, note: string) => {
    playNote(instrument, note)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-md">
      <div className="grid grid-cols-2 gap-4">
        {stringInstruments.map((instrument) => (
          <div key={instrument} className="bg-gray-800 p-2 rounded">
            <h3 className="text-center font-bold mb-2 text-white">{instrument}</h3>
            <div className="grid grid-cols-3 gap-2">
              {notes.map((note) => (
                <Button
                  key={`${instrument}${note}`}
                  className="text-white transition-colors duration-300"
                  onClick={() => handleNotePlay(instrument, note)}
                  style={{
                    background: `hsl(${hue}, 70%, 50%)`,
                  }}
                >
                  {note}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
