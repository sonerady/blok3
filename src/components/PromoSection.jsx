import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion'
import fallbackDesktop from '../assets/poster.jpg'
import fallbackMobile from '../assets/poster_mobile.jpg'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

// İçerik dashboard'dan gelir (blok3_promo_section); API boşsa yerel poster + varsayılan metinler.
export default function PromoSection({ containerRef, data }) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const active = data && data.is_active !== false ? data : null
  const desktopImg = (active && active.desktop_image_url) || fallbackDesktop
  const mobileImg = (active && active.mobile_image_url) || fallbackMobile
  const buttonText = (active && active.button_text) || 'Keşfet'
  const buttonUrl = (active && active.button_url) || 'https://www.bubilet.com.tr/sanatci/blok3-'

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 0.5, 1], ['15%', '0%', '-15%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.15])
  const mobileBgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.1])

  // Mouse-based parallax (desktop only)
  const bgMoveX = useSpring(useMotionValue(0), springConfig)

  const handleMouseMove = (e) => {
    if (isMobile) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const nx = (e.clientX - cx) / (rect.width / 2)
    bgMoveX.set(nx * 6)
  }

  return (
    <section
      ref={sectionRef}
      className="promo-section"
      onMouseMove={handleMouseMove}
    >
      {/* Desktop: poster bg */}
      <motion.div
        className="promo-bg desktop-only"
        style={{
          y: bgY,
          scale: bgScale,
          x: bgMoveX,
          backgroundImage: `url(${desktopImg})`,
        }}
      />

      {/* Mobile: full-screen poster as background */}
      <motion.div
        className="promo-mobile-bg mobile-only"
        style={{
          y: bgY,
          scale: mobileBgScale,
        }}
      >
        <img src={mobileImg} alt="" className="promo-mobile-bg-img" />
      </motion.div>

      <div className="promo-bg-overlay" />
      <div className="promo-grain" />

      {/* Center layout */}
      <motion.div
        className="promo-center"
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
        }}
      >
        {/* Bottom — CTA */}
        <motion.div className="promo-text-bottom" variants={fadeUp}>
          <motion.a
            href={buttonUrl}
            target="_blank"
            rel="noreferrer"
            className="promo-cta-btn"
            variants={fadeUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="promo-cta-shine" />
            <span className="promo-cta-label">{buttonText}</span>
            <svg className="promo-cta-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Particles */}
      <div className="promo-particles">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="promo-particle"
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
