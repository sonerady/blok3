import { useRef, useState, useEffect } from 'react'
import './App.css'
import LandingSection from './components/LandingSection'
import PlatformShowcase from './components/PlatformShowcase'
import CTASection from './components/CTASection'
import TurneSection from './components/TurneSection'
// import AlbumSection from './components/AlbumSection'
import ContactSection from './components/ContactSection'
import EventsModal from './components/EventsSection'
import ContactModal from './components/ContactModal'
import StepNav from './components/StepNav'
import gitMusic from './assets/musics/git.mp3'

function App() {
  const containerRef = useRef(null)
  const audioRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // const [isDarkAlbum, setIsDarkAlbum] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [hideStepNav, setHideStepNav] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => { setIsPlaying(true); setHasStarted(true) }
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const viewportHeight = container.clientHeight

      // LandingSection (100vh — trend removed)
      const landingEnd = viewportHeight
      // CTASection (100vh) after landing
      const ctaEnd = landingEnd + viewportHeight
      // TurneSection (200vh) after CTA
      const turneEnd = ctaEnd + viewportHeight * 2
      // PlatformShowcase (100vh) after Turne
      const showcaseEnd = turneEnd + viewportHeight

      if (scrollTop < landingEnd) {
        setActiveStep(0) // BİYOGRAFİ
        setHideStepNav(false)
      } else if (scrollTop < ctaEnd) {
        setActiveStep(1) // 2025 KONSER PERFORMANSLARI
        setHideStepNav(false)
      } else if (scrollTop < turneEnd) {
        setActiveStep(2) // 2026 TURNE PLANLAMASI
        setHideStepNav(false)
      } else if (scrollTop < showcaseEnd) {
        setActiveStep(3) // PLATFORMLAR
        setHideStepNav(false)
      } else {
        setActiveStep(3)
        setHideStepNav(true)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const isLight = false

  return (
    <div className="app" ref={containerRef}>
      <audio ref={audioRef} src={gitMusic} loop />

      {hasStarted && activeStep === 0 && (
        <button
          className={`music-btn${isPlaying ? ' playing' : ''}`}
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Müziği durdur' : 'Müziği çal'}
        >
          <div className="music-eq">
            <span className="music-eq-bar" />
            <span className="music-eq-bar" />
            <span className="music-eq-bar" />
            <span className="music-eq-bar" />
          </div>
        </button>
      )}

      <nav className={`global-nav${isLight ? ' light' : ''}`}>
        <div className="global-nav-left">
          <span className="hero-nav-logo">
            <span>3</span>
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)', marginLeft: '0.08em' }}>3</span>
          </span>
        </div>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen((v) => !v)} aria-label="Menü">
          <span /><span /><span />
        </button>
        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
        <div className={`global-nav-right${menuOpen ? ' open' : ''}`}>
          <div className="menu-sections">
            <div className="menu-section">
              <span className="menu-section-title">Müzik Platformlarımız</span>
              <a className="menu-link" href="https://open.spotify.com/artist/1GMwSpFzrLd12jUX15bHB6" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Spotify</a>
              <a className="menu-link" href="https://music.apple.com/artist/blok3/1633245914" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Apple Music</a>
              <a className="menu-link" href="https://www.deezer.com/artist/117259882" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Deezer</a>
            </div>

            {/* <div className="menu-section">
              <span className="menu-section-title">Biletlerimiz</span>
              <a className="menu-link" href="https://www.bubilet.com.tr/sanatci/blok3-" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Bubilet</a>
              <a className="menu-link" href="https://biletinial.com/tr-tr/muzik/blok3-konseri-biletleri" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Biletinial</a>
            </div> */}

            <div className="menu-section">
              <span className="menu-section-title">Yaklaşan Etkinlikler</span>
              <a className="menu-link" href="#" onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                setEventsOpen(true)
              }}>Konser Takvimi</a>
            </div>

            <div className="menu-section">
              <span className="menu-section-title">Basında Biz</span>
              <a className="menu-link" href="#press" onClick={() => setMenuOpen(false)}>Basında Biz</a>
            </div>

            <div className="menu-section">
              <span className="menu-section-title">İletişim</span>
              <a className="menu-link" href="#" onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                setContactOpen(true)
              }}>Bize Yazın</a>
            </div>
          </div>
        </div>
      </nav>
      <StepNav activeStep={activeStep} light={isLight} hideOnContact={hideStepNav} />
      <LandingSection containerRef={containerRef} audioRef={audioRef} />
      <CTASection containerRef={containerRef} />
      <TurneSection containerRef={containerRef} />
      {/* <AlbumSection containerRef={containerRef} onDarkChange={setIsDarkAlbum} /> */}
      <PlatformShowcase containerRef={containerRef} />
      <ContactSection />
      <EventsModal isOpen={eventsOpen} onClose={() => setEventsOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}

export default App
