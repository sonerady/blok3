import { useRef, useState, useEffect } from 'react'
import './App.css'
import LandingSection from './components/LandingSection'
import StatisticSection from './components/StatisticSection'
import CTASection from './components/CTASection'
import TurneSection from './components/TurneSection'
import AlbumSection from './components/AlbumSection'
import StepNav from './components/StepNav'
import gitMusic from './assets/musics/git.mp3'

function App() {
  const containerRef = useRef(null)
  const audioRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [version, setVersion] = useState('v1')

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

      const landingMid = viewportHeight * 0.5
      const landingEnd = viewportHeight * 2
      // CTASection (100vh) after landing (200vh)
      const ctaEnd = landingEnd + viewportHeight
      // TurneSection (200vh) after CTA — includes cinematic transition
      const turneEnd = ctaEnd + viewportHeight * 2
      // AlbumSection (700vh) after Turne — 4 albums in one section
      const albumEnd = turneEnd + viewportHeight * 7
      // StatisticSection is 600vh, starts after Album
      const statEnd = albumEnd + viewportHeight * 6

      if (scrollTop < landingMid) {
        setActiveStep(0) // BİYOGRAFİ
      } else if (scrollTop < landingEnd) {
        setActiveStep(1) // TREND
      } else if (scrollTop < ctaEnd) {
        setActiveStep(2) // 2025 KONSER PERFORMANSLARI
      } else if (scrollTop < turneEnd) {
        setActiveStep(3) // 2026 TURNE PLANLAMASI
      } else if (scrollTop < albumEnd) {
        setActiveStep(4) // ÖNE ÇIKAN PARÇALAR
      } else {
        setActiveStep(5) // İSTATİSTİKLER
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const isLight = activeStep === 4 || activeStep === 5

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
          {activeStep === 0 && (
            <div className="version-toggle">
              <button className={`version-btn${version === 'v1' ? ' active' : ''}`} onClick={() => setVersion('v1')}>V1</button>
              <button className={`version-btn${version === 'v2' ? ' active' : ''}`} onClick={() => setVersion('v2')}>V2</button>
            </div>
          )}
        </div>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen((v) => !v)} aria-label="Menü">
          <span /><span /><span />
        </button>
        <div className={`global-nav-right${menuOpen ? ' open' : ''}`}>
          <a className="hero-nav-link" href="https://open.spotify.com/artist/1GMwSpFzrLd12jUX15bHB6" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>SPOTIFY</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://music.apple.com/artist/blok3/1633245914" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>ITUNES</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://www.deezer.com/artist/117259882" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>DEEZER</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://www.bubilet.com.tr/sanatci/blok3-" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>BUBILET</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://biletinial.com/tr-tr/muzik/blok3-konseri-biletleri" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>BILETINIAL</a>
        </div>
      </nav>
      <StepNav activeStep={activeStep} light={isLight} />
      <LandingSection containerRef={containerRef} audioRef={audioRef} version={version} />
      <CTASection containerRef={containerRef} />
      <TurneSection containerRef={containerRef} />
      <AlbumSection containerRef={containerRef} />
      <StatisticSection containerRef={containerRef} />
    </div>
  )
}

export default App
