import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion'
import posterImg from '../assets/poster.png'
import posterMobileImg from '../assets/poster_mobile.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  show: (i) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
}

const slideLeft = {
  hidden: { opacity: 0, x: -80 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

const slideRight = {
  hidden: { opacity: 0, x: 80 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

const fadeDown = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

function AnimatedText({ text, className }) {
  return (
    <span className={className} style={{ display: 'inline-flex', overflow: 'hidden', perspective: '600px' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function LaCatedralSection({ containerRef }) {
  const sectionRef = useRef(null)
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
  const bgY = useTransform(scrollYProgress, [0, 0.5, 1], ['15%', '0%', '-15%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.15])
  const posterScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95])
  const mobileBgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.1])

  // Mouse-based parallax (desktop only)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const posterMoveX = useSpring(mouseX, springConfig)
  const posterMoveY = useSpring(mouseY, springConfig)
  const bgMoveX = useSpring(useMotionValue(0), springConfig)

  const handleMouseMove = (e) => {
    if (isMobile) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const nx = (e.clientX - cx) / (rect.width / 2)
    const ny = (e.clientY - cy) / (rect.height / 2)
    mouseX.set(nx * -12)
    mouseY.set(ny * -8)
    bgMoveX.set(nx * 6)
  }

  return (
    <section
      ref={sectionRef}
      className="lacatedral-section"
      onMouseMove={handleMouseMove}
    >
      {/* Desktop: blurred bg */}
      <motion.div
        className="lacatedral-bg desktop-only"
        style={{
          y: bgY,
          scale: bgScale,
          x: bgMoveX,
          backgroundImage: `url(${posterImg})`,
        }}
      />

      {/* Mobile: full-screen 9:16 poster as background */}
      <motion.div
        className="lacatedral-mobile-bg mobile-only"
        style={{
          y: bgY,
          scale: mobileBgScale,
        }}
      >
        <img src={posterMobileImg} alt="" className="lacatedral-mobile-bg-img" />
      </motion.div>

      <div className="lacatedral-bg-overlay" />
      <div className="lacatedral-grain" />

      {/* Center layout */}
      <motion.div
        className="lacatedral-center"
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
        }}
      >
        {/* Bottom-right — CTA */}
        <motion.div className="lacatedral-text-bottom" variants={fadeUp}>
          <motion.a
            href="https://www.bubilet.com.tr/istanbul/etkinlik/blok3-la-catedral"
            target="_blank"
            rel="noreferrer"
            className="lacatedral-cta-btn"
            variants={fadeUp}
          >
            Biletini Al
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Particles */}
      <div className="lacatedral-particles">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="lacatedral-particle"
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
            style={{
              left: `${10 + i * 11}%`,
              bottom: `${8 + (i % 4) * 12}%`,
            }}
          />
        ))}
      </div>
    </section>
  )
}
