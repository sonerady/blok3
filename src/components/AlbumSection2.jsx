import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/* Import all frames eagerly & sort by filename */
const frameModules = import.meta.glob('../assets/frames_3/frame_*.jpg', { eager: true, import: 'default' })
const frameSrcs = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key])

const TOTAL_FRAMES = frameSrcs.length

export default function AlbumSection2({ containerRef }) {
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

  // Scroll: offset starts from 'start end' so animation begins before section reaches top
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  // First 25% of scroll = slide in from left, remaining 75% = frame animation
  const slideX = useTransform(scrollYProgress, [0, 0.25], ['-100%', '0%'])
  const frameIndex = useTransform(scrollYProgress, [0.25, 1], [0, TOTAL_FRAMES - 1])

  useMotionValueEvent(frameIndex, 'change', (v) => {
    if (loaded) drawFrame(Math.max(0, Math.round(v)))
  })

  // Song info
  const infoOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.85, 0.93], [0, 1, 1, 0])
  const songY = useTransform(scrollYProgress, [0.25, 0.35], [30, 0])

  return (
    <section ref={sectionRef} className="album-section-2">
      <div className="album-sticky">
        <motion.div className="album-slide-inner" style={{ x: slideX }}>
          <canvas ref={canvasRef} className="album-canvas" />

          <motion.div className="album-info" style={{ opacity: infoOpacity }}>
            <div className="album-info-label">ALBÜM</div>
            <div className="album-info-line" />
            <div className="album-songs">
              <motion.div className="album-song" style={{ y: songY }}>
                <span className="album-song-name">SEVMEYİ DENEMEDİN</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
