"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useCountdown } from "../hooks/useCountdown"

interface SegmentProps {
  digit: string
  slideIntensity: number
  flashIntensity: number
  slideDuration: number
}

function Segment({ digit, slideIntensity, flashIntensity, slideDuration }: SegmentProps) {
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
      y: `${Math.min(slideIntensity, 125)}%`,
      duration: slideDuration,
      ease: "power4.in",
      onComplete: () => {
        setDisplayed(pendingDigit.current)
        gsap.fromTo(span, { y: `-${Math.min(slideIntensity, 125)}%` }, { y: "0%", duration: slideDuration, ease: "power4.out" })
        gsap.timeline().to(containerRef.current, { y: `${slideIntensity * 0.075}%`, duration: slideDuration * 0.35, ease: "power1.out" }).to(containerRef.current, { y: "0%", duration: slideDuration, ease: "ease.in" })
        gsap.fromTo(flashLayer, { opacity: flashIntensity }, { opacity: 0, duration: 0.5 })
      },
    })
  }, [digit, slideIntensity, flashIntensity, slideDuration])

  return (
    <div ref={containerRef} className="relative overflow-hidden flex items-center justify-center rounded-lg bg-card w-14 h-16">
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_16px_rgba(0,0,0,0.5)]" />
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0 pointer-events-none" />
      <span
        ref={spanRef}
        className="absolute tabular-nums text-4xl font-bold tracking-tight text-accent"
      >
        {displayed}
      </span>
    </div>
  )
}

interface SegmentGroupProps {
  value: number
  unit: string
  slideIntensity: number
  slideDuration: number
  flashIntensity: number
  showText: boolean
}

function SegmentGroup({ value, unit, slideIntensity, slideDuration, flashIntensity, showText }: SegmentGroupProps) {
  const [tens, ones] = String(value).padStart(2, "0").split("")
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <Segment digit={tens} slideIntensity={slideIntensity} flashIntensity={flashIntensity} slideDuration={slideDuration} />
        <Segment digit={ones} slideIntensity={slideIntensity} flashIntensity={flashIntensity} slideDuration={slideDuration} />
      </div>
      {showText && (
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-background">
          {unit}
        </span>
      )}
    </div>
  )
}

function Separator() {
  return (
    <div className="h-16 items-center justify-center hidden sm:flex">
      <svg
        aria-hidden="true"
        viewBox="0 0 12 32"
        className="h-10 w-4 fill-card"
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
  slideIntensity?: number
  slideDuration?: number
  flashIntensity?: number
  showText?: boolean
}

export default function Countdown({
  targetDate,
  onFinish,
  slideIntensity = 1,
  slideDuration = 1,
  flashIntensity = 1,
  showText = true,
}: CountdownProps) {
  const normalizedSlideDuration = Math.max(0, Math.min(slideDuration, 1))
  const flashRef = useRef<HTMLDivElement>(null)
  const denormalizedSlideIntensity = slideIntensity * 125
  const denormalizedSlideDuration = normalizedSlideDuration * 0.5
  const denormalizedFlashIntensity = flashIntensity * 0.25
  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetDate)

  useEffect(() => {
    if (isFinished) onFinish?.()
  }, [isFinished])

  useEffect(() => {
    console.log(days, hours, minutes, seconds)
    if (days === 0 && hours === 0 && minutes === 0 && seconds <= 10) {
      gsap.fromTo(flashRef.current, { opacity: 0.5 }, { opacity: 0, duration: 0.5 })
    }
  }, [seconds])

  if (isFinished) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-accent p-4">
        <span className="text-2xl font-semibold tracking-wide text-muted-background">
          Time's up
        </span>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col sm:flex-row items-start gap-2 rounded-2xl bg-accent p-4">
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0 rounded-2xl pointer-events-none z-10" />
      <SegmentGroup value={days} unit="dni" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} />
      <Separator />
      <SegmentGroup value={hours} unit="godziny" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} />
      <Separator />
      <SegmentGroup value={minutes} unit="minuty" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} />
      <Separator />
      <SegmentGroup value={seconds} unit="sekundy" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} />
    </div>
  )
}
