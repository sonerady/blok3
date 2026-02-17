import { useRef, useState, useEffect, useCallback } from 'react'
import './App.css'
import LandingSection from './components/LandingSection'
// import HeroSection from './components/HeroSection'
// import ArtHeroSection from './components/ArtHeroSection'
import GallerySection from './components/GallerySection'
import StatisticSection from './components/StatisticSection'
import CTASection from './components/CTASection'
import TurneSection from './components/TurneSection'
import AlbumSection from './components/AlbumSection'
// import Footer from './components/Footer'
import StepNav from './components/StepNav'

function App() {
  const containerRef = useRef(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const handleVideoProgress = useCallback((progress) => {
    setVideoProgress(progress)
  }, [])

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
      // TurneSection (100vh) after CTA
      const turneEnd = ctaEnd + viewportHeight
      // AlbumSection (500vh) after Turne — both albums in one section
      const albumEnd = turneEnd + viewportHeight * 5
      // StatisticSection is 600vh, starts after Album
      const statEnd = albumEnd + viewportHeight * 6
      // GallerySection ends
      const gallery = container.querySelector('.gallery-section')
      const galEnd = gallery ? gallery.offsetTop + gallery.offsetHeight : statEnd + viewportHeight * 4

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
      } else if (scrollTop < statEnd) {
        setActiveStep(5) // İSTATİSTİKLER
      } else {
        setActiveStep(6) // GALERİ
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app" ref={containerRef}>
      <nav className={`global-nav${activeStep === 4 || activeStep === 5 ? ' light' : ''}`}>
        <div className="global-nav-left">
          <span className="hero-nav-logo">
            <span>3</span>
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)', marginLeft: '0.08em' }}>3</span>
          </span>
        </div>
        <div className="global-nav-right">
          <a className="hero-nav-link" href="https://open.spotify.com" target="_blank" rel="noreferrer">SPOTIFY</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://music.apple.com" target="_blank" rel="noreferrer">ITUNES</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://www.deezer.com" target="_blank" rel="noreferrer">DEEZER</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://www.bubilet.com" target="_blank" rel="noreferrer">BUBILET</a>
          <span className="hero-nav-divider">/</span>
          <a className="hero-nav-link" href="https://www.biletinial.com" target="_blank" rel="noreferrer">BILETINIAL</a>
        </div>
      </nav>
      <StepNav activeStep={activeStep} videoProgress={videoProgress} light={activeStep === 4 || activeStep === 5} />
      <LandingSection containerRef={containerRef} onVideoProgress={handleVideoProgress} />
      <CTASection containerRef={containerRef} />
      <TurneSection containerRef={containerRef} />
      <AlbumSection containerRef={containerRef} />
      <StatisticSection containerRef={containerRef} />
      <GallerySection containerRef={containerRef} />
    </div>
  )
}

export default App
