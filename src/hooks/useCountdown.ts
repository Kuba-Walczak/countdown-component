"use client"
import { useState, useEffect, useMemo } from "react"

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isFinished: boolean
  displayMessage: boolean
}

export function useCountdown(targetDate: Date | string): TimeLeft {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate])

  const compute = (): TimeLeft => {
    const diff = target - Date.now()
    const isPastThreshold = diff < -2000
    const cappedDiff = Math.max(0, diff)
    
    return {
      days: Math.floor(cappedDiff / 86_400_000),
      hours: Math.floor(cappedDiff / 3_600_000) % 24,
      minutes: Math.floor(cappedDiff / 60_000) % 60,
      seconds: !isPastThreshold && diff < 0 ? -1 : Math.floor(cappedDiff / 1_000) % 60,
      isFinished: diff <= 0,
      displayMessage: isPastThreshold,
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(compute)

  useEffect(() => {
    if (timeLeft.displayMessage) return
    if (timeLeft.isFinished) {
      const id = setTimeout(() => setTimeLeft(prev => ({ ...prev, displayMessage: true })), 1_000)
      return () => clearTimeout(id)
    }
    const id = setInterval(() => setTimeLeft(compute()), 1_000)
    return () => clearInterval(id)
  }, [target, timeLeft.displayMessage, timeLeft.isFinished])

  return timeLeft
}
