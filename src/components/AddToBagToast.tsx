'use client'

import { useCart } from '@/contexts/CartContext'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const motion =
  'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none will-change-transform'
const DURATION_MS = 300

export default function AddToBagToast() {
  const { lastAddedName, itemCount, dismissAddFeedback, ready } = useCart()
  const [stale, setStale] = useState<{ name: string; count: number } | null>(null)
  const [open, setOpen] = useState(false)
  const lastAddedRef = useRef<string | null>(null)
  lastAddedRef.current = lastAddedName

  // Sync copy; keep line count in sync with cart
  useLayoutEffect(() => {
    if (!ready || lastAddedName == null) return
    setStale((s) =>
      s == null
        ? { name: lastAddedName, count: itemCount }
        : { name: lastAddedName, count: itemCount },
    )
  }, [ready, lastAddedName, itemCount])

  // Enter: slide in from the right (same feel as the cart panel)
  useEffect(() => {
    if (!ready || lastAddedName == null) return
    setOpen(false)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true))
    })
    return () => cancelAnimationFrame(id)
  }, [ready, lastAddedName])

  // Context cleared: slide out, then unmount
  useEffect(() => {
    if (!ready || lastAddedName != null) return
    if (stale == null) return
    setOpen(false)
  }, [ready, lastAddedName, stale])

  const finishExit = useCallback(() => {
    if (lastAddedRef.current != null) return
    setStale(null)
  }, [])

  const onTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return
      finishExit()
    },
    [finishExit],
  )

  // Backup if transitionend is skipped (e.g. reduced motion / edge cases)
  useEffect(() => {
    if (!ready || lastAddedName != null) return
    if (stale == null) return
    if (open) return
    const t = setTimeout(finishExit, DURATION_MS + 40)
    return () => clearTimeout(t)
  }, [ready, lastAddedName, stale, open, finishExit])

  if (!ready) return null
  if (!stale && !lastAddedName) return null

  const n = lastAddedName != null ? itemCount : (stale?.count ?? 0)
  const line =
    n === 1
      ? 'Added to bag! You now have 1 item in your bag.'
      : `Added to bag! You now have ${n} items in your bag.`

  return (
    <div
      role="status"
      aria-live="polite"
      onTransitionEnd={onTransitionEnd}
      className={`${motion} pointer-events-auto fixed right-4 top-20 z-[60] flex min-w-[min(100vw-2rem,320px)] max-w-[min(100vw-2rem,400px)] items-start gap-3 rounded-lg border border-[#E8ECE9] bg-white p-4 shadow-lg ${
        open
          ? 'translate-x-0 opacity-100'
          : 'pointer-events-none translate-x-6 opacity-0 sm:translate-x-8'
      }`}
    >
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F0EB]"
        aria-hidden
      >
        <svg
          className="h-5 w-5 text-[#3d5a45]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="min-w-0 flex-1 pr-1 pt-0.5">
        <p className="font-['Host_Grotesk'] text-base font-bold leading-tight text-green-900">
          Added to Bag
        </p>
        <p className="mt-0.5 font-['Martel_Sans'] text-sm font-normal leading-snug text-green-800">
          {line}
        </p>
      </div>
      <button
        type="button"
        onClick={dismissAddFeedback}
        aria-label="Dismiss notification"
        className="-m-1 -mt-0.5 shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-50"
        disabled={!open}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
