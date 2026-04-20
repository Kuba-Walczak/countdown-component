"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isFinished: boolean
}

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
    <div ref={containerRef} className="relative overflow-hidden flex items-center justify-center w-14 bg-card h-16 rounded-lg shadow-[inset_0_0_16px_rgba(0,0,0,0.5)]">
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
  showLabels: boolean
  isMobile?: boolean
  animateSizeOnMobile?: boolean
}

function SegmentGroup({ value, unit, slideIntensity, slideDuration, flashIntensity, showLabels, isFinalCountdown, isSeconds, isMobile, animateSizeOnMobile }: SegmentGroupProps & { isFinalCountdown?: boolean, isSeconds?: boolean }) {
  const [tens, ones] = String(value).padStart(2, "0").split("")
  const labelWrapperRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFinalCountdown && !isSeconds && outerRef.current) {
      if (isMobile && !animateSizeOnMobile) {
        gsap.set(outerRef.current, { opacity: 0, width: 0, margin: 0, padding: 0 })
        outerRef.current.style.display = "none"
      } else {
      gsap.to(outerRef.current, {
        width: 0,
        opacity: 0,
        margin: 0,
        padding: 0,
        duration: 0.5,
        ease: "power4.out",
        onComplete: () => {
          if (outerRef.current) outerRef.current.style.display = "none"
        }
      })
      }
    }

    if (isFinalCountdown && labelWrapperRef.current && outerRef.current) {
      if (isMobile) {
        gsap.set(labelWrapperRef.current, { opacity: 0, height: 0 })
        gsap.set(outerRef.current, { rowGap: 0 })
      } else {
        gsap.to(labelWrapperRef.current, { opacity: 0, height: 0, duration: 0.5, ease: "power4.out" })
        gsap.to(outerRef.current, { rowGap: 0, duration: 0.5, ease: "power4.out" })
      }
    }
  }, [isFinalCountdown, isSeconds, isMobile, animateSizeOnMobile])

  return (
    <div ref={outerRef} className={`flex flex-col items-center gap-2 ${!isSeconds ? "overflow-hidden" : ""}`}>
      <div className="flex gap-1">
        <Segment digit={tens} slideIntensity={slideIntensity} flashIntensity={flashIntensity} slideDuration={slideDuration} />
        <Segment digit={ones} slideIntensity={slideIntensity} flashIntensity={flashIntensity} slideDuration={slideDuration} />
      </div>
      {showLabels && (
        <div ref={labelWrapperRef} className="overflow-hidden">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-background">
            {unit}
          </span>
        </div>
      )}
    </div>
  )
}

interface SeparatorProps {
  isFinalCountdown: boolean
  showBelowSm?: boolean
  isMobile?: boolean
}

function Separator({ isFinalCountdown, showBelowSm = false, isMobile }: SeparatorProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFinalCountdown && ref.current) {
      if (isMobile) {
        gsap.set(ref.current, { opacity: 0, width: 0 })
        ref.current.style.display = "none"
      } else {
        gsap.to(ref.current, {
          opacity: 0,
          width: 0,
          duration: 0.5,
          ease: "power4.out",
        })
      }
    }
  }, [isFinalCountdown, isMobile])

  return (
    <div ref={ref} className={`h-16 items-center justify-center overflow-hidden ${showBelowSm ? "flex" : "hidden sm:flex"}`}>
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
  showLabels?: boolean
  endText?: string
  unitLabels?: Partial<Record<"days" | "hours" | "minutes" | "seconds", string>>
}

function useCountdown(targetDate: Date | string): TimeLeft {
  const target = new Date(targetDate).getTime()

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
    setTimeLeft(compute())
  }, [targetDate])

  useEffect(() => {
    if (timeLeft.isFinished) return
    const id = setInterval(() => setTimeLeft(compute()), 1_000)
    return () => clearInterval(id)
  }, [targetDate, timeLeft.isFinished])

  return timeLeft
}

export default function Countdown({
  targetDate,
  onFinish,
  slideIntensity = 1,
  slideDuration = 1,
  flashIntensity = 1,
  showLabels = true,
  endText = "KONIEC CZASU",
  unitLabels,
}: CountdownProps) {
  const labels = {
    days: "dni",
    hours: "godziny",
    minutes: "minuty",
    seconds: "sekundy",
    ...unitLabels,
  }
  const normalizedSlideDuration = Math.max(0, Math.min(slideDuration, 1))
  const denormalizedSlideIntensity = slideIntensity * 125
  const denormalizedSlideDuration = normalizedSlideDuration * 0.5
  const denormalizedFlashIntensity = flashIntensity * 0.25
  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetDate)
  const expiredAtMount = useRef(isFinished)

  const isFinalCountdown = days === 0 && hours === 0 && minutes === 0 && seconds <= 9

  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(max-width: 640px)")
    const handleChange = () => setIsMobile(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (isFinalCountdown && containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 2,
        duration: 0.25,
        ease: "power4.out",
        transformOrigin: "center center",
      })
    } else if (!isFinalCountdown && containerRef.current) {
      gsap.to(containerRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power4.out",
      })
    }
  }, [isFinalCountdown])

  useEffect(() => {
    if (isFinished) onFinish?.()
  }, [isFinished])

  if (expiredAtMount.current) {
    return (
      <div className="relative flex flex-wrap sm:flex-nowrap items-start rounded-2xl bg-accent p-4 gap-2">
      <div className="relative flex items-center justify-center rounded-lg px-4 h-16 bg-card shadow-[inset_0_0_16px_rgba(0,0,0,0.5)]">
        <span className="text-4xl font-bold text-accent whitespace-nowrap">
          {endText}
        </span>
      </div>
    </div>
    )
  }

  return (
    <div ref={containerRef} className={`w-fit grid grid-cols-[auto_auto_auto] sm:flex sm:flex-nowrap items-start rounded-2xl bg-accent p-4 ${isFinalCountdown ? "gap-0" : "gap-2"} transition-all duration-500`}>
      <SegmentGroup value={days} unit={labels.days} slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showLabels={showLabels} slideDuration={denormalizedSlideDuration} isFinalCountdown={isFinalCountdown} isMobile={isMobile} animateSizeOnMobile />
      <Separator isFinalCountdown={isFinalCountdown} showBelowSm isMobile={isMobile} />
      <SegmentGroup value={hours} unit={labels.hours} slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showLabels={showLabels} slideDuration={denormalizedSlideDuration} isFinalCountdown={isFinalCountdown} isMobile={isMobile} animateSizeOnMobile />
      <Separator isFinalCountdown={isFinalCountdown} isMobile={isMobile} />
      <SegmentGroup value={minutes} unit={labels.minutes} slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showLabels={showLabels} slideDuration={denormalizedSlideDuration} isFinalCountdown={isFinalCountdown} isMobile={isMobile} />
      <Separator isFinalCountdown={isFinalCountdown} showBelowSm isMobile={isMobile} />
      <SegmentGroup value={seconds} unit={labels.seconds} slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showLabels={showLabels} slideDuration={denormalizedSlideDuration} isFinalCountdown={isFinalCountdown} isSeconds isMobile={isMobile} />
    </div>
  )
}
