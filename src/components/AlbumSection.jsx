import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/* Import frames_1 */
const frame1Modules = import.meta.glob('../assets/frames_1/frame_*.jpg', { eager: true, import: 'default' })
const frame1Srcs = Object.keys(frame1Modules).sort().map((k) => frame1Modules[k])
const TOTAL_1 = frame1Srcs.length

/* Import frames_3 */
const frame3Modules = import.meta.glob('../assets/frames_3/frame_*.jpg', { eager: true, import: 'default' })
const frame3Srcs = Object.keys(frame3Modules).sort().map((k) => frame3Modules[k])
const TOTAL_3 = frame3Srcs.length

function useFrames(srcs) {
  const imagesRef = useRef([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    const imgs = []
    let count = 0
    const total = srcs.length

    srcs.forEach((src, i) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        count++
        if (!cancelled && count === total) {
          imagesRef.current = imgs
          setLoaded(true)
        }
      }
      imgs[i] = img
    })

    return () => { cancelled = true }
  }, [srcs])

  return { imagesRef, loaded }
}

export default function AlbumSection({ containerRef }) {
  const sectionRef = useRef(null)
  const canvas1Ref = useRef(null)
  const canvas2Ref = useRef(null)

  const { imagesRef: imgs1, loaded: loaded1 } = useFrames(frame1Srcs)
  const { imagesRef: imgs2, loaded: loaded2 } = useFrames(frame3Srcs)

  const drawFrame = useCallback((canvasRef, imagesRef, index) => {
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

  // Draw first frames
  useEffect(() => { if (loaded1) drawFrame(canvas1Ref, imgs1, 0) }, [loaded1, drawFrame, imgs1])
  useEffect(() => { if (loaded2) drawFrame(canvas2Ref, imgs2, 0) }, [loaded2, drawFrame, imgs2])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  /*
    Timeline (scroll 0→1):
    0.00–0.40  frames_1 plays
    0.40–0.50  crossfade (frames_1 fades out, frames_3 fades in)
    0.50–0.90  frames_3 plays
    0.90–1.00  fade out
  */
  const frame1Index = useTransform(scrollYProgress, [0, 0.40], [0, TOTAL_1 - 1])
  const frame3Index = useTransform(scrollYProgress, [0.50, 0.90], [0, TOTAL_3 - 1])

  const canvas1Opacity = useTransform(scrollYProgress, [0, 0.40, 0.50], [1, 1, 0])
  const canvas2Opacity = useTransform(scrollYProgress, [0.40, 0.50, 0.90, 1], [0, 1, 1, 0])

  // Song info for frames_1
  const info1Opacity = useTransform(scrollYProgress, [0.02, 0.08, 0.35, 0.42], [0, 1, 1, 0])
  const song1aY = useTransform(scrollYProgress, [0.02, 0.1], [40, 0])
  const song1bY = useTransform(scrollYProgress, [0.05, 0.13], [40, 0])

  // Song info for frames_3
  const info2Opacity = useTransform(scrollYProgress, [0.50, 0.56, 0.82, 0.88], [0, 1, 1, 0])
  const song2Y = useTransform(scrollYProgress, [0.50, 0.58], [30, 0])

  useMotionValueEvent(frame1Index, 'change', (v) => {
    if (loaded1) drawFrame(canvas1Ref, imgs1, Math.round(v))
  })

  useMotionValueEvent(frame3Index, 'change', (v) => {
    if (loaded2) drawFrame(canvas2Ref, imgs2, Math.max(0, Math.round(v)))
  })

  return (
    <section ref={sectionRef} className="album-section">
      <div className="album-sticky">
        {/* Canvas 1 — frames_1 */}
        <motion.canvas ref={canvas1Ref} className="album-canvas" style={{ opacity: canvas1Opacity }} />

        {/* Canvas 2 — frames_3 */}
        <motion.canvas ref={canvas2Ref} className="album-canvas album-canvas-2" style={{ opacity: canvas2Opacity }} />

        {/* Info — frames_1 */}
        <motion.div className="album-info" style={{ opacity: info1Opacity }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: song1aY }}>
              <span className="album-song-num">01</span>
              <span className="album-song-name">GİT</span>
            </motion.div>
            <motion.div className="album-song" style={{ y: song1bY }}>
              <span className="album-song-num">02</span>
              <span className="album-song-name">NAPIYOSUN MESELA?</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Info — frames_3 */}
        <motion.div className="album-info" style={{ opacity: info2Opacity }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: song2Y }}>
              <span className="album-song-name">SEVMEYİ DENEMEDİN</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
