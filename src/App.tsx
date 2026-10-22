import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import Services from './components/Services'
import PageTransition from './components/PageTransition'
import { About as AboutTeaser, Counters, Footer, Header, Hero, Partners, Preloader, Pricing, Projects, Testimonials, WhatsApp, Why } from './components/sections'
import About from './pages/About'
import { CareersPage, ClientAreaPage, ContactPage, PortfolioPage, ServicesPage } from './pages/Simple'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Home({ ready }: { ready: boolean }) {
  return (<><Hero ready={ready} /><AboutTeaser /><Services /><Counters /><Projects /><Why /><Partners /><Testimonials /><Pricing /></>)
}

/**
 * PageReporter — mounts inside each route and calls onMounted() once on mount.
 * This lets PageTransition know the new page is ready to be revealed.
 */
function PageReporter({ onMounted }: { onMounted: () => void }) {
  useEffect(() => {
    // One rAF so the route's DOM has painted before we signal readiness
    const id = requestAnimationFrame(onMounted)
    return () => cancelAnimationFrame(id)
  }, [onMounted])
  return null
}

function AppInner() {
  const [ready, setReady] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const done = useCallback(() => setReady(true), [])
  const preloaderExit = useCallback(() => setPreloaderDone(true), [])
  const signalReady = useCallback(() => setPageReady(true), [])

  const location = useLocation()

  // Reset pageReady on every navigation so PageTransition knows to wait
  useEffect(() => { setPageReady(false) }, [location.pathname])

  return (
    <>
      <ScrollTop />
      {!preloaderDone && <Preloader onDone={done} onExit={preloaderExit} />}

      {preloaderDone && (
        <PageTransition pageReady={pageReady}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<><PageReporter onMounted={signalReady} /><Home ready={ready} /></>} />
              <Route path="/about" element={<><PageReporter onMounted={signalReady} /><About /></>} />
              <Route path="/services" element={<><PageReporter onMounted={signalReady} /><ServicesPage /></>} />
              <Route path="/portfolio" element={<><PageReporter onMounted={signalReady} /><PortfolioPage /></>} />
              <Route path="/careers" element={<><PageReporter onMounted={signalReady} /><CareersPage /></>} />
              <Route path="/contact" element={<><PageReporter onMounted={signalReady} /><ContactPage /></>} />
              <Route path="/get-a-quote" element={<><PageReporter onMounted={signalReady} /><ContactPage quote /></>} />
              <Route path="/client-area" element={<><PageReporter onMounted={signalReady} /><ClientAreaPage /></>} />
              <Route path="*" element={<><PageReporter onMounted={signalReady} /><Home ready={ready} /></>} />
            </Routes>
          </main>
          <Footer />
          <WhatsApp />
        </PageTransition>
      )}

      {/* Show header/footer during initial preloader so layout doesn't jump */}
      {!preloaderDone && (
        <>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home ready={ready} />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/get-a-quote" element={<ContactPage quote />} />
              <Route path="/client-area" element={<ClientAreaPage />} />
              <Route path="*" element={<Home ready={ready} />} />
            </Routes>
          </main>
          <Footer />
          <WhatsApp />
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
