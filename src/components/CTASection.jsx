import { useRef, useEffect, useState, memo, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'

function TypewriterHeading({ text, active, speed = 40 }) {
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (!active) return
    if (charCount >= text.length) return
    const timer = setTimeout(() => setCharCount((c) => c + 1), speed)
    return () => clearTimeout(timer)
  }, [active, charCount, text, speed])

  return (
    <span>
      {text.slice(0, charCount)}
      {active && charCount < text.length && <span className="typewriter-cursor">|</span>}
    </span>
  )
}
import concerBg1 from '../assets/concer_section_1.jpg'
import concerBg2 from '../assets/concer_section_2.jpg'
import concerBg3 from '../assets/concer_section_3.jpg'
import concerBg4 from '../assets/concer_section_4.jpg'
import concerBg5 from '../assets/concer_section_5.jpg'
import concerFront from '../assets/concer_section_front.png'

const bgImages = [concerBg1, concerBg2, concerBg3, concerBg4, concerBg5]

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

/* ── Animated number counter ── */
const AnimatedCounter = memo(function AnimatedCounter({ target, suffix = '', active }) {
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { damping: 30, stiffness: 80, mass: 0.5 })
  const displayRef = useRef(null)

  useEffect(() => {
    if (active) motionVal.set(target)
  }, [active, target, motionVal])

  useEffect(() => {
    const unsubscribe = springVal.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = Math.floor(v).toLocaleString('tr-TR') + suffix
      }
    })
    return unsubscribe
  }, [springVal, suffix])

  return <span ref={displayRef}>0{suffix}</span>
})

/* ── Animation variants ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const lineGrow = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

const numberPop = {
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

/* ── Hardcoded fallback stats ── */
const defaultStats = {
  turkiye: [
    { stat_key: 'sehir', value: 50, suffix: '', label: 'ŞEHİR' },
    { stat_key: 'konser', value: 90, suffix: '', label: 'KONSER' },
    { stat_key: 'izleyici', value: 300000, suffix: '+', label: 'BİLETLİ İZLEYİCİ' },
  ],
  avrupa: [
    { stat_key: 'ulke', value: 8, suffix: '', label: 'ÜLKE' },
    { stat_key: 'sehir', value: 20, suffix: '', label: 'ŞEHİR' },
    { stat_key: 'konser', value: 45, suffix: '', label: 'KONSER' },
    { stat_key: 'misafir', value: 125000, suffix: '+', label: 'BİLETLİ MİSAFİR' },
  ],
  toplam: [
    { stat_key: 'izleyici', value: 425000, suffix: '+', label: 'TOPLAM BİLETLİ İZLEYİCİ' },
  ],
}

export default function CTASection({ containerRef, onGalleryOpen, concertStats = [] }) {
  // Merge API data with fallbacks
  const getRegion = (region) => {
    const apiItems = concertStats.filter((s) => s.region === region)
    if (apiItems.length > 0) return apiItems
    return defaultStats[region] || []
  }
  const trStats = getRegion('turkiye')
  const euStats = getRegion('avrupa')
  const totalStats = getRegion('toplam')

  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 0.5, 1], ['10%', '0%', '-10%'])
  const [countersActive, setCountersActive] = useState(false)
  const [frontGlitching, setFrontGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrontGlitching(true)
      setTimeout(() => setFrontGlitching(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  const [bgIndex, setBgIndex] = useState(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setCountersActive(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  // Background image slideshow — 3 second interval, loops
  useEffect(() => {
    const interval = setInterval(() => {
      isFirstRender.current = false
      setBgIndex((prev) => (prev + 1) % bgImages.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const frontX = useSpring(useMotionValue(0), springConfig)
  const bgMoveX = useSpring(useMotionValue(0), springConfig)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const nx = (e.clientX - centerX) / (rect.width / 2)
    frontX.set(nx * -30)
    bgMoveX.set(nx * 10)
  }

  return (
    <section ref={sectionRef} className="cta-section" onMouseMove={handleMouseMove}>
      {/* Parallax BG — crossfade slideshow */}
      <AnimatePresence mode="sync">
        <motion.img
          key={bgIndex}
          className="cta-bg"
          src={bgImages[bgIndex]}
          alt=""
          style={{ x: bgMoveX, y: bgY }}
          initial={isFirstRender.current ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <motion.img className={`cta-front${frontGlitching ? ' front-glitch' : ''}`} src={concerFront} alt="" style={{ x: isMobile ? 0 : frontX }} />
      <div className="cta-overlay" />

      {/* ── Editorial Layout ── */}
      <motion.div
        className="cta-layout"
        variants={stagger}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
      >
        {/* Left column — title + description */}
        <div className="cta-col-left">
          <motion.span className="cta-year" variants={slideLeft}>2025</motion.span>
          <motion.h2 className="cta-heading" variants={slideLeft}>
            KONSER<br />PERFORMANS<span className="cta-heading-accent">LARI</span>
          </motion.h2>
          <motion.p className="cta-lead" variants={slideLeft}>
            Sahnenin enerjisi, rakamların ötesinde.
          </motion.p>
          <motion.button className="cta-gallery-btn" variants={slideLeft} onClick={onGalleryOpen}>
            Galeriyi Keşfet
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Bottom-right — stats */}
        <motion.div className="cta-stats-area" variants={fadeUp}>
          {/* Turkey */}
          <motion.div className="cta-stat-block" variants={slideRight}>
            <span className="cta-tag">TÜRKİYE</span>
            <div className="cta-stat-row">
              {trStats.map((s, i) => (
                <motion.div key={s.stat_key || i} className={`cta-stat${i === trStats.length - 1 ? ' cta-stat-highlight' : ''}`} variants={numberPop}>
                  <span className="cta-num"><AnimatedCounter target={s.value} suffix={s.suffix} active={countersActive} /></span>
                  <span className="cta-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Europe */}
          <motion.div className="cta-stat-block" variants={slideRight}>
            <span className="cta-tag">AVRUPA</span>
            <div className={`cta-stat-row${euStats.length >= 4 ? ' cta-stat-row-4' : ''}`}>
              {euStats.map((s, i) => (
                <motion.div key={s.stat_key || i} className={`cta-stat${i === euStats.length - 1 ? ' cta-stat-highlight' : ''}`} variants={numberPop}>
                  <span className="cta-num"><AnimatedCounter target={s.value} suffix={s.suffix} active={countersActive} /></span>
                  <span className="cta-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Total */}
          {totalStats.map((s, i) => (
            <motion.div key={s.stat_key || i} className="cta-total-row" variants={fadeUp}>
              <span className="cta-bottom-num">
                <AnimatedCounter target={s.value} suffix={s.suffix} active={countersActive} />
              </span>
              <span className="cta-bottom-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
