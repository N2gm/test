import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { clamp, useInView, useScrollFrame } from '../hooks'
import { Arrow, Button, Eyebrow, Reveal, SplitText } from './ui'

const img = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
export const nav = [
  { n: 'Home', to: '/' },
  { n: 'About Us', to: '/about' },
  { n: 'Services', to: '/services' },
  { n: 'Portfolio', to: '/portfolio' },
  { n: 'Careers', to: '/careers' },
  { n: 'Contact', to: '/contact' },
  { n: 'Client Area', to: '/client-area' },
]

export function Preloader({ onDone, onExit }: { onDone: () => void; onExit: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [logoOut, setLogoOut] = useState(false)
  const [curtainOut, setCurtainOut] = useState(false)

  // Wait for real page load (fonts, images, etc.)
  useEffect(() => {
    const check = () => {
      if (document.readyState === 'complete') {
        setTimeout(() => setLoaded(true), 400)
      }
    }
    if (document.readyState === 'complete') {
      setTimeout(() => setLoaded(true), 400)
    } else {
      window.addEventListener('load', check)
      return () => window.removeEventListener('load', check)
    }
  }, [])

  // Once gold reveal finishes → fade logo out → split curtains → done
  useEffect(() => {
    if (!revealed) return
    const t1 = setTimeout(() => setLogoOut(true), 500)
    const t2 = setTimeout(() => { onDone(); setCurtainOut(true) }, 1300)
    const t3 = setTimeout(() => {
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
      onExit()
    }, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [revealed, onDone, onExit])

  // Lock body scroll + pointer events during preloader
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.pointerEvents = 'none'
    return () => {
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[90]" style={{ pointerEvents: 'all' }}>
      {/* Left curtain */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-black transition-transform duration-[1000ms] ease-[cubic-bezier(.7,0,.2,1)]"
        style={{ transform: curtainOut ? 'translateX(-100%)' : 'translateX(0)' }}
      />
      {/* Right curtain */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-black transition-transform duration-[1000ms] ease-[cubic-bezier(.7,0,.2,1)]"
        style={{ transform: curtainOut ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {/* Logo container — centered, fades/scales out before curtains split */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(.4,0,.2,1)]"
        style={{
          opacity: logoOut ? 0 : 1,
          transform: logoOut ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <div className="relative w-[min(80vw,520px)]">
          {/* White logo — always visible */}
          <img
            src="/logo-white.png"
            alt="Bonyan Design Studio"
            className="block w-full h-auto"
            draggable={false}
          />
          {/* Gold logo — revealed from bottom to top */}
          <img
            src="/logo-gold.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            onTransitionEnd={() => setRevealed(true)}
            className="absolute inset-0 w-full h-full object-contain transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(.25,.1,.25,1)]"
            style={{
              clipPath: loaded ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useScrollFrame(() => setScrolled(scrollY > 60))
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${scrolled ? 'mx-4 bg-ink/70 shadow-2xl backdrop-blur-xl md:mx-auto' : ''}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-gold-t.png" alt="BONYAN" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden items-center gap-7 xl:flex">
            {nav.map(({ n, to }) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `group relative overflow-hidden text-sm ${isActive ? 'text-gold' : 'text-white/80'}`}>
                <span className="block transition-transform duration-500 group-hover:-translate-y-full">{n}</span>
                <span className="absolute inset-0 translate-y-full text-gold transition-transform duration-500 group-hover:translate-y-0">{n}</span>
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:block"><Button href="/get-a-quote">Get a Quote</Button></div>
            <button aria-label="Menu" onClick={() => setOpen(true)} className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition hover:border-gold xl:hidden">
              <span className="space-y-1.5"><span className="block h-px w-5 bg-current" /><span className="block h-px w-3 bg-current" /></span>
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-[60] bg-ink text-white transition-[clip-path] duration-700 ease-[cubic-bezier(.8,0,.2,1)] ${open ? '[clip-path:circle(150%_at_100%_0)]' : '[clip-path:circle(0%_at_100%_0)]'}`}>
        <button onClick={() => setOpen(false)} className="absolute right-6 top-6 h-12 w-12 rounded-full border border-white/20 text-2xl">&times;</button>
        <div className="flex h-full flex-col justify-center gap-4 px-10">
          {nav.map(({ n, to }, i) => (
            <Link key={to} to={to} className="font-display text-5xl font-light transition-all duration-700 hover:pl-4 hover:text-gold" style={{ transitionDelay: open ? `${200 + i * 60}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(30px)' }}>{n}</Link>
          ))}
        </div>
      </div>
    </>
  )
}

const slides = [
  { title: 'Fine Finishing', sub: 'Luxury finishing, executed with discipline.', img: img('photo-1757924461488-ef9ad0670978', 2000) },
  { title: 'Timeless Interiors', sub: 'Spaces that inspire and stand the test of time.', img: img('photo-1663811397219-c572550dffc5', 2000) },
  { title: 'Architecture With Intent', sub: 'From concept to completion, under one roof.', img: img('photo-1580587771525-78b9dba3b914', 2000) },
]

export function Hero({ ready }: { ready: boolean }) {
  const [i, setI] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6500); return () => clearInterval(t) }, [])
  useScrollFrame(() => {
    const el = wrap.current; if (!el) return
    const p = clamp(scrollY / innerHeight)
    el.style.transform = `translateY(${p * 30}%) scale(${1 + p * 0.1})`
    el.style.opacity = String(1 - p * 0.6)
  })
  return (
    <section id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-white">
      <div ref={wrap} className="absolute inset-0">
        {slides.map((s, k) => (
          <div key={k} className={`absolute inset-0 transition-[clip-path,opacity] duration-[1400ms] ease-[cubic-bezier(.8,0,.2,1)] ${k === i ? 'z-10 [clip-path:inset(0_0_0_0)]' : 'z-0 [clip-path:inset(0_0_0_100%)]'}`}>
            <img src={s.img} alt={s.title} className="h-full w-full object-cover" style={k === i ? { animation: 'kenburns 7s ease-out forwards' } : undefined} />
          </div>
        ))}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/10" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>

      <div className="relative z-30 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:pb-32">
        <p className={`mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold transition-all delay-300 duration-1000 ${ready ? 'opacity-100' : 'translate-y-4 opacity-0'}`}><span className="h-px w-10 bg-gold" />Since 2012 &middot; Cairo</p>
        <h1 key={i} className="max-w-5xl text-6xl font-extralight leading-[0.95] tracking-tight md:text-[8.5rem]">
          <SplitText text={slides[i].title} play={ready} stagger={90} delay={ready ? 150 : 0} />
        </h1>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p key={`s${i}`} className={`max-w-md text-lg text-white/70 transition-all duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>{slides[i].sub}</p>
          <div className="flex items-center gap-4">
            <Button href="/portfolio" variant="light">Our Portfolio</Button>
            <a href="#about" className="group grid h-14 w-14 place-items-center rounded-full border border-white/30 transition hover:border-gold" aria-label="Scroll down">
              <span className="h-2 w-2 rounded-full bg-gold" style={{ animation: 'scroll-dot 1.6s ease-in-out infinite' }} />
            </a>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-6">
          {slides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className="group flex items-center gap-3 text-xs text-white/60">
              <span className={k === i ? 'text-white' : ''}>0{k + 1}</span>
              <span className="relative h-px w-16 overflow-hidden bg-white/20">
                <span className={`absolute inset-0 origin-left bg-gold ${k === i ? 'scale-x-100 transition-transform duration-[6500ms] ease-linear' : 'scale-x-0'}`} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function About() {
  const statement = 'Exceptional spaces are created through disciplined thinking, refined design and meticulous execution.'
  const ref = useRef<HTMLParagraphElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  useScrollFrame(() => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.4))
    const words = el.children
    for (let k = 0; k < words.length; k++) (words[k] as HTMLElement).style.opacity = String(0.12 + clamp(p * words.length - k) * 0.88)
    const ir = imgRef.current!.getBoundingClientRect()
    const ip = clamp(1 - ir.top / innerHeight)
    imgRef.current!.style.clipPath = `inset(${(1 - ip) * 20}% ${(1 - ip) * 12}% round 2rem)`
  })
  return (
    <section id="about" className="relative bg-white py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>About Us</Eyebrow>
        <p ref={ref} className="mt-10 max-w-6xl font-display text-4xl font-light leading-[1.15] tracking-tight md:text-6xl">
          {statement.split(' ').map((w, k) => <span key={k} className="transition-opacity duration-200">{w} </span>)}
        </p>
        <div className="mt-24 grid gap-16 md:grid-cols-12">
          <div ref={imgRef} className="relative h-[28rem] overflow-hidden md:col-span-7 md:h-[36rem]">
            <img src={img('photo-1541194577687-8c63bf9e7ee3')} alt="Bonyan interior" className="h-full w-full object-cover" />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-6 py-4 backdrop-blur">
              <div className="font-display text-4xl text-brand">13+</div>
              <div className="text-xs uppercase tracking-widest text-mute">Years of experience</div>
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-5">
            <Reveal><h2 className="text-4xl font-light leading-tight tracking-tight">Bonyan Delivers Spaces That <span className="italic text-brand">Define Excellence</span></h2></Reveal>
            <Reveal delay={100}><p className="mt-6 leading-relaxed text-mute">With more than 13 years of experience, Bonyan transforms your vision into environments that inspire, function beautifully and stand the test of time.</p></Reveal>
            <Reveal delay={200}><p className="mt-4 leading-relaxed text-mute">By bringing architecture, interior design and 3D visualisation under one roof, we deliver a seamless design journey from concept to completion, across residential, commercial and administrative spaces.</p></Reveal>
            <Reveal delay={300} className="mt-10"><Button href="/about" variant="outline" className="text-ink">Read our story</Button></Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Counter({ to, label, suffix = '+' }: { to: number; label: string; suffix?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.5)
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0; const start = performance.now()
    const tick = (t: number) => { const p = clamp((t - start) / 2000); setV(Math.round(to * (1 - Math.pow(1 - p, 4)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <div ref={ref} className="group border-t border-white/15 pt-8 transition-colors hover:border-gold">
      <div className="font-display text-7xl font-extralight tracking-tight md:text-8xl">{v}<span className="text-gold">{suffix}</span></div>
      <div className="mt-3 text-sm uppercase tracking-[0.25em] text-white/50 transition-colors group-hover:text-white">{label}</div>
    </div>
  )
}

export function Counters() {
  // values match the live site: 15 locations, 126 projects, 13 years, 72 clients
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-white">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-gold/20" style={{ animation: 'spin-slow 40s linear infinite' }}><span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-gold" /></div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <Counter to={126} label="Successful projects" />
        <Counter to={13} label="Years of experience" />
        <Counter to={72} label="Happy clients" />
        <Counter to={15} label="Locations" />
      </div>
    </section>
  )
}

const projects = [
  { t: 'Family Apartment', c: 'Residential', y: '2024', img: img('photo-1700226034367-2fb120f48dfa', 1200) },
  { t: 'Custom Furniture', c: 'Decoration', y: '2024', img: img('photo-1663811397207-418a92396ad5', 1200) },
  { t: 'Modern Villa', c: 'Architecture', y: '2023', img: img('photo-1721815693498-cc28507c0ba2', 1200) },
  { t: 'Eco-friendly Residence', c: 'Residential', y: '2023', img: img('photo-1774551351897-c64cd76a7c22', 1200) },
  { t: 'Poolside Retreat', c: 'Luxurious Finishing', y: '2022', img: img('photo-1670589953882-b94c9cb380f5', 1200) },
]

export function Projects() {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  useScrollFrame(() => {
    const o = outer.current, t = track.current; if (!o || !t) return
    const r = o.getBoundingClientRect()
    const p = clamp(-r.top / (r.height - innerHeight))
    t.style.transform = `translateX(${-p * (t.scrollWidth - innerWidth)}px)`
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
  })
  return (
    <section id="portfolio" ref={outer} className="relative bg-white" style={{ height: `${projects.length * 70}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-12 flex w-full max-w-7xl items-end justify-between px-6">
          <div>
            <Eyebrow>Recent Projects</Eyebrow>
            <h2 className="mt-5 text-5xl font-light tracking-tight md:text-7xl"><SplitText text="Featured Work" /></h2>
          </div>
          <div className="hidden w-64 md:block"><div className="h-px bg-ink/10"><div ref={bar} className="h-px origin-left bg-brand" /></div></div>
        </div>
        <div ref={track} className="flex gap-8 px-6 will-change-transform md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {projects.map((p, k) => (
            <Link key={k} to="/portfolio" className="group relative h-[60vh] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] md:w-[38vw]">
              <img src={p.img} alt={p.t} className="h-full w-full scale-105 object-cover grayscale-[30%] transition-all duration-[1.2s] ease-out group-hover:scale-100 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-white/15 px-4 py-1.5 text-xs text-white backdrop-blur">{p.c}</div>
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
                <div>
                  <div className="text-xs text-white/60">{String(k + 1).padStart(2, '0')} / {p.y}</div>
                  <h3 className="mt-2 text-3xl font-light">{p.t}</h3>
                </div>
                <span className="grid h-14 w-14 translate-y-4 place-items-center rounded-full bg-gold text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><Arrow className="h-5 w-5 -rotate-45" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const why = [
  { t: 'Premium Design & Execution', d: 'Premium design, flawless execution and bespoke furnishing solutions, crafted to deliver luxury, functionality and exceptional quality.' },
  { t: 'Transparent Project Monitoring', d: 'Track every stage of your project with real-time updates, live site monitoring and complete financial transparency.' },
  { t: 'Post-Handover Support & Maintenance', d: 'Ongoing support and reliable maintenance keep your space flawless long after project completion.' },
]

export function Why() {
  const [open, setOpen] = useState(0)
  return (
    <section className="bg-ink py-32 text-white">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <Eyebrow light>Why Choose Us</Eyebrow>
          <h2 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl"><SplitText text="Perfection, with complete" /> <SplitText text="peace of mind." className="italic text-gold" delay={300} /></h2>
          <Reveal delay={200} className="relative mt-12 h-80 overflow-hidden rounded-[2rem]">
            <img src={img('photo-1603901622056-0a5bee231395')} alt="Blueprints" className="h-full w-full object-cover opacity-80" />
          </Reveal>
        </div>
        <div className="flex flex-col justify-center">
          {why.map((w, k) => (
            <button key={k} onMouseEnter={() => setOpen(k)} onClick={() => setOpen(k)} className="group border-b border-white/10 py-8 text-left">
              <div className="flex items-center gap-6">
                <span className={`font-display text-sm transition-colors ${open === k ? 'text-gold' : 'text-white/30'}`}>0{k + 1}</span>
                <h3 className={`flex-1 text-2xl font-light transition-all duration-500 md:text-3xl ${open === k ? 'translate-x-2 text-white' : 'text-white/50'}`}>{w.t}</h3>
                <span className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-500 ${open === k ? 'rotate-45 border-gold bg-gold text-ink' : 'border-white/20'}`}>+</span>
              </div>
              <div className={`grid transition-all duration-500 ${open === k ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="overflow-hidden pl-12 pt-4 leading-relaxed text-white/60">{w.d}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// Replace with real partner logos once supplied.
const partners = ['Residential', 'Commercial', 'Administrative', 'Luxurious Finishing', '3D Visualisation', 'Turnkey Delivery']
export function Partners() {
  return (
    <section className="overflow-hidden border-b border-ink/5 bg-white py-20">
      <div className="mb-10 flex justify-center"><Eyebrow>Trusted by homeowners &amp; businesses</Eyebrow></div>
      <div className="flex w-max marquee">
        {[...partners, ...partners].map((p, k) => (
          <span key={k} className="mx-10 flex items-center gap-10 font-display text-4xl font-light text-ink/20 transition-colors duration-300 hover:text-brand md:text-6xl">{p}<span className="h-2 w-2 rounded-full bg-gold" /></span>
        ))}
      </div>
    </section>
  )
}

const quotes = [
  { q: 'Bonyan turned an empty shell into the home we had imagined for years. The daily site updates meant we never had to worry.', n: 'Ahmed & Nour', r: 'Family apartment, New Cairo' },
  { q: 'Precise, transparent and calm under pressure. Our headquarters was delivered on time and beyond our expectations.', n: 'Operations Director', r: 'Administrative project, Nasr City' },
  { q: 'The 3D renders were so accurate that walking into the finished villa felt like déjà vu. Exceptional craftsmanship.', n: 'Villa owner', r: 'Residential project, Sheikh Zayed' },
]
export function Testimonials() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % quotes.length), 7000); return () => clearInterval(t) }, [])
  return (
    <section className="relative bg-sand py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="flex justify-center"><Eyebrow>Testimonials</Eyebrow></div>
        <div className="relative mt-12 min-h-[16rem]">
          {quotes.map((q, k) => (
            <figure key={k} className={`absolute inset-0 transition-all duration-1000 ${k === i ? 'opacity-100 blur-0' : 'pointer-events-none translate-y-6 opacity-0 blur-sm'}`}>
              <span className="font-display text-8xl leading-none text-gold">&ldquo;</span>
              <blockquote className="-mt-6 font-display text-3xl font-light leading-snug tracking-tight md:text-4xl">{q.q}</blockquote>
              <figcaption className="mt-8 text-sm"><span className="font-medium">{q.n}</span> <span className="text-mute">&middot; {q.r}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-3">
          {quotes.map((_, k) => <button key={k} aria-label={`Testimonial ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-brand' : 'w-2 bg-brand/30 hover:bg-brand/60'}`} />)}
        </div>
      </div>
    </section>
  )
}

const plans = [
  { t: 'Discovery', s: 'Free consultation call', f: ['Private strategy consultation', 'Finishing process roadmap', 'Budget & material guidance', 'Expert recommendations', 'Initial project assessment'] },
  { t: 'Blueprint', s: 'Layouts & price planning', f: ['Professional site measurement', 'Detailed 2D floor plans', 'Space optimisation layout', 'Initial cost estimation', 'Planning & execution guide'] },
  { t: 'Fine Finish', s: 'Full finishing & execution', f: ['Complete finishing execution', 'Daily engineer supervision', 'Premium materials & craftsmanship', 'Quality control & inspection', 'Turnkey project delivery'], hot: true },
  { t: 'Signature Living', s: 'Furniture & styling', f: ['Furniture & decor selection', 'Lighting design consultation', 'Premium accessories styling', 'Procurement & delivery', 'Full setup & final styling'] },
]
function PlanCard({ p, k }: { p: (typeof plans)[number]; k: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.MouseEvent) => {
    const el = ref.current!, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`); el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  return (
    <Reveal delay={k * 120}>
      <div ref={ref} onMouseMove={move} onMouseLeave={() => { ref.current!.style.transform = '' }} className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 transition-transform duration-300 ease-out ${p.hot ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/10'}`}>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--mx) var(--my), rgba(201,166,120,.25), transparent 60%)' }} />
        {p.hot && <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ink">Most chosen</span>}
        <span className={`font-display text-sm ${p.hot ? 'text-gold' : 'text-brand'}`}>0{k + 1}</span>
        <h3 className="mt-4 text-3xl font-light">{p.t} <span className={p.hot ? 'text-white/40' : 'text-mute'}>Plan</span></h3>
        <p className={`mt-2 text-sm ${p.hot ? 'text-white/60' : 'text-mute'}`}>{p.s}</p>
        <ul className="mt-8 flex-1 space-y-3 text-sm">
          {p.f.map((f) => <li key={f} className="flex gap-3"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.hot ? 'bg-gold' : 'bg-brand'}`} />{f}</li>)}
        </ul>
        <div className="mt-10"><Button href="/get-a-quote" variant={p.hot ? 'light' : 'solid'}>Get Started</Button></div>
      </div>
    </Reveal>
  )
}
export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>Choose Your Plan</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight md:text-6xl"><SplitText text="Your space, handled perfectly from start to finish." /></h2>
          </div>
          <Reveal><p className="max-w-sm text-mute">Select the phase of service that aligns with your property goals.</p></Reveal>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{plans.map((p, k) => <PlanCard key={p.t} p={p} k={k} />)}</div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-32 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow light>Let's build together</Eyebrow>
        <h2 className="mt-8 text-6xl font-extralight leading-[0.95] tracking-tight md:text-9xl"><SplitText text="Have a space" /><br /><SplitText text="in mind?" className="italic text-gold" delay={250} /></h2>
        <div className="mt-12"><Button href="/get-a-quote">Get a Quote</Button></div>
        <div className="mt-24 grid gap-12 border-t border-white/10 pt-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <img src="/logo-white-t.png" alt="BONYAN" className="h-10 w-auto object-contain" />
            </Link>
            <p className="mt-4 max-w-sm text-white/50">Architecture, interior design and luxury finishing studio. Cairo, since 2012.</p>
          </div>
          <div>
            <h6 className="text-xs uppercase tracking-[0.3em] text-gold">Studio</h6>
            <ul className="mt-6 space-y-3 text-white/70">
              {nav.slice(1).map(({ n, to }) => <li key={to}><Link to={to} className="transition hover:pl-2 hover:text-gold">{n}</Link></li>)}
            </ul>
          </div>
          <div>
            <h6 className="text-xs uppercase tracking-[0.3em] text-gold">Contact</h6>
            <ul className="mt-6 space-y-3 text-white/70">
              <li><a href="tel:01028993311" className="hover:text-gold">01028993311</a></li>
              <li><a href="mailto:info@bonyan.com.eg" className="hover:text-gold">info@bonyan.com.eg</a></li>
              <li>20 Ibn Hani El Andalusi, Al Manteqa Al Oula, Nasr City, Cairo</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-white/10 py-8 text-sm text-white/40 md:flex-row">
          <span>&copy; {new Date().getFullYear()} Bonyan Design Studio. All rights reserved.</span>
          <button onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gold">Back to top &uarr;</button>
        </div>
      </div>
      <div className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[22vw] font-extralight leading-[0.75] tracking-tight text-white/[0.04]">BONYAN</div>
    </footer>
  )
}

export function WhatsApp() {
  return (
    <a href="https://api.whatsapp.com/send?phone=201028993311" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="group fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-2xl transition hover:scale-110">
      <span className="absolute inset-0 rounded-full bg-brand" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
      <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" /></svg>
    </a>
  )
}
