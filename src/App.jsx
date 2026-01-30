import { useRef, useState, useEffect, useCallback } from 'react'
import './App.css'
import LandingSection from './components/LandingSection'
// import HeroSection from './components/HeroSection'
// import ArtHeroSection from './components/ArtHeroSection'
// import GallerySection from './components/GallerySection'
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
      const sections = container.children
      // DOM: [0]=StepNav(fixed), [1]=Landing, [2]=Statistic, ...

      // Block scroll past StatisticSection
      if (sections[2]) {
        const statEnd = sections[2].offsetTop + sections[2].offsetHeight - viewportHeight
        if (scrollTop > statEnd) {
          container.scrollTop = statEnd
          return
        }
      }

      const landingEnd = viewportHeight * 2
      const landingMid = viewportHeight * 0.5

      if (scrollTop < landingMid) {
        setActiveStep(0) // BİYOGRAFİ
      } else if (scrollTop < landingEnd) {
        setActiveStep(1) // TREND
      } else {
        setActiveStep(2) // İSTATİSTİKLER
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app" ref={containerRef}>
      <StepNav activeStep={activeStep} videoProgress={videoProgress} light={activeStep === 2} />
      <LandingSection containerRef={containerRef} onVideoProgress={handleVideoProgress} />
      <StatisticSection containerRef={containerRef} />
      {/* Sections below are hidden — scroll blocked after StatisticSection */}
      {/* <HeroSection containerRef={containerRef} /> */}
      {/* <ArtHeroSection /> */}
      {/* <GallerySection /> */}
      {/* <CTASection /> */}
      {/* <Footer /> */}
    </div>
  )
}

export default App
