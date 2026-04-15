"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useCountdown } from "../hooks/useCountdown"

interface SegmentProps {
  digit: string
  animationStrength: number
  flash: boolean
}

function Segment({ digit, animationStrength, flash: enableFlash }: SegmentProps) {
  const flashRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState(digit)
  const pendingDigit = useRef(digit)

  useEffect(() => {
    if (digit === displayed) return
    pendingDigit.current = digit

    const flashLayer = flashRef.current
    const span = spanRef.current
    if (!flashLayer || !span) return

    const slideDuration = 0.55

    gsap.killTweensOf([flashLayer, span])

    gsap.to(span, {
      y: `${animationStrength}%`,
      duration: slideDuration,
      ease: "power4.in",
      onComplete: () => {
        setDisplayed(pendingDigit.current)
        gsap.fromTo(span, { y: `-${animationStrength}%` }, { y: "0%", duration: slideDuration, ease: "power4.out" })
        if (enableFlash) {
          gsap.fromTo(flashLayer, { opacity: 0.2 }, { opacity: 0, duration: 0.5 })
        }
      },
    })
  }, [digit, animationStrength, enableFlash])

  return (
    <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-accent w-14 h-16">
      <div ref={flashRef} className="absolute inset-0 bg-accent-foreground opacity-0 pointer-events-none" />
      <span
        ref={spanRef}
        className="absolute tabular-nums text-4xl font-bold tracking-tight text-accent-foreground"
      >
        {displayed}
      </span>
    </div>
  )
}

interface SegmentGroupProps {
  value: number
  unit: string
  animationStrength: number
  flash: boolean
}

function SegmentGroup({ value, unit, animationStrength, flash }: SegmentGroupProps) {
  const [tens, ones] = String(value).padStart(2, "0").split("")
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <Segment digit={tens} animationStrength={animationStrength} flash={flash} />
        <Segment digit={ones} animationStrength={animationStrength} flash={flash} />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {unit}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <span className="mb-6 text-3xl font-light text-muted-foreground select-none">:</span>
  )
}

interface CountdownProps {
  targetDate: Date | string
  onFinish?: () => void
  animationStrength?: number
  flash?: boolean
}

export default function Countdown({
  targetDate,
  onFinish,
  animationStrength = 125,
  flash = true,
}: CountdownProps) {
  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetDate)

  useEffect(() => {
    if (isFinished) onFinish?.()
  }, [isFinished])

  if (isFinished) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-card px-10 py-8">
        <span className="text-2xl font-semibold tracking-wide text-muted-foreground">
          Time's up
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-4">
      <SegmentGroup value={days} unit="dni" animationStrength={animationStrength} flash={flash} />
      <Separator />
      <SegmentGroup value={hours} unit="godziny" animationStrength={animationStrength} flash={flash} />
      <Separator />
      <SegmentGroup value={minutes} unit="minuty" animationStrength={animationStrength} flash={flash} />
      <Separator />
      <SegmentGroup value={seconds} unit="sekundy" animationStrength={animationStrength} flash={flash} />
    </div>
  )
}
