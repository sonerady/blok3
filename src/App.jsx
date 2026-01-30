import { useRef } from 'react'
import './App.css'
import LandingSection from './components/LandingSection'
import HeroSection from './components/HeroSection'
// import ArtHeroSection from './components/ArtHeroSection'
// import GallerySection from './components/GallerySection'
import StatisticSection from './components/StatisticSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function App() {
  const containerRef = useRef(null)

  return (
    <div className="app" ref={containerRef}>
      <LandingSection containerRef={containerRef} />
      <StatisticSection containerRef={containerRef} />
      <HeroSection containerRef={containerRef} />
      {/* <ArtHeroSection /> */}
      {/* <GallerySection /> */}
      <CTASection />
      <Footer />
    </div>
  )
}

export default App
