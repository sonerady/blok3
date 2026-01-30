import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import heroVideo from '../assets/home_backgorund_video.mp4'
import heroFront from '../assets/video_front.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

export default function HeroSection({ containerRef }) {
  const sectionRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  // === TITLE scroll transforms (delayed start at 0.25) ===
  const titleScale = useTransform(scrollYProgress, [0.25, 0.55], [1, 3])
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.45], [1, 0])
  const titleScrollY = useTransform(scrollYProgress, [0.25, 0.6], [0, -100])
  const titleBlur = useTransform(scrollYProgress, [0.25, 0.45], [0, 15])
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`)

  // === FRONT PNG scroll transforms (delayed start at 0.25) ===
  const frontScale = useTransform(scrollYProgress, [0.25, 0.6, 1], [1, 2.5, 5])
  const frontBlur = useTransform(scrollYProgress, [0.25, 0.55, 0.85], [0, 8, 30])
  const frontFilter = useTransform(frontBlur, (v) => `blur(${v}px)`)
  const frontOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0])

  // === VIDEO scroll transforms (delayed start at 0.25) ===
  const videoBlur = useTransform(scrollYProgress, [0.25, 0.5, 0.8], [0, 5, 25])
  const videoFilter = useTransform(videoBlur, (v) => `blur(${v}px)`)
  const videoOpacity = useTransform(scrollYProgress, [0.55, 0.85], [1, 0])

  // === WHITE OVERLAY ===
  const whiteOverlayOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1])

  // === BURADASIN TEXT ===
  const buradasinOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1])
  const buradasinY = useTransform(scrollYProgress, [0.85, 1], [30, 0])

  // Mouse parallax (front moves opposite, title moves with)
  const frontX = useSpring(useTransform(mouseX, (v) => v * -40), springConfig)
  const frontY = useSpring(useTransform(mouseY, (v) => v * -40), springConfig)
  const titleX = useSpring(useTransform(mouseX, (v) => v * 25), springConfig)
  const titleMouseY = useSpring(useTransform(mouseY, (v) => v * 25), springConfig)

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    mouseX.set((e.clientX - centerX) / centerX)
    mouseY.set((e.clientY - centerY) / centerY)
  }

  return (
    <section ref={sectionRef} className="hero-section" onMouseMove={handleMouseMove}>
      <div className="hero-content-wrapper">
        {/* Video */}
        <motion.video
          className="hero-video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: videoFilter, opacity: videoOpacity }}
        />

        {/* Front PNG — zoom into the "O" */}
        <motion.img
          className="hero-front"
          src={heroFront}
          alt=""
          style={{
            x: frontX,
            y: frontY,
            scale: frontScale,
            filter: frontFilter,
            opacity: frontOpacity,
            transformOrigin: '58% 45%',
          }}
        />

        {/* Title */}
        <motion.h1
          className="hero-title"
          style={{
            scale: titleScale,
            opacity: titleOpacity,
            y: titleScrollY,
            x: titleX,
            translateY: titleMouseY,
            filter: titleFilter,
            transformOrigin: '55% 50%',
          }}
        >
          BLOK3
        </motion.h1>

        {/* White overlay — fades in as portal completes */}
        <motion.div
          className="hero-white-overlay"
          style={{ opacity: whiteOverlayOpacity }}
        >
          <motion.h2
            className="buradasin-text"
            style={{ opacity: buradasinOpacity, y: buradasinY }}
          >
            buradasın
          </motion.h2>
        </motion.div>
      </div>
    </section>
  )
}
