import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(threshold = 0.2, once = true) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect() }
      else if (!once) setInView(false)
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])
  return [ref, inView] as const
}

/** Calls fn on every animation frame while scrolling/resizing. */
export function useScrollFrame(fn: () => void) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    let raf = 0
    const tick = () => { raf = 0; fnRef.current() }
    const req = () => { if (!raf) raf = requestAnimationFrame(tick) }
    req()
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    return () => { window.removeEventListener('scroll', req); window.removeEventListener('resize', req); cancelAnimationFrame(raf) }
  }, [])
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
