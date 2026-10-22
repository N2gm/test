import { useState } from 'react'
import PageHero from '../components/PageHero'
import Services from '../components/Services'
import { Partners, Pricing, Projects, Testimonials } from '../components/sections'
import { Button, Eyebrow, Reveal } from '../components/ui'

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`

export function ServicesPage() {
  return (<><PageHero crumb="Services" title="Services" sub="Architecture, interiors, 2D/3D design and decoration, one continuous journey." img={img('photo-1503387837-b154d5074bd2')} /><Services /><Pricing /><Testimonials /></>)
}

export function PortfolioPage() {
  return (<><PageHero crumb="Portfolio" title="Portfolio" sub="Residential, commercial, administrative and luxurious finishing projects." img={img('photo-1670589953882-b94c9cb380f5')} /><Projects /><Partners /></>)
}

export function ContactPage({ quote = false }: { quote?: boolean }) {
  const [sent, setSent] = useState(false)
  const field = 'w-full border-b border-ink/15 bg-transparent py-4 outline-none transition-colors placeholder:text-mute focus:border-brand'
  return (
    <>
      <PageHero crumb={quote ? 'Get a Quote' : 'Contact'} title={quote ? 'Get a Quote' : 'Contact'} sub="Tell us about your space. We usually reply within one working day." img={img('photo-1663811397219-c572550dffc5')} />
      <section className="bg-white py-32">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Contact Us</Eyebrow>
            <ul className="mt-10 space-y-8 font-display text-2xl font-light">
              <li><div className="text-xs uppercase tracking-widest text-mute">Phone Number</div><a href="tel:01028993311" className="hover:text-brand">01028993311</a></li>
              <li><div className="text-xs uppercase tracking-widest text-mute">Email Address</div><a href="mailto:info@bonyan.com.eg" className="hover:text-brand">info@bonyan.com.eg</a></li>
              <li><div className="text-xs uppercase tracking-widest text-mute">Location</div>20 Ibn Hani El Andalusi, Al Manteqa Al Oula, Nasr City, Cairo</li>
            </ul>
          </div>
          <Reveal>
            {sent ? <p className="font-display text-3xl font-light text-brand">Thank you. We will be in touch shortly.</p> : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="space-y-6">
                <input required placeholder="Full name" className={field} />
                <input required type="tel" placeholder="Phone number" className={field} />
                <input type="email" placeholder="Email" className={field} />
                <select className={field} defaultValue=""><option value="" disabled>Project type</option><option>Residential</option><option>Commercial</option><option>Administrative</option><option>Luxurious Finishing</option></select>
                <textarea rows={4} placeholder="Tell us about your project" className={field} />
                <button className="rounded-full bg-brand px-8 py-4 text-sm font-medium text-white transition hover:bg-ink">Send request</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}

export function CareersPage() {
  return (<><PageHero crumb="Careers" title="Careers" sub="Join a studio built on disciplined thinking and refined design." img={img('photo-1603901622056-0a5bee231395')} />
    <section className="bg-white py-32 text-center"><Reveal><p className="mx-auto max-w-xl text-lg text-mute">Send your CV and portfolio to <a href="mailto:info@bonyan.com.eg" className="text-brand">info@bonyan.com.eg</a>.</p></Reveal><div className="mt-10"><Button href="/contact">Contact us</Button></div></section></>)
}

export function ClientAreaPage() {
  return (<><PageHero crumb="Client Area" title="Client Area" sub="Follow your project with real-time updates and full transparency." img={img('photo-1757924461488-ef9ad0670978')} />
    <section className="bg-white py-32"><form onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-md space-y-6 px-6"><input placeholder="Email" className="w-full border-b border-ink/15 py-4 outline-none focus:border-brand" /><input type="password" placeholder="Password" className="w-full border-b border-ink/15 py-4 outline-none focus:border-brand" /><button className="w-full rounded-full bg-brand py-4 text-sm text-white transition hover:bg-ink">Sign in</button></form></section></>)
}
