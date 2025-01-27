import { Button } from "@/components/ui/button"
import { useState } from "react"

const notes = ["C", "D", "E", "F", "G", "A", "B"]
const octaves = [3, 4, 5]

interface PianoProps {
  playNote: (note: string, octave: number) => void
}

export function Piano({ playNote }: PianoProps) {
  const [hue, setHue] = useState(0)

  const handleNotePlay = (note: string, octave: number) => {
    playNote(note, octave)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg overflow-x-auto flex justify-center backdrop-blur-md">
      <div className="flex min-w-max">
        {octaves.map((octave) => (
          <div key={octave} className="flex">
            {notes.map((note) => (
              <Button
                key={`${note}${octave}`}
                className="w-10 h-32 border border-gray-300 rounded-b-lg mr-1 flex items-end justify-center pb-2 text-xs transition-colors duration-300"
                onClick={() => handleNotePlay(note, octave)}
                style={{
                  background: `hsl(${hue}, 70%, ${note.includes("#") ? "30%" : "50%"})`,
                }}
              >
                {note}
                {octave}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

