import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'
import { Link } from 'react-router'
import { useInView } from '../hooks'

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: ElementType }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15)
  return <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>
}

export function SplitText({ text, className = '', delay = 0, stagger = 60, play }: { text: string; className?: string; delay?: number; stagger?: number; play?: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.3)
  const want = play ?? inView
  const [on, setOn] = useState(false)
  // Wait two frames after mount so the transition runs even when play is true immediately.
  useEffect(() => {
    if (!want) { setOn(false); return }
    let r2 = 0
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setOn(true)) })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [want])
  return (
    <span ref={ref} className={`${on ? 'in' : ''} ${className}`}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="mask-word">
          <span style={{ transitionDelay: `${delay + i * stagger}ms` }}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <Reveal className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] ${light ? 'text-gold' : 'text-brand'}`}>
      <span className="h-px w-10 bg-current" />
      {children}
    </Reveal>
  )
}

export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`
  }
  const leave = () => { ref.current!.style.transform = '' }
  return <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={`inline-block transition-transform duration-300 ease-out ${className}`}>{children}</div>
}

/** Pill button with a fill that wipes in from the cursor side and a click ripple. */
export function Button({ children, href = '#', variant = 'solid', className = '' }: { children: ReactNode; href?: string; variant?: 'solid' | 'outline' | 'light'; className?: string }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const base = variant === 'solid' ? 'bg-brand text-white' : variant === 'light' ? 'bg-white text-ink' : 'border border-current text-current'
  const fill = variant === 'solid' ? 'bg-ink' : variant === 'light' ? 'bg-brand' : 'bg-brand'
  return (
    <Magnetic>
      <Link
        to={href}
        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const id = Date.now(); setRipples((p) => [...p, { x: e.clientX - r.left, y: e.clientY - r.top, id }]); setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 700) }}
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-medium tracking-wide ${base} ${className}`}
      >
        <span className={`absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100 ${fill}`} />
        {ripples.map((r) => (
          <span key={r.id} className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" style={{ left: r.x, top: r.y, animation: 'pulse-ring .7s ease-out forwards', transform: 'scale(8)' }} />
        ))}
        <span className="relative transition-colors duration-300 group-hover:text-white">{children}</span>
        <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-white/15 transition-colors group-hover:text-white">
          <Arrow className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-6" />
          <Arrow className="absolute h-3 w-3 -translate-x-6 transition-transform duration-500 group-hover:translate-x-0" />
        </span>
      </Link>
    </Magnetic>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 16 16" fill="none" className={className}><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

