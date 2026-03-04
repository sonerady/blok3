import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import turneBg1 from '../assets/2026_concer_section_backgorund.jpg'
import turneBg3 from '../assets/2026_concer_section_backgorund_3.jpg'
import turneBg2 from '../assets/2026_concer_section_backgorund_2.jpg'
import turneBg4 from '../assets/2026_concer_section_backgorund_4.jpg'
import turneBgMobile from '../assets/2026_concer_section_backgorund_mobile.png'
import turneBg2Mobile from '../assets/2026_concer_section_backgorund_2_mobile.jpg'
import turneBg3Mobile from '../assets/2026_concer_section_backgorund_3_mobile.png'
import turneBg4Mobile from '../assets/2026_concer_section_backgorund_4_mobile.png'

const bgImages = [turneBg1, turneBg3, turneBg2, turneBg4]
const bgImagesMobile = [turneBgMobile, turneBg2Mobile, turneBg3Mobile, turneBg4Mobile]
import turneFront1 from '../assets/2026_concer_section_front_1.png'
import turneFront2 from '../assets/2026_concer_section_front_2.png'
import turneFront2Goat from '../assets/2026_concer_section_front_2_goat.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

export default function TurneSection({ containerRef }) {
  const sectionRef = useRef(null)
  const [bgIndex, setBgIndex] = useState(0)
  const [frontAlt, setFrontAlt] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [frontGlitchKey, setFrontGlitchKey] = useState(0)
  const [frontGlitching, setFrontGlitching] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Electric glitch swap — bg cycles 1→3→2, front2 toggles, every 3s
  useEffect(() => {
    const swap = () => {
      setGlitching(true)
      setFrontGlitching(true)
      setFrontGlitchKey((k) => k + 1)
      setTimeout(() => {
        setBgIndex((v) => (v + 1) % bgImages.length)
        setFrontAlt((v) => !v)
        setTimeout(() => {
          setGlitching(false)
          setFrontGlitching(false)
        }, 150)
      }, 150)
    }
    const tick = () => {
      return setTimeout(() => {
        swap()
        timerId = tick()
      }, 3000)
    }
    let timerId = tick()
    return () => clearTimeout(timerId)
  }, [])

  // Scroll-based parallax & cinematic transition
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  // Background parallax (first half only)
  const bgY = useTransform(scrollYProgress, [0, 0.25, 0.5], ['0%', '-5%', '-10%'])

  const front1X = useSpring(useMotionValue(0), springConfig)
  const front2X = useSpring(useMotionValue(0), springConfig)
  const bgMoveX = useSpring(useMotionValue(0), springConfig)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const nx = (e.clientX - centerX) / (rect.width / 2)
    front1X.set(nx * -25)
    front2X.set(nx * -15)
    bgMoveX.set(nx * 10)
  }

  /* ── Cinematic transition (scroll 0.45→1.0) ── */

  // 2026 text: scale up
  const yearScale = useTransform(scrollYProgress, [0, 0.45, 0.7, 0.85, 1], [1, 1, 3, 6, 10])
  // 2026 text: move from top:12% to center (translateY)
  const yearY = useTransform(scrollYProgress, [0, 0.45, 0.7], ['0%', '0%', '120%'])
  // 2026 letter-spacing: merge
  const yearSpacing = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], ['0.02em', '0.02em', '-0.15em', '-0.3em'])

  // Fade out: bg, fronts, clouds, desc, overlay
  const elementsOp = useTransform(scrollYProgress, [0, 0.45, 0.65], [1, 1, 0])

  // White overlay
  const whiteOp = useTransform(scrollYProgress, [0, 0.7, 0.9, 1], [0, 0, 0.8, 1])

  // 2026 text opacity (keep visible then fade as white takes over)
  const yearOp = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0])

  return (
    <section ref={sectionRef} className="turne-section" onMouseMove={handleMouseMove}>
      <div className="turne-sticky">
        {/* Background — electric glitch swap */}
        <motion.img
          className={`turne-bg${glitching ? ' bg-glitch' : ''}`}
          src={isMobile ? bgImagesMobile[bgIndex % bgImagesMobile.length] : bgImages[bgIndex]}
          alt=""
          style={{ x: isMobile ? 0 : bgMoveX, y: isMobile ? 0 : bgY, opacity: elementsOp }}
        />

        {/* Dark clouds — behind text & fronts */}
        <motion.div className="turne-clouds" style={{ opacity: elementsOp }}>
          <div className="turne-cloud turne-cloud-1" />
          <div className="turne-cloud turne-cloud-2" />
          <div className="turne-cloud turne-cloud-3" />
        </motion.div>

        {/* 2026 Text — zoom in during transition */}
        <motion.div
          className="turne-year"
          style={{
            scale: yearScale,
            y: yearY,
            letterSpacing: yearSpacing,
            opacity: yearOp,
          }}
        >
          {['B', 'L', 'O', 'K', '3'].map((char, i) => {
              const offsets = ['-10%', '6%', '-8%', '8%', '-12%']
              return (
                <motion.span
                  key={i}
                  className="turne-year-char"
                  style={{ translateY: offsets[i] }}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {char}
                </motion.span>
              )
            })}
        </motion.div>

        {/* Front 2 (behind front 1) — electric glitch swap */}
        <motion.img
          key={frontGlitchKey}
          className={`turne-front turne-front-2${frontGlitching ? ' front-glitch' : ''}`}
          src={frontAlt ? turneFront2Goat : turneFront2}
          alt=""
          style={{ x: isMobile ? 0 : front2X, opacity: elementsOp }}
        />

        {/* Front 1 (on top) */}
        <motion.img
          className="turne-front turne-front-1"
          src={turneFront1}
          alt=""
          style={{ x: isMobile ? 0 : front1X, opacity: elementsOp }}
        />

        {/* Overlay */}
        <motion.div className="turne-overlay" style={{ opacity: elementsOp }} />

        {/* Bio text */}
        <motion.div className="landing-bio" style={{ opacity: elementsOp }}>
          <p className="landing-bio-text">
            <strong>BLOK3</strong>, Türkiye müzik sahnesinin <strong>en hızlı yükselen</strong> ve en çok dinlenen isimlerinden biri. Kendine özgü tarzı, enerjik <strong>sahne performansları</strong> ve <strong>milyarlarca streame</strong> ulaşan şarkılarıyla yeni nesil müziğin sınırlarını zorluyor. <strong>Avrupa turnelerinden</strong> sold-out konserlere, dijital platformlardan <strong>stadyumlara</strong> uzanan bir yolculuk.
          </p>
        </motion.div>

        {/* White overlay — fills screen at end of transition */}
        <motion.div className="turne-white-overlay" style={{ opacity: whiteOp }} />
      </div>
    </section>
  )
}
