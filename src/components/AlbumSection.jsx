import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/* Import all frames eagerly & sort by filename */
const frameModules = import.meta.glob('../assets/frames_1/frame_*.jpg', { eager: true, import: 'default' })
const frameSrcs = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key])

const TOTAL_FRAMES = frameSrcs.length

export default function AlbumSection({ containerRef }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const [loaded, setLoaded] = useState(false)

  // Preload all images
  useEffect(() => {
    let cancelled = false
    const imgs = []
    let loadedCount = 0

    frameSrcs.forEach((src, i) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedCount++
        if (!cancelled && loadedCount === TOTAL_FRAMES) {
          imagesRef.current = imgs
          setLoaded(true)
        }
      }
      imgs[i] = img
    })

    return () => { cancelled = true }
  }, [])

  // Draw frame on canvas
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    const images = imagesRef.current
    if (!canvas || !images.length) return

    const ctx = canvas.getContext('2d')
    const img = images[index]
    if (!img) return

    // Set canvas size to match image on first draw
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
  }, [])

  // Draw first frame when loaded
  useEffect(() => {
    if (loaded) drawFrame(0)
  }, [loaded, drawFrame])

  // Scroll-driven frame index
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  useMotionValueEvent(frameIndex, 'change', (v) => {
    if (loaded) drawFrame(Math.round(v))
  })

  // Scroll-driven opacity for song info
  const infoOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.85, 0.92], [0, 0, 1, 1, 0])
  const song1Y = useTransform(scrollYProgress, [0, 0.08, 0.18], [40, 40, 0])
  const song2Y = useTransform(scrollYProgress, [0, 0.12, 0.22], [40, 40, 0])

  return (
    <section ref={sectionRef} className="album-section">
      <div className="album-sticky">
        <canvas ref={canvasRef} className="album-canvas" />

        <motion.div className="album-info" style={{ opacity: infoOpacity }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: song1Y }}>
              <span className="album-song-num">01</span>
              <span className="album-song-name">GİT</span>
            </motion.div>
            <motion.div className="album-song" style={{ y: song2Y }}>
              <span className="album-song-num">02</span>
              <span className="album-song-name">NAPIYOSUN MESELA?</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
