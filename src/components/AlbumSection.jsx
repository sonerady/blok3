import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/* Import frames — order: 1, 3, 2 */
const f1Mods = import.meta.glob('../assets/frames_1/frame_*.jpg', { eager: true, import: 'default' })
const f1Srcs = Object.keys(f1Mods).sort().map((k) => f1Mods[k])
const T1 = f1Srcs.length

const f3Mods = import.meta.glob('../assets/frames_3/frame_*.jpg', { eager: true, import: 'default' })
const f3Srcs = Object.keys(f3Mods).sort().map((k) => f3Mods[k])
const T3 = f3Srcs.length

const f2Mods = import.meta.glob('../assets/frames_2/frame_*.jpg', { eager: true, import: 'default' })
const f2Srcs = Object.keys(f2Mods).sort().map((k) => f2Mods[k])
const T2 = f2Srcs.length

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
  const c1 = useRef(null)
  const c2 = useRef(null)
  const c3 = useRef(null)

  const { imagesRef: i1, loaded: l1 } = useFrames(f1Srcs)
  const { imagesRef: i3, loaded: l3 } = useFrames(f3Srcs)
  const { imagesRef: i2, loaded: l2 } = useFrames(f2Srcs)

  const draw = useCallback((ref, imgs, idx) => {
    const canvas = ref.current
    const images = imgs.current
    if (!canvas || !images.length) return
    const ctx = canvas.getContext('2d')
    const img = images[idx]
    if (!img) return
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
  }, [])

  useEffect(() => { if (l1) draw(c1, i1, 0) }, [l1, draw, i1])
  useEffect(() => { if (l3) draw(c2, i3, 0) }, [l3, draw, i3])
  useEffect(() => { if (l2) draw(c3, i2, 0) }, [l2, draw, i2])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  /*
    Timeline (scroll 0→1) — 3 albums, order 1→3→2:
    0.00–0.28  frames_1 plays
    0.28–0.35  crossfade 1→3
    0.35–0.60  frames_3 plays
    0.60–0.67  crossfade 3→2
    0.67–0.95  frames_2 plays
    0.95–1.00  fade out
  */
  const idx1 = useTransform(scrollYProgress, [0, 0.28], [0, T1 - 1])
  const idx3 = useTransform(scrollYProgress, [0.35, 0.60], [0, T3 - 1])
  const idx2 = useTransform(scrollYProgress, [0.67, 0.95], [0, T2 - 1])

  const op1 = useTransform(scrollYProgress, [0, 0.28, 0.35], [1, 1, 0])
  const op3 = useTransform(scrollYProgress, [0.28, 0.35, 0.60, 0.67], [0, 1, 1, 0])
  const op2 = useTransform(scrollYProgress, [0.60, 0.67, 0.95, 1], [0, 1, 1, 0])

  // Song info — frames_1
  const info1Op = useTransform(scrollYProgress, [0.02, 0.06, 0.24, 0.30], [0, 1, 1, 0])
  const s1aY = useTransform(scrollYProgress, [0.02, 0.08], [40, 0])
  const s1bY = useTransform(scrollYProgress, [0.04, 0.10], [40, 0])

  // Song info — frames_3
  const info3Op = useTransform(scrollYProgress, [0.36, 0.40, 0.56, 0.62], [0, 1, 1, 0])
  const s3Y = useTransform(scrollYProgress, [0.36, 0.42], [30, 0])

  // Song info — frames_2
  const info2Op = useTransform(scrollYProgress, [0.68, 0.72, 0.90, 0.96], [0, 1, 1, 0])
  const s2Y = useTransform(scrollYProgress, [0.68, 0.74], [30, 0])

  useMotionValueEvent(idx1, 'change', (v) => { if (l1) draw(c1, i1, Math.round(v)) })
  useMotionValueEvent(idx3, 'change', (v) => { if (l3) draw(c2, i3, Math.max(0, Math.round(v))) })
  useMotionValueEvent(idx2, 'change', (v) => { if (l2) draw(c3, i2, Math.max(0, Math.round(v))) })

  return (
    <section ref={sectionRef} className="album-section">
      <div className="album-sticky">
        <motion.canvas ref={c1} className="album-canvas" style={{ opacity: op1 }} />
        <motion.canvas ref={c2} className="album-canvas album-canvas-2" style={{ opacity: op3 }} />
        <motion.canvas ref={c3} className="album-canvas album-canvas-2" style={{ opacity: op2 }} />

        {/* Info — frames_1 */}
        <motion.div className="album-info" style={{ opacity: info1Op }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: s1aY }}>
              <span className="album-song-num">01</span>
              <span className="album-song-name">GİT</span>
            </motion.div>
            <motion.div className="album-song" style={{ y: s1bY }}>
              <span className="album-song-num">02</span>
              <span className="album-song-name">NAPIYOSUN MESELA?</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Info — frames_3 */}
        <motion.div className="album-info" style={{ opacity: info3Op }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: s3Y }}>
              <span className="album-song-name">SEVMEYİ DENEMEDİN</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Info — frames_2 */}
        <motion.div className="album-info" style={{ opacity: info2Op }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: s2Y }}>
              <span className="album-song-name">FRAMES 2</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
