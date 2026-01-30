import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll, AnimatePresence } from 'framer-motion'
import landingBg from '../assets/first_background.png'
import landingFront from '../assets/first_front.png'
import secondVideo from '../assets/second_video.mp4'
import secondFront from '../assets/second_front.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

const letters = ['B', 'L', 'O', 'K', '3']

const letterVariants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -40,
    filter: 'blur(8px)',
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: 'easeIn',
    },
  }),
}

export default function LandingSection({ containerRef }) {
  const sectionRef = useRef(null)
  const [key, setKey] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spotlight
  const spotRawX = useMotionValue(-200)
  const spotRawY = useMotionValue(-200)
  const spotX = useSpring(spotRawX, { damping: 20, stiffness: 150, mass: 0.3 })
  const spotY = useSpring(spotRawY, { damping: 20, stiffness: 150, mass: 0.3 })
  const maskImage = useMotionTemplate`radial-gradient(circle 180px at ${spotX}px ${spotY}px, transparent 0px, black 180px)`

  // Scroll-driven crossfade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  // First layer fades out (completes by 30% of scroll)
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const firstFrontOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  // Second front fades in (completes by 35%)
  const secondFrontOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1])

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Parallax
  const frontX = useSpring(useTransform(mouseX, (v) => v * -40), springConfig)
  const secondFrontX = useSpring(useTransform(mouseX, (v) => v * -40), springConfig)
  const titleX = useSpring(useTransform(mouseX, (v) => v * 25), springConfig)
  const titleY = useSpring(useTransform(mouseY, (v) => v * 25), springConfig)

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    mouseX.set((e.clientX - centerX) / centerX)
    mouseY.set((e.clientY - centerY) / centerY)
    spotRawX.set(e.clientX)
    spotRawY.set(e.clientY)
  }

  return (
    <section ref={sectionRef} className="landing-section" onMouseMove={handleMouseMove}>
      <div className="landing-sticky">
        {/* Nav — always visible */}
        <nav className="hero-nav">
          <div className="hero-nav-left">
            <a href="#about" className="hero-nav-link">ABOUT</a>
          </div>
          <div className="hero-nav-center">
            <span className="hero-nav-logo">B-3</span>
          </div>
          <div className="hero-nav-right">
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="hero-nav-link">SPOTIFY</a>
            <a href="https://music.apple.com" target="_blank" rel="noreferrer" className="hero-nav-link">ITUNES</a>
            <a href="https://deezer.com" target="_blank" rel="noreferrer" className="hero-nav-link">DEEZER</a>
            <span className="hero-nav-divider">|</span>
            <a href="https://www.bubilet.com.tr/sanatci/blok3-" target="_blank" rel="noreferrer" className="hero-nav-link">BUBILET</a>
            <a href="https://biletinial.com/tr-tr/profile/blok" target="_blank" rel="noreferrer" className="hero-nav-link">BILETINIAL</a>
          </div>
        </nav>

        {/* Video — always behind */}
        <video
          className="landing-video"
          src={secondVideo}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Second front — fades in */}
        <motion.img
          className="landing-front landing-second-front"
          src={secondFront}
          alt=""
          style={{ opacity: secondFrontOpacity, x: secondFrontX }}
        />

        {/* Background with spotlight — fades out */}
        <motion.img
          className="landing-bg"
          src={landingBg}
          alt=""
          style={{
            opacity: bgOpacity,
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
          }}
        />

        {/* First front — fades out */}
        <motion.img
          className="landing-front"
          src={landingFront}
          alt=""
          style={{ x: frontX, opacity: firstFrontOpacity }}
        />

        {/* Bio info — appears with second screen */}
        <motion.div className="landing-bio" style={{ opacity: secondFrontOpacity }}>
          <span className="landing-bio-date">15 . 08 . 2002</span>
          <p className="landing-bio-text">
            Kocaeli/Gebze doğumlu BLOK3, Türkiye rap sahnesinin yeni nesil ve en etkili isimlerinden biri. Sokak kültüründen beslenen güçlü anlatımı ve enerjik vokaliyle kısa sürede geniş bir dinleyici kitlesine ulaştı.
          </p>
        </motion.div>

        {/* BLOK3 title — stays visible through crossfade */}
        <motion.h1
          className="landing-title"
          style={{ x: titleX, y: titleY }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={key}
              className="landing-title-inner"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={letter + i}
                  custom={i}
                  variants={letterVariants}
                  className="landing-letter"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
      </div>
    </section>
  )
}
