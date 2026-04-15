"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useCountdown } from "../hooks/useCountdown"

interface SegmentProps {
  digit: string
  slideStrength: number
  showFlash: boolean
  slideDuration: number
}

function Segment({ digit, slideStrength, showFlash, slideDuration }: SegmentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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

    gsap.killTweensOf([flashLayer, span])

    gsap.to(span, {
      y: `${Math.min(slideStrength, 125)}%`,
      duration: slideDuration,
      ease: "power4.in",
      onComplete: () => {
        setDisplayed(pendingDigit.current)
        gsap.fromTo(span, { y: `-${Math.min(slideStrength, 125)}%` }, { y: "0%", duration: slideDuration, ease: "power4.out" })
        if (showFlash) {
          gsap.timeline().to(containerRef.current, { y: `${slideStrength * 0.075}%`, duration: slideDuration * 0.35, ease: "power1.out" }).to(containerRef.current, { y: "0%", duration: slideDuration, ease: "ease.in" })
          gsap.fromTo(flashLayer, { opacity: 0.2 }, { opacity: 0, duration: 0.5 })
        }
      },
    })
  }, [digit, slideStrength, showFlash, slideDuration])

  return (
    <div ref={containerRef} className="relative overflow-hidden flex items-center justify-center rounded-lg bg-accent w-14 h-16">
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
  slideStrength: number
  showFlash: boolean
  showText: boolean
  slideDuration: number
}

function SegmentGroup({ value, unit, slideStrength, showFlash, showText, slideDuration }: SegmentGroupProps) {
  const [tens, ones] = String(value).padStart(2, "0").split("")
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <Segment digit={tens} slideStrength={slideStrength} showFlash={showFlash} slideDuration={slideDuration} />
        <Segment digit={ones} slideStrength={slideStrength} showFlash={showFlash} slideDuration={slideDuration} />
      </div>
      {showText && (
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {unit}
        </span>
      )}
    </div>
  )
}

function Separator() {
  return (
    <div className="flex h-16 items-center justify-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 12 32"
        className="h-10 w-4 fill-muted-foreground"
      >
        <circle cx="6" cy="11" r="2.2" />
        <circle cx="6" cy="21" r="2.2" />
      </svg>
    </div>
  )
}

interface CountdownProps {
  targetDate: Date | string
  onFinish?: () => void
  slideStrength?: number
  slideDuration?: number
  showText?: boolean
  showFlash?: boolean
}

export default function Countdown({
  targetDate,
  onFinish,
  slideStrength = 125,
  slideDuration = 0.5,
  showText = true,
  showFlash = true,
}: CountdownProps) {
  const safeSlideStrength = Math.min(slideStrength, 500)
  const safeSlideDuration = Math.min(slideDuration, 0.5)
  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetDate)

  useEffect(() => {
    if (isFinished) onFinish?.()
  }, [isFinished])

  if (isFinished) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-card p-4">
        <span className="text-2xl font-semibold tracking-wide text-muted-foreground">
          Time's up
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 rounded-2xl bg-card p-4">
      <SegmentGroup value={days} unit="dni" slideStrength={safeSlideStrength} showFlash={showFlash} showText={showText} slideDuration={safeSlideDuration} />
      <Separator />
      <SegmentGroup value={hours} unit="godziny" slideStrength={safeSlideStrength} showFlash={showFlash} showText={showText} slideDuration={safeSlideDuration} />
      <Separator />
      <SegmentGroup value={minutes} unit="minuty" slideStrength={safeSlideStrength} showFlash={showFlash} showText={showText} slideDuration={safeSlideDuration} />
      <Separator />
      <SegmentGroup value={seconds} unit="sekundy" slideStrength={safeSlideStrength} showFlash={showFlash} showText={showText} slideDuration={safeSlideDuration} />
    </div>
  )
}
