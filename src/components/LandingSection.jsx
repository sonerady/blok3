import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll, AnimatePresence } from 'framer-motion'
import landingBg from '../assets/first_background.png'
import landingFront from '../assets/first_front.png'
import firstVideo from '../assets/first_video_background.mp4'
import secondVideo from '../assets/second_video.mp4'
import secondFront from '../assets/second_front.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

const bioText = 'BLOK3 (Hakan Aydın), 15 Ağustos 2002 tarihinde Kocaeli\'nin Gebze ilçesinde doğmuş, Türkiye rap sahnesinin yeni nesil ve en etkili isimlerinden biridir. Müziğe erken yaşlarda ilgi duyan sanatçı, sokak kültüründen beslenen güçlü anlatımı ve enerjik vokaliyle kısa sürede geniş bir dinleyici kitlesine ulaşmıştır.'

function TypewriterText({ text, delay = 0, speed = 18 }) {
  const [charCount, setCharCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (charCount >= text.length) return
    const timer = setTimeout(() => {
      setCharCount((c) => c + 1)
    }, speed)
    return () => clearTimeout(timer)
  }, [started, charCount, text, speed])

  return (
    <span>
      {text.slice(0, charCount)}
      {charCount < text.length && started && <span className="typewriter-cursor">|</span>}
    </span>
  )
}

const phrases = [
  'KUSURA BAKMA',
  '100M+ DİNLENME',
  '#1 TÜRKİYE',
  'REKOR HİT',
  'VİRAL FENOMEN',
]

const phraseVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: 'blur(8px)',
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
}

export default function LandingSection({ containerRef, onVideoProgress }) {
  const sectionRef = useRef(null)
  const firstVideoRef = useRef(null)
  const [key, setKey] = useState(0)
  const [introEnded, setIntroEnded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showBio, setShowBio] = useState(false)
  const [titleKey, setTitleKey] = useState(0)
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

  // First layer fades out quickly on first scroll
  const bgOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const firstFrontOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  // Second front fades in immediately
  const secondFrontOpacity = useTransform(scrollYProgress, [0.02, 0.1], [0, 1])

  // Hide cursor only on first screen
  const [isFirstScreen, setIsFirstScreen] = useState(true)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setIsFirstScreen(v < 0.05)
    })
    return unsubscribe
  }, [scrollYProgress])

  // Show bio when video starts playing
  useEffect(() => {
    const video = firstVideoRef.current
    if (!video) return
    const handlePlay = () => setShowBio(true)
    video.addEventListener('playing', handlePlay)
    return () => video.removeEventListener('playing', handlePlay)
  }, [])

  // Show BLOK3 title ~3 seconds before intro video ends + report progress
  useEffect(() => {
    const video = firstVideoRef.current
    if (!video) return
    const handleTime = () => {
      if (video.duration) {
        if (video.currentTime >= video.duration - 3 && !showContent) {
          setShowContent(true)
        }
        if (onVideoProgress) {
          onVideoProgress(Math.round((video.currentTime / video.duration) * 100))
        }
      }
    }
    video.addEventListener('timeupdate', handleTime)
    return () => video.removeEventListener('timeupdate', handleTime)
  }, [showContent, onVideoProgress])

  // Block scroll until intro video ends
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (introEnded) {
      container.style.overflowY = 'scroll'
      return
    }
    container.style.overflowY = 'hidden'
    return () => { container.style.overflowY = 'scroll' }
  }, [introEnded, containerRef])

  useEffect(() => {
    if (!introEnded) return
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [introEnded])

  // BLOK3 title animation loop every 3 seconds
  useEffect(() => {
    if (!showContent) return
    const interval = setInterval(() => {
      setTitleKey((k) => k + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [showContent])

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
    <section ref={sectionRef} className="landing-section" onMouseMove={handleMouseMove} style={{ cursor: isFirstScreen ? 'none' : 'auto' }}>
      <div className="landing-sticky">
        {/* Nav — always visible */}
        <nav className="hero-nav">
          <div className="hero-nav-left" style={{ position: 'relative' }}>
            <motion.span className="hero-nav-logo" style={{ opacity: bgOpacity }}><span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>3</span><span style={{ marginLeft: '0.08em' }}>3</span></motion.span>
            <motion.span className="hero-nav-logo hero-nav-logo-alt" style={{ opacity: secondFrontOpacity }}>TREND</motion.span>
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

        {/* Intro video — plays once, then fades out */}
        <motion.video
          ref={firstVideoRef}
          className="landing-bg"
          src={firstVideo}
          autoPlay
          muted
          playsInline
          onEnded={() => setIntroEnded(true)}
          animate={{ opacity: introEnded ? 0 : 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
          }}
        />

        {/* Background with spotlight — fades in after video ends, then fades out on scroll */}
        <motion.div
          className="landing-bg-wrapper"
          animate={{ opacity: introEnded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
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
        </motion.div>

        {/* First front — fades out */}
        <motion.img
          className="landing-front"
          src={landingFront}
          alt=""
          style={{ x: frontX, opacity: firstFrontOpacity }}
        />

        {/* Bio info — appears when video starts, fades out on scroll */}
        {showBio && (
          <motion.div
            className="landing-bio"
            style={{ opacity: bgOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="landing-bio-date">
              <motion.span
                className="landing-bio-num"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >15</motion.span>
              <span className="landing-bio-sep">—</span>
              <motion.span
                className="landing-bio-num"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >08</motion.span>
              <span className="landing-bio-sep">—</span>
              <motion.span
                className="landing-bio-num"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >2002</motion.span>
            </div>
            <motion.p
              className="landing-bio-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <TypewriterText text={bioText} delay={0.9} speed={18} />
            </motion.p>
          </motion.div>
        )}

        {/* BLOK3 title — first screen only, letter-by-letter loops every 3s */}
        {showContent && (
          <motion.h1
            className="landing-title"
            style={{ x: titleX, y: titleY, opacity: bgOpacity }}
          >
            {'BLOK3'.split('').map((char, i) => (
              <motion.span
                key={`${titleKey}-${i}`}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        )}

        {/* Rotating praise phrases — second screen only */}
        <motion.h1
          className="landing-title landing-title-second"
          style={{ opacity: secondFrontOpacity }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={key}
              className="landing-title-inner"
              variants={phraseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {phrases[key % phrases.length].split(' ').map((word, i, arr) => {
                const phrase = phrases[key % phrases.length]
                const isRekorHit = phrase === 'REKOR HİT' && i === 1
                return (
                  <span key={i} style={{ display: 'block', alignSelf: isRekorHit ? 'flex-end' : 'flex-start' }}>{word}</span>
                )
              })}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* YouTube video info — fades in on second screen */}
        <motion.div
          className="landing-yt-info"
          style={{ opacity: secondFrontOpacity }}
        >
          <div className="landing-yt-badge">
            <svg width="20" height="14" viewBox="0 0 24 17" fill="none">
              <rect width="24" height="17" rx="4" fill="#FF0000" />
              <path d="M16 8.5L10 12V5L16 8.5Z" fill="#fff" />
            </svg>
            <span className="landing-yt-badge-text">Official Music Video</span>
          </div>
          <h2 className="landing-yt-title">KUSURA BAKMA</h2>
          <p className="landing-yt-meta">100 Mn görüntülenme &bull; 2 ay önce</p>
          <div className="landing-yt-channel">
            <div className="landing-yt-avatar">B3</div>
            <div className="landing-yt-channel-info">
              <span className="landing-yt-channel-name">Blok3</span>
              <span className="landing-yt-channel-subs">1.2M abone</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
