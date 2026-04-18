"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useCountdown } from "../hooks/useCountdown"

enum CountdownState {
  Default,
  Ending,
  HasEnded,
  DisplayMessage
}

enum SegmentPosition {
  Left,
  Middle,
  Right,
}

interface SegmentProps {
  digit: string
  slideIntensity: number
  flashIntensity: number
  slideDuration: number
  state: CountdownState
  position: SegmentPosition
  displayMessage?: boolean
}

function Segment({ digit, slideIntensity, flashIntensity, slideDuration, state, position, displayMessage }: SegmentProps) {
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
  }, [digit, slideIntensity, flashIntensity, slideDuration, state])

  return (
    <div ref={containerRef} className={`relative overflow-hidden flex items-center justify-center ${displayMessage ? "w-112" : "w-14 bg-card"} h-16 ${state === CountdownState.HasEnded || state === CountdownState.DisplayMessage ? (position === SegmentPosition.Left ? "rounded-l-lg rounded-r-none" : position === SegmentPosition.Right ? "rounded-r-lg rounded-l-none" : "rounded-none") : "rounded-lg"} transition-[width,border-radius] duration-500`}>
      <div className={`absolute inset-0 pointer-events-none ${state === CountdownState.HasEnded || state === CountdownState.DisplayMessage || displayMessage ? "" : "shadow-[inset_0_0_16px_rgba(0,0,0,0.5)]"} transition-all duration-500 power4.out`} />
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0 pointer-events-none" />
      <span
        ref={spanRef}
        className={`absolute tabular-nums text-4xl font-bold ${displayMessage ? "tracking-widest" : "tracking-tight"} text-accent`}
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
  state: CountdownState
  tensPosition?: SegmentPosition
  onesPosition?: SegmentPosition
}

function SegmentGroup({ value, unit, slideIntensity, slideDuration, flashIntensity, showText, state, tensPosition = SegmentPosition.Middle, onesPosition = SegmentPosition.Middle, message, isFinalCountdown, secondsValue }: SegmentGroupProps & { message?: string, isFinalCountdown?: boolean, secondsValue?: number }) {
  const [tens, ones] = String(value).padStart(2, "0").split("")
  const [_, secondsOnes] = String(Math.abs(secondsValue ?? 0)).padStart(2, "0").split("")
  const isNegative = (secondsValue ?? 0) < 0
  const [tensDisplayDigit, onesDisplayDigit] = isFinalCountdown
    ? isNegative
      ? ["", ""]
      : [secondsOnes, secondsOnes]
    : [null, null]
  const labelWrapperRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state === CountdownState.Ending && labelWrapperRef.current && outerRef.current) {
      gsap.to(labelWrapperRef.current, { opacity: 0, height: 0, duration: 0.5, ease: "power4.out" })
      gsap.to(outerRef.current, { rowGap: 0, duration: 0.5, ease: "power4.out" })
    }
  }, [state])

  return (
    <div ref={outerRef} className="flex flex-col items-center gap-2 basis-[calc(50%-0.25rem)] sm:basis-auto">
      <div className={`flex ${state === CountdownState.HasEnded || state === CountdownState.DisplayMessage ? "gap-0" : "gap-1"} transition-all duration-500 power4.out`}>
        <Segment digit={tensDisplayDigit ?? tens} slideIntensity={slideIntensity} flashIntensity={flashIntensity} slideDuration={slideDuration} state={state} position={tensPosition} />
        <Segment digit={onesDisplayDigit ?? ones} slideIntensity={slideIntensity} flashIntensity={flashIntensity} slideDuration={slideDuration} state={state} position={onesPosition} />
      </div>
      {showText && (
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
  state: CountdownState
}

function Separator({ state }: SeparatorProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state === CountdownState.Ending && ref.current) {
      gsap.to(ref.current, {
        opacity: 0,
        width: 0,
        duration: 0.5,
        ease: "power4.out",
      })
    }
  }, [state])

  return (
    <div ref={ref} className="h-16 items-center justify-center hidden sm:flex overflow-hidden">
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
  message?: string
}

export default function Countdown({
  targetDate,
  onFinish,
  slideIntensity = 1,
  slideDuration = 1,
  flashIntensity = 1,
  showText = true,
  message = "KONIEC CZASU",
}: CountdownProps) {
  const normalizedSlideDuration = Math.max(0, Math.min(slideDuration, 1))
  const flashRef = useRef<HTMLDivElement>(null)
  const denormalizedSlideIntensity = slideIntensity * 125
  const denormalizedSlideDuration = normalizedSlideDuration * 0.5
  const denormalizedFlashIntensity = flashIntensity * 0.25
  const { days, hours, minutes, seconds, isFinished } = useCountdown(targetDate)
  const [state, setState] = useState(CountdownState.Default)

  const isFinalCountdown = days === 0 && hours === 0 && minutes === 0 && seconds <= 9
  const daysDisplay = days
  const hoursDisplay = hours
  const minutesDisplay = minutes
  const secondsDisplay = seconds

  useEffect(() => {
    if (isFinished) onFinish?.()
  }, [isFinished])

  useEffect(() => {
    if (isFinalCountdown) {
      if (state === CountdownState.Default)
        setState(CountdownState.Ending)
      if (state === CountdownState.Ending && seconds === 0)
        setState(CountdownState.HasEnded)
      if (state === CountdownState.HasEnded && seconds === -1)
        setState(CountdownState.DisplayMessage)
    }
  }, [seconds, isFinalCountdown, state])

  return (
    <div className={`relative flex flex-wrap sm:flex-nowrap items-start rounded-2xl bg-accent p-4 ${{ [CountdownState.Default]: "gap-2", [CountdownState.Ending]: "gap-0.5", [CountdownState.HasEnded]: "gap-0", [CountdownState.DisplayMessage]: "gap-0" }[state]} transition-all duration-500 power4.out`}>
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0 rounded-2xl pointer-events-none z-10" />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
        <Segment digit={`${state === CountdownState.DisplayMessage ? message : ""}`} slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} slideDuration={denormalizedSlideDuration} state={state} position={SegmentPosition.Middle} displayMessage={true} />
      </div>
          <SegmentGroup value={daysDisplay} unit="dni" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} state={state} tensPosition={SegmentPosition.Left} isFinalCountdown={isFinalCountdown} secondsValue={seconds} />
          <Separator state={state} />
          <SegmentGroup value={hoursDisplay} unit="godziny" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} state={state} isFinalCountdown={isFinalCountdown} secondsValue={seconds} />
          <Separator state={state} />
          <SegmentGroup value={minutesDisplay} unit="minuty" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} state={state} isFinalCountdown={isFinalCountdown} secondsValue={seconds} />
          <Separator state={state} />
          <SegmentGroup value={secondsDisplay} unit="sekundy" slideIntensity={denormalizedSlideIntensity} flashIntensity={denormalizedFlashIntensity} showText={showText} slideDuration={denormalizedSlideDuration} state={state} onesPosition={SegmentPosition.Right} isFinalCountdown={isFinalCountdown} secondsValue={seconds} />
    </div>
  )
}
