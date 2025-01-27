import { useState, useEffect, useRef } from "react"

type Instrument = "piano" | "drums" | "guitar" | "bass" | "strings"

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [instrument, setInstrument] = useState<Instrument>("piano")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playNote = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return

    const now = audioContextRef.current.currentTime
    const gainNode = audioContextRef.current.createGain()
    gainNode.connect(audioContextRef.current.destination)

    switch (instrument) {
      case "piano":
        playPiano(frequency, duration, now, gainNode)
        break
      case "drums":
        playDrums(frequency, duration, now, gainNode)
        break
      case "guitar":
        playGuitar(frequency, duration, now, gainNode)
        break
      case "bass":
        playBass(frequency, duration, now, gainNode)
        break
      case "strings":
        playStrings(frequency, duration, now, gainNode)
        break
    }
  }

  const playPiano = (frequency: number, duration: number, now: number, gainNode: GainNode) => {
    const oscillator = audioContextRef.current!.createOscillator()
    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(frequency, now)

    gainNode.gain.setValueAtTime(0.8, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    oscillator.connect(gainNode)
    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  const playDrums = (frequency: number, duration: number, now: number, gainNode: GainNode) => {
    const oscillator = audioContextRef.current!.createOscillator()
    const noiseGain = audioContextRef.current!.createGain()
    const noise = audioContextRef.current!.createBufferSource()
    const buffer = audioContextRef.current!.createBuffer(
      1,
      audioContextRef.current!.sampleRate * 0.1,
      audioContextRef.current!.sampleRate,
    )
    const data = buffer.getChannelData(0)
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1
    }

    noise.buffer = buffer
    noise.loop = true

    if (frequency < 100) {
      // Kick drum
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, now)
      oscillator.frequency.exponentialRampToValueAtTime(1, now + 0.1)

      gainNode.gain.setValueAtTime(1.5, now)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      oscillator.connect(gainNode)
      oscillator.start(now)
      oscillator.stop(now + 0.3)
    } else if (frequency < 300) {
      // Snare drum
      noiseGain.gain.setValueAtTime(0.5, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

      noise.connect(noiseGain)
      noiseGain.connect(gainNode)
      noise.start(now)
      noise.stop(now + 0.2)

      oscillator.type = "triangle"
      oscillator.frequency.setValueAtTime(frequency, now)
      oscillator.connect(gainNode)
      oscillator.start(now)
      oscillator.stop(now + 0.2)
    } else {
      // Hi-hat
      noiseGain.gain.setValueAtTime(0.3, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

      const filter = audioContextRef.current!.createBiquadFilter()
      filter.type = "highpass"
      filter.frequency.setValueAtTime(5000, now)

      noise.connect(noiseGain)
      noiseGain.connect(filter)
      filter.connect(gainNode)
      noise.start(now)
      noise.stop(now + 0.1)
    }
  }

  const playGuitar = (frequency: number, duration: number, now: number, gainNode: GainNode) => {
    const oscillator = audioContextRef.current!.createOscillator()
    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(frequency, now)

    gainNode.gain.setValueAtTime(0.5, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    const filter = audioContextRef.current!.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(2000, now)
    filter.Q.setValueAtTime(5, now)

    oscillator.connect(filter)
    filter.connect(gainNode)
    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  const playBass = (frequency: number, duration: number, now: number, gainNode: GainNode) => {
    const oscillator = audioContextRef.current!.createOscillator()
    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(frequency, now)

    gainNode.gain.setValueAtTime(0.8, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    const filter = audioContextRef.current!.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(500, now)
    filter.Q.setValueAtTime(5, now)

    const subOscillator = audioContextRef.current!.createOscillator()
    subOscillator.type = "sine"
    subOscillator.frequency.setValueAtTime(frequency / 2, now)

    const subGain = audioContextRef.current!.createGain()
    subGain.gain.setValueAtTime(0.5, now)

    oscillator.connect(filter)
    filter.connect(gainNode)
    subOscillator.connect(subGain)
    subGain.connect(gainNode)

    oscillator.start(now)
    subOscillator.start(now)
    oscillator.stop(now + duration)
    subOscillator.stop(now + duration)
  }

  const playStrings = (frequency: number, duration: number, now: number, gainNode: GainNode) => {
    const oscillator1 = audioContextRef.current!.createOscillator()
    const oscillator2 = audioContextRef.current!.createOscillator()
    oscillator1.type = "sawtooth"
    oscillator2.type = "sine"
    oscillator1.frequency.setValueAtTime(frequency, now)
    oscillator2.frequency.setValueAtTime(frequency * 1.01, now)

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.linearRampToValueAtTime(0.7, now + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    oscillator1.start(now)
    oscillator2.start(now)
    oscillator1.stop(now + duration)
    oscillator2.stop(now + duration)
  }

  const startRecording = async () => {
    audioChunksRef.current = []
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    recordingStreamRef.current = stream
    mediaRecorderRef.current = new MediaRecorder(stream)

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data)
    }

    mediaRecorderRef.current.start()
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
          if (recordingStreamRef.current) {
            recordingStreamRef.current.getTracks().forEach((track) => track.stop())
          }
          resolve(audioBlob)
        }
        mediaRecorderRef.current.stop()
      } else {
        resolve(new Blob())
      }
    })
  }

  return {
    audioContext: audioContextRef.current,
    instrument,
    setInstrument,
    playNote,
    startRecording,
    stopRecording,
  }
}

