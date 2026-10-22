import { useEffect, useRef, useState } from 'react'
import { clamp, useInView, useScrollFrame } from '../hooks'
import PageHero from '../components/PageHero'
import { Button, Eyebrow, Reveal, SplitText } from '../components/ui'
import { Counters, Why } from '../components/sections'

const img = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const principles = [
  { t: 'Creativity', d: 'We approach each project with a fresh perspective, pushing the boundaries of design to bring unique and original solutions to life.' },
  { t: 'Quality', d: 'We are committed to delivering interior design solutions that meet our clients’ needs and create environments that inspire, endure, and elevate everyday experiences.' },
  { t: 'Team Work', d: 'We believe in the power of working together, engaging closely with our clients, partners, and experts to create exceptional designs that reflect a collective vision.' },
  { t: 'Dedication', d: 'We are driven by passion and precision, going beyond expectations so that every detail is executed flawlessly. Your vision is our commitment.' },
  { t: 'Integrity', d: 'We place trust at the core of everything we do, maintaining transparency and honesty, to make sure we deliver every promise with dedication and authenticity.' },
  { t: 'Innovation', d: 'We embrace innovative thinking in every stage of the design process, combining creativity, technology, and practical insight to deliver spaces that feel current, functional, and forward-looking.' },
]

function YearsBadge() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5)
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0; const s = performance.now()
    const tick = (t: number) => { const p = clamp((t - s) / 1800); setV(Math.round(13 * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [inView])
  return (
    <div ref={ref} className="absolute -bottom-10 -right-4 grid h-44 w-44 place-items-center rounded-full bg-brand text-white shadow-2xl md:-right-10">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ animation: 'spin-slow 18s linear infinite' }}>
        <defs><path id="c" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" /></defs>
        <text fontSize="7.5" letterSpacing="3" fill="currentColor" opacity=".7"><textPath href="#c">YEARS EXPERIENCE · YEARS EXPERIENCE ·</textPath></text>
      </svg>
      <div className="font-display text-5xl font-extralight">{v}<span className="text-gold">+</span></div>
    </div>
  )
}

function Story() {
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLImageElement>(null)
  useScrollFrame(() => {
    const el = frame.current; if (!el) return
    const r = el.getBoundingClientRect()
    const p = clamp(1 - r.top / innerHeight)
    el.style.clipPath = `inset(${(1 - p) * 18}% ${(1 - p) * 18}% ${(1 - p) * 18}% 0 round 2rem)`
    inner.current!.style.transform = `scale(${1.3 - p * 0.3}) translateY(${(0.5 - p) * 40}px)`
  })
  return (
    <section className="relative bg-white py-32 md:py-44">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 md:grid-cols-2">
        <div className="relative">
          <div ref={frame} className="h-[34rem] overflow-hidden rounded-[2rem]">
            <img ref={inner} src={img('photo-1648881806148-e5c51179c826')} alt="Bonyan interior" className="h-full w-full object-cover" />
          </div>
          <YearsBadge />
        </div>
        <div>
          <Eyebrow>Our Story</Eyebrow>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl"><SplitText text="Built on a Vision." /> <SplitText text="Driven by Craft" className="italic text-brand" delay={300} /></h2>
          <Reveal delay={100}><p className="mt-8 text-lg leading-relaxed text-ink/80">Bonyan Design Studio was founded on a simple belief: exceptional spaces are created through disciplined thinking, refined design, and meticulous attention to detail.</p></Reveal>
          <Reveal delay={200}><p className="mt-5 leading-relaxed text-mute">By bringing architecture, interior design, and 3D visualization under one roof, we deliver a seamless design journey from concept to completion.</p></Reveal>
          <Reveal delay={300}><p className="mt-5 leading-relaxed text-mute">Today, Bonyan is one of Egypt’s trusted design studios, creating residential, commercial, and administrative spaces that are thoughtfully crafted, timeless, and uniquely tailored to each client.</p></Reveal>
        </div>
      </div>
    </section>
  )
}

