"use client"
import { useState, useEffect, useMemo } from "react"

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isFinished: boolean
}

export function useCountdown(targetDate: Date | string): TimeLeft {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate])

  const compute = (): TimeLeft => {
    const diff = Math.max(0, target - Date.now())
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor(diff / 3_600_000) % 24,
      minutes: Math.floor(diff / 60_000) % 60,
      seconds: Math.floor(diff / 1_000) % 60,
      isFinished: diff === 0,
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(compute)

  useEffect(() => {
    if (timeLeft.isFinished) return
    const id = setInterval(() => setTimeLeft(compute()), 1_000)
    return () => clearInterval(id)
  }, [target, timeLeft.isFinished])

  return timeLeft
}
