import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion'
import posterImg from '../assets/la_catedral.png'
import posterMobileImg from '../assets/katedral_mobile.png'
import passoLogo from '../assets/passo_logo.png'
import kralpopLogo from '../assets/kralpop.png'

function BubiletSvg({ className }) {
  return (
    <svg className={className} width="136" height="32" viewBox="0 0 1604.4 360" xmlns="http://www.w3.org/2000/svg">
      <g><path fill="currentColor" d="M108.7,125l32.7-15.3c5.3-2.5,7.6-8.8,5.1-14-2.5-5.3-8.8-7.6-14-5.1l-32.7,15.3c-5.3,2.5-7.6,8.8-5.1,14,2.5,5.3,8.8,7.6,14,5.1Z"/><path fill="currentColor" d="M147,19.3c-.4.2-.8.1-.9,0C127.1-.2,97.8-5.5,73.2,6c-24.6,11.5-39.3,37.3-36.7,64.4,0,.2-.2.6-.6.7C4.8,85.6-8.7,122.7,5.8,153.8l73.1,156.8c14.5,31,51.4,44.5,82.4,30.3.4-.1,1-.2,1.3,0,19,19.4,48.3,24.7,72.9,13.3,24.6-11.5,39.3-37.3,36.7-64.4,0-.1,0-.2,0-.2.1-.2.4-.4.7-.6,31.1-14.5,44.5-51.6,30-82.7L229.7,49.4c-14.5-31.1-51.6-44.6-82.7-30.1ZM161.4,340.8h.3c0-.1,0,0-.3,0ZM272.5,289h.2c0,0,0-.1,0-.1-.2,0-.2.1-.3.1ZM263.2,268.4c0,0-.1,0-.2,0-5.7,2.7-14.7,10.4-13.4,23.4,1.7,17.5-7.8,34.2-23.7,41.6-15.9,7.4-34.9,4-47.1-8.6-9.1-9.3-21.4-7.2-26.7-4.7-19.8,9.2-43.4.6-52.6-19.2L33.7,160l38.2-17.8c5.3-2.5,7.6-8.8,5.1-14-2.5-5.3-8.8-7.6-14-5.1l-38,17.7c-6.7-19,2-40.4,20.6-49.1,9-4.2,14.5-13.7,13.5-23.5-1.7-17.5,7.8-34.2,23.7-41.6,15.9-7.4,34.9-4,47.1,8.6,6.9,7.1,17.6,9,26.7,4.7,18.6-8.7,40.7-1.6,50.9,15.8l-37.9,17.7c-5.3,2.5-7.6,8.8-5.1,14,2.5,5.3,8.8,7.6,14,5.1l38-17.7,65.8,141.1c9.2,19.8.7,43.4-19.1,52.6Z"/><path fill="currentColor" d="M201,120c-5.8-2.3-12.4.5-14.7,6.3l-60.5,151.2c-2.3,5.8.5,12.4,6.3,14.7,3,1.2,6.3,1,9-.3s4.6-3.3,5.7-6.1l60.5-151.2c2.3-5.8-.5-12.4-6.3-14.7Z"/><path fill="currentColor" d="M140.3,171.8c-8.5-18.3-30.4-26.2-48.6-17.7-18.3,8.5-26.2,30.4-17.7,48.6,8.5,18.3,30.4,26.2,48.6,17.7,18.3-8.5,26.2-30.4,17.7-48.6ZM92.4,194.1c-3.8-8.1-.3-17.8,7.8-21.6,8.1-3.8,17.8-.3,21.6,7.8,3.8,8.1.3,17.8-7.8,21.6-8.1,3.8-17.8.3-21.6-7.8Z"/><path fill="currentColor" d="M210.4,191.9c-18.3,8.5-26.2,30.4-17.7,48.6s30.4,26.2,48.6,17.7c18.3-8.5,26.2-30.4,17.7-48.6-8.5-18.3-30.4-26.2-48.6-17.7ZM232.7,239.8c-8.1,3.8-17.8.3-21.6-7.8-3.8-8.1-.3-17.8,7.8-21.6,8.1-3.8,17.8-.3,21.6,7.8,3.8,8.1.3,17.8-7.8,21.6Z"/></g><g><g><rect fill="currentColor" x="1090.9" y="94.1" width="50.3" height="215.6" rx="25.1" ry="25.1"/><rect fill="currentColor" x="1090.9" y="25.2" width="50.3" height="50.3" rx="25.1" ry="25.1"/></g><path fill="currentColor" d="M1172.7,284.5V50.3c0-13.9,11.3-25.2,25.2-25.2h0c13.9,0,25.2,11.3,25.2,25.2v234.2c0,13.9-11.3,25.2-25.2,25.2h0c-13.9,0-25.2-11.3-25.2-25.2Z"/><path fill="currentColor" d="M1565.6,265.3c-6.9,0-12.6-5.6-12.6-12.6v-110.7h32.1c10.6,0,19.3-8.6,19.3-19.3h0c0-10.6-8.6-19.3-19.3-19.3h-32.1v-53.2c0-13.9-11.3-25.1-25.1-25.1h0c-13.9,0-25.1,11.3-25.1,25.1v53.2h-21.1c-10.6,0-19.3,8.6-19.3,19.3h0c0,10.6,8.6,19.3,19.3,19.3h21.1v117.2c0,27.8,22.5,50.3,50.3,50.3h19.8c12.2,0,22.1-9.9,22.1-22.1h0c0-12.2-9.9-22.1-22.1-22.1h-7.2Z"/><path fill="currentColor" d="M1356.9,89.5c-63,0-111.3,44.6-112.7,109.6-.1.9-.2,1.8-.2,2.8,0,6.4.5,12.7,1.5,18.9,0,.2,0,.4,0,.6h0c3.9,23.9,14.9,45.4,32.1,61.7,21.1,20.1,50.1,31.2,81.6,31.2s63-12,84.4-33.8c10.8-11,9.1-29.7-5-38.4-9.7-6-22.3-3.9-30.3,4.2-12.1,12.2-29.5,18.9-49.1,18.9-30.8,0-54.3-16.3-62.7-41.5-.6-1.8.7-3.7,2.6-3.7h0s146.5,0,146.5,0c9.1,0,16.5-7.4,16.5-16.5h0c0-67.9-45.9-113.8-105.4-113.8ZM1356.9,131.3c26.1,0,47.6,15.7,53.2,45.8.4,1.9-1.1,3.7-3,3.7h-105.9c-2,0-3.5-1.9-3-3.8,7.3-30.6,30.2-45.6,58.7-45.6Z"/><path fill="currentColor" d="M893.5,109.1c-.3.2-.6.4-.8.6v-59.4c0-13.9-11.3-25.2-25.2-25.2s-25.2,11.3-25.2,25.2v234.2c0,13.9,11.3,25.2,25.2,25.2s19.9-6.8,23.5-16.2c6.6,4.8,13.8,8.8,21.5,11.9,74.2,29.9,157.3-18.7,157.3-103.5s-102.2-141.6-176.2-92.7ZM980.7,268c-15.6,8.9-35.7,9.1-51.8,1.1-24.9-12.1-38.5-40.3-38.3-67.2-.2-27,13.3-55.3,38.2-67.5,20.3-10.3,46.3-6.6,62.8,8.9,16.2,14.8,23.8,37,23.8,58.5,0,25.7-11.4,53.1-34.7,66.1Z"/><path fill="currentColor" d="M410.7,109.1c-.3.2-.6.4-.8.6v-59.4c0-13.9-11.3-25.2-25.2-25.2s-25.2,11.3-25.2,25.2v234.2c0,13.9,11.3,25.2,25.2,25.2s19.9-6.8,23.5-16.2c6.6,4.8,13.8,8.8,21.5,11.9,74.2,29.9,157.3-18.7,157.3-103.5s-102.2-141.6-176.2-92.7ZM497.8,268c-15.6,8.9-35.7,9.1-51.8,1.1-24.9-12.1-38.5-40.3-38.3-67.2-.2-27,13.3-55.3,38.2-67.5,20.3-10.3,46.3-6.6,62.8,8.9,16.2,14.8,23.8,37,23.8,58.5,0,25.7-11.4,53.1-34.7,66.1Z"/><path fill="currentColor" d="M785.8,94.1h0c-13.9,0-25.3,11.3-25.3,25.1v88.3c0,25.6-1.5,49.2-36.9,58.9-11.4,3.1-28.3,1.9-39.3-2.2-26.2-9.2-26-42.4-25.7-66.1,0-25.8,0-54.4-.6-80.1-.4-13-10.8-23.6-24-23.9-13.6-.3-24.9,10.4-25.2,23.9-.5,17.8-.6,35.6-.7,53.4,0,4.9,0,29,0,33.4-.7,44.4,14.3,90.1,61.4,104.5,32.5,9.2,68.8,5,92.9-15.7,3.7,9.4,12.8,16,23.4,16h0c13.9,0,25.2-11.3,25.2-25.1V119.3c0-13.9-11.3-25.1-25.2-25.1Z"/></g>
    </svg>
  )
}

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
        {/* Mobile logos */}
        <div className="lacatedral-mobile-logos">
          <img src={bubiletLogo} alt="Bubilet" className="lacatedral-logo lacatedral-logo-bubilet" />
          <img src={passoLogo} alt="Passo" className="lacatedral-logo" />
          <img src={kralpopLogo} alt="Kral Pop" className="lacatedral-logo lacatedral-logo-kralpop" />
        </div>
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
        {/* Top — tag */}
        <motion.div className="lacatedral-text-top" variants={fadeDown}>
          <span className="lacatedral-tag">YENİ KONSER</span>
          <span className="lacatedral-tag-line" />
        </motion.div>

        {/* Left side — LA CATEDRAL title */}
        <motion.div className="lacatedral-text-left" variants={slideLeft}>
          <AnimatedText text="LA" className="lacatedral-big-text" />
          <AnimatedText text="CATEDRAL" className="lacatedral-big-text" />
        </motion.div>

        {/* Desktop: Poster card (hidden on mobile) */}
        <motion.div
          className="lacatedral-poster-wrap desktop-only"
          style={{ x: posterMoveX, y: posterMoveY, scale: posterScale }}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: {
              opacity: 1, scale: 1,
              transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          <div className="lacatedral-poster-glow" />
          <img src={posterImg} alt="La Catedral" className="lacatedral-poster-img" />
          <div className="lacatedral-poster-shine" />
          {/* Logos on poster bottom-left */}
          <motion.div className="lacatedral-poster-logos" variants={fadeUp}>
            <BubiletSvg className="lacatedral-logo lacatedral-logo-bubilet" />
            <img src={passoLogo} alt="Passo" className="lacatedral-logo" />
            <img src={kralpopLogo} alt="Kral Pop" className="lacatedral-logo lacatedral-logo-kralpop" />
          </motion.div>
        </motion.div>

        {/* Right side — date */}
        <motion.div className="lacatedral-text-right" variants={slideRight}>
          <motion.span className="lacatedral-big-date" variants={slideRight}>28.06</motion.span>
          <motion.span className="lacatedral-big-year" variants={slideRight}>2026</motion.span>
        </motion.div>

        {/* Bottom — venue + CTA */}
        <motion.div className="lacatedral-text-bottom" variants={fadeUp}>
          <motion.span className="lacatedral-venue" variants={fadeUp}>
            BEŞİKTAŞ TÜPRAŞ STADYUMU / İSTANBUL
          </motion.span>
          <motion.span className="lacatedral-senfoni" variants={fadeUp}>
            120 KİŞİLİK DEV SENFONİ
          </motion.span>
          <motion.a
            href="https://www.bubilet.com.tr"
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