/** Mission & Vision: two full-bleed panels that stack over each other while scrolling. */
function MissionVision() {
  const items = [
    { t: 'Our Mission', d: 'To deliver intelligent, beautifully crafted spaces that serve the people who inhabit them, on time, within budget, and beyond expectation.', img: img('photo-1757924461488-ef9ad0670978', 2000) },
    { t: 'Our Vision', d: 'To be the premier destination for design excellence in Egypt and the wider region, recognized not just for what we build, but for the experience we create along the way.', img: img('photo-1613490493576-7fde63acd811', 2000) },
  ]
  return (
    <section className="relative bg-ink">
      {items.map((it, k) => (
        <div key={k} className="sticky top-0 h-screen overflow-hidden">
          <img src={it.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 text-white">
            <span className="font-display text-sm tracking-[0.3em] text-gold">{k + 1} / 2</span>
            <h3 className="mt-6 text-6xl font-extralight tracking-tight md:text-8xl"><SplitText text={it.t} /></h3>
            <Reveal delay={200}><p className="mt-8 max-w-2xl font-display text-2xl font-light leading-snug text-white/80 md:text-3xl">{it.d}</p></Reveal>
          </div>
        </div>
      ))}
    </section>
  )
}
function PrincipleCard({ p, k, onVisible }: { p: { t: string; d: string }; k: number; onVisible: () => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  useEffect(() => { if (inView) onVisible() }, [inView, onVisible])
  return (
    <div ref={ref} className="relative overflow-hidden border-b border-ink/10 py-10">
      <span
        className="absolute inset-0 origin-left bg-white transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)]"
        style={{ transform: inView ? 'scaleX(1)' : 'scaleX(0)' }}
      />
      <div
        className="relative flex gap-8 px-2 transition-transform duration-500"
        style={{ transform: inView ? 'translateX(16px)' : 'translateX(0)' }}
      >
        <span className="font-display text-sm text-brand">{k + 1}</span>
        <div>
          <h6 className={`text-3xl font-light tracking-tight transition-colors duration-500 ${inView ? 'text-brand' : ''}`}>{p.t}</h6>
          <p className="mt-4 max-w-xl leading-relaxed text-mute">{p.d}</p>
        </div>
      </div>
    </div>
  )
}

function Principles() {
  const [active, setActive] = useState(0)
  return (
    <section className="bg-sand py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>What We Stand For</Eyebrow>
            <h2 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl"><SplitText text="The Principles Behind" /> <SplitText text="Every Project" className="italic text-brand" delay={300} /></h2>
            <div className="mt-12 hidden font-display text-[10rem] font-extralight leading-none text-brand/15 lg:block">
              <span key={active} className="inline-block" style={{ animation: 'kenburns .6s ease-out' }}>{active + 1}</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          {principles.map((p, k) => (
            <PrincipleCard key={p.t} p={p} k={k} onVisible={() => setActive(k)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-white py-32 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[140px]" />
      <div className="relative mx-auto max-w-4xl px-6">
        <h2 className="text-5xl font-light tracking-tight md:text-7xl"><SplitText text="Let’s shape your space" /> <SplitText text="together" className="italic text-brand" delay={300} /></h2>
        <Reveal delay={200}><p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-mute">From the first conceptual sketch to the final structural handover, Bonyan Design Studio brings your luxury residential or commercial vision to life with absolute precision.</p></Reveal>
        <Reveal delay={300} className="mt-10"><Button href="/get-a-quote">Get A Quote</Button></Reveal>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <PageHero crumb="About Us" title="About Us" sub="Creating exceptional spaces through integrated design, execution, and finishing services" img={img('photo-1541194577687-8c63bf9e7ee3', 2000)} />
      <Story />
      <MissionVision />
      <Principles />
      <Counters />
      <Why />
      <CTA />
    </>
  )
}
