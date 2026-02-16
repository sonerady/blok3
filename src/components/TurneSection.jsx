import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import turneBg1 from '../assets/2026_concer_section_backgorund.jpg'
import turneBg3 from '../assets/2026_concer_section_backgorund_3.jpg'
import turneBg2 from '../assets/2026_concer_section_backgorund_2.jpg'
import turneBg4 from '../assets/2026_concer_section_backgorund_4.jpg'

const bgImages = [turneBg1, turneBg3, turneBg2, turneBg4]
import turneFront1 from '../assets/2026_concer_section_front_1.png'
import turneFront2 from '../assets/2026_concer_section_front_2.png'
import turneFront2Goat from '../assets/2026_concer_section_front_2_goat.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

export default function TurneSection({ containerRef }) {
  const sectionRef = useRef(null)
  const [bgIndex, setBgIndex] = useState(0)
  const [frontAlt, setFrontAlt] = useState(false)
  const [glitching, setGlitching] = useState(false)

  // Electric glitch swap — bg cycles 1→3→2, front2 toggles, every 3s
  useEffect(() => {
    const swap = () => {
      setGlitching(true)
      setTimeout(() => {
        setBgIndex((v) => (v + 1) % bgImages.length)
        setFrontAlt((v) => !v)
        setTimeout(() => setGlitching(false), 150)
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

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 0.5, 1], ['10%', '0%', '-10%'])
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

  return (
    <section ref={sectionRef} className="turne-section" onMouseMove={handleMouseMove}>
      {/* Background — electric glitch swap */}
      <motion.img
        className={`turne-bg${glitching ? ' bg-glitch' : ''}`}
        src={bgImages[bgIndex]}
        alt=""
        style={{ x: bgMoveX, y: bgY }}
      />

      {/* Dark clouds — behind text & fronts */}
      <div className="turne-clouds">
        <div className="turne-cloud turne-cloud-1" />
        <div className="turne-cloud turne-cloud-2" />
        <div className="turne-cloud turne-cloud-3" />
      </div>

      {/* 2026 Text — behind front images */}
      <div className="turne-year">
        <span className="turne-year-char" style={{ transform: 'translateY(-8%)' }}>2</span>
        <span className="turne-year-char" style={{ transform: 'translateY(6%)' }}>0</span>
        <span className="turne-year-char" style={{ transform: 'translateY(-12%)' }}>2</span>
        <span className="turne-year-char" style={{ transform: 'translateY(4%)' }}>6</span>
      </div>

      {/* Front 2 (behind front 1) — electric glitch swap */}
      <motion.img
        className={`turne-front turne-front-2${glitching ? ' bg-glitch' : ''}`}
        src={frontAlt ? turneFront2Goat : turneFront2}
        alt=""
        style={{ x: front2X }}
      />

      {/* Front 1 (on top) */}
      <motion.img
        className="turne-front turne-front-1"
        src={turneFront1}
        alt=""
        style={{ x: front1X }}
      />

      {/* Overlay */}
      <div className="turne-overlay" />

      {/* Bottom description */}
      <p className="turne-desc">
        BLOK3, 2026 konser planlamasına göre bu yıl içerisinde Türkiye içinde 34 Şehirde 62 Konser, Yurt dışında 10 Ülke, 25 Şehirde 50 Konser gerçekleştirmesi planlanmaktadır.
      </p>
    </section>
  )
}
