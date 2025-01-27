import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAudioContext } from "@/hooks/useAudioContext"
import { Piano } from "./Piano"
import { Drums } from "./Drums"
import { Guitar } from "./Guitar"
import { Bass } from "./Bass"
import { Strings } from "./Strings"

const instruments = ["Piano", "Drums", "Guitar", "Bass", "Strings"]

const noteFrequencies: { [key: string]: number } = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
}

export default function InstrumentPanel() {
  const { instrument, setInstrument, playNote } = useAudioContext()
  const [hue, setHue] = useState(0)

  const handleNotePlay = (note: string, octave = 4) => {
    const frequency = noteFrequencies[note] * Math.pow(2, octave - 4)
    playNote(frequency, 0.5)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  const handleStringPlay = (stringInstrument: string, note: string) => {
    const baseFrequency = noteFrequencies[note]
    const instrumentMultipliers: { [key: string]: number } = {
      Violin: 2,
      Viola: 1.5,
      Cello: 0.5,
      "Double Bass": 0.25,
    }
    playNote(baseFrequency * instrumentMultipliers[stringInstrument], 1)
    setHue((prevHue) => (prevHue + 30) % 360)
  }

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Instrument: {instrument}</h2>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {instruments.map((inst) => (
          <Button
            key={inst}
            onClick={() => setInstrument(inst.toLowerCase() as any)}
            variant={instrument === inst.toLowerCase() ? "default" : "outline"}
            style={{
              background: `hsl(${hue}, 70%, 50%)`,
              transition: "background 0.3s ease",
            }}
          >
            {inst}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        {instrument === "piano" && <Piano playNote={handleNotePlay} />}
        {instrument === "drums" && <Drums playNote={playNote} />}
        {instrument === "guitar" && <Guitar playNote={(string, fret) => handleNotePlay(string, fret + 2)} />}
        {instrument === "bass" && <Bass playNote={playNote} />}
        {instrument === "strings" && <Strings playNote={handleStringPlay} />}
      </div>
    </div>
  )
}

