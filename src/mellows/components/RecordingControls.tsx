import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAudioContext } from "@/hooks/useAudioContext"
import { Slider } from "@/components/ui/slider"
import { Save, Trash2 } from "lucide-react"

interface Recording {
  id: string
  audioUrl: string
  name: string
}

export default function RecordingControls() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const { startRecording, stopRecording } = useAudioContext()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null)

  const handleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording()
      const audioUrl = URL.createObjectURL(audioBlob)
      const newRecording = { id: Date.now().toString(), audioUrl, name: `Recording ${recordings.length + 1}` }
      setRecordings([...recordings, newRecording])
      setCurrentRecording(newRecording)
    } else {
      await startRecording()
    }
    setIsRecording(!isRecording)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleDelete = (id: string) => {
    setRecordings(recordings.filter((recording) => recording.id !== id))
    if (currentRecording?.id === id) {
      setCurrentRecording(null)
    }
  }

  const handleSave = (id: string, name: string) => {
    setRecordings(recordings.map((recording) => (recording.id === id ? { ...recording, name } : recording)))
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      }
    }
  }, [audioRef.current]) // Added audioRef.current to dependencies

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Recording</h2>
      <Button onClick={handleRecording} variant={isRecording ? "destructive" : "default"}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Recordings</h3>
        {recordings.map((recording) => (
          <div key={recording.id} className="mb-4">
            <div className="flex items-center mb-2">
              <Input
                value={recording.name}
                onChange={(e) => handleSave(recording.id, e.target.value)}
                className="mr-2"
              />
              <Button onClick={() => handleDelete(recording.id)} variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <audio ref={audioRef} src={recording.audioUrl} controls />
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSliderChange}
              className="mt-2"
            />
            <div className="text-sm text-gray-500 mt-1">
              {currentTime.toFixed(2)} / {duration.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

