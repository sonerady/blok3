import { useRef, useState, useEffect, useCallback } from 'react'
import './App.css'
import LandingSection from './components/LandingSection'
// import HeroSection from './components/HeroSection'
// import ArtHeroSection from './components/ArtHeroSection'
import GallerySection from './components/GallerySection'
import StatisticSection from './components/StatisticSection'
// import CTASection from './components/CTASection'
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

      // Block scroll past GallerySection
      // Find gallery section by class since StepNav may or may not be in DOM
      const gallery = container.querySelector('.gallery-section')
      if (gallery) {
        const galEnd = gallery.offsetTop + gallery.offsetHeight - viewportHeight
        if (scrollTop > galEnd) {
          container.scrollTop = galEnd
          return
        }
      }

      const landingEnd = viewportHeight * 2
      const landingMid = viewportHeight * 0.5
      // StatisticSection is 600vh, starts after landing (200vh)
      const statEnd = viewportHeight * 2 + viewportHeight * 6

      if (scrollTop < landingMid) {
        setActiveStep(0) // BİYOGRAFİ
      } else if (scrollTop < landingEnd) {
        setActiveStep(1) // TREND
      } else if (scrollTop < statEnd) {
        setActiveStep(2) // İSTATİSTİKLER
      } else {
        setActiveStep(3) // GALERI
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app" ref={containerRef}>
      {activeStep < 3 && (
        <StepNav activeStep={activeStep} videoProgress={videoProgress} light={activeStep >= 2} />
      )}
      <LandingSection containerRef={containerRef} onVideoProgress={handleVideoProgress} />
      <StatisticSection containerRef={containerRef} />
      <GallerySection containerRef={containerRef} />
      {/* Sections below are hidden — scroll blocked after GallerySection */}
      {/* <HeroSection containerRef={containerRef} /> */}
      {/* <ArtHeroSection /> */}
      {/* <CTASection /> */}
      {/* <Footer /> */}
    </div>
  )
}

export default App
