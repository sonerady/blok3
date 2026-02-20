import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/* Import frames — order: 1, 2, 6, 3 */
const f1Mods = import.meta.glob('../assets/frames_1/frame_*.jpg', { eager: true, import: 'default' })
const f1Srcs = Object.keys(f1Mods).sort().map((k) => f1Mods[k])

const f1MobileMods = import.meta.glob('../assets/frames_1_mobile/frame_*.jpg', { eager: true, import: 'default' })
const f1MobileSrcs = Object.keys(f1MobileMods).sort().map((k) => f1MobileMods[k])

const f2Mods = import.meta.glob('../assets/frames_2/frame_*.jpg', { eager: true, import: 'default' })
const f2Srcs = Object.keys(f2Mods).sort().map((k) => f2Mods[k])
const T2 = f2Srcs.length

const f6Mods = import.meta.glob('../assets/frames_6/frame_*.jpg', { eager: true, import: 'default' })
const f6Srcs = Object.keys(f6Mods).sort().map((k) => f6Mods[k])
const T6 = f6Srcs.length

const f3Mods = import.meta.glob('../assets/frames_3/frame_*.jpg', { eager: true, import: 'default' })
const f3Srcs = Object.keys(f3Mods).sort().map((k) => f3Mods[k])
const T3 = f3Srcs.length

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

export default function AlbumSection({ containerRef, onDarkChange }) {
  const sectionRef = useRef(null)
  const c1 = useRef(null)
  const c2 = useRef(null)
  const c6 = useRef(null)
  const c3 = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const activeF1Srcs = isMobile ? f1MobileSrcs : f1Srcs
  const T1 = activeF1Srcs.length
  const { imagesRef: i1, loaded: l1 } = useFrames(activeF1Srcs)
  const { imagesRef: i2, loaded: l2 } = useFrames(f2Srcs)
  const { imagesRef: i6, loaded: l6 } = useFrames(f6Srcs)
  const { imagesRef: i3, loaded: l3 } = useFrames(f3Srcs)

  const draw = useCallback((ref, imgs, idx, bgColor = '#fff', offsetY = 0) => {
    const canvas = ref.current
    const images = imgs.current
    if (!canvas || !images.length) return
    const ctx = canvas.getContext('2d')
    const img = images[idx]
    if (!img) return

    if (isMobile) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      canvas.width = vw
      canvas.height = vh
      const scale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight) * 0.85
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      const dx = (vw - dw) / 2
      const dy = (vh - dh) / 2 + offsetY
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, vw, vh)
      ctx.drawImage(img, dx, dy, dw, dh)
    } else {
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }, [])

  useEffect(() => { if (l1) draw(c1, i1, 0) }, [l1, draw, i1])
  useEffect(() => { if (l2) draw(c2, i2, 0, '#000', -40) }, [l2, draw, i2])
  useEffect(() => { if (l6) draw(c6, i6, 0) }, [l6, draw, i6])
  useEffect(() => { if (l3) draw(c3, i3, 0) }, [l3, draw, i3])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  /*
    Timeline (scroll 0→1) — 4 albums, order 1→2→6→3:
    0.00–0.20  frames_1 plays
    0.20–0.25  crossfade 1→2
    0.25–0.45  frames_2 plays
    0.45–0.50  crossfade 2→6
    0.50–0.70  frames_6 plays
    0.70–0.75  crossfade 6→3
    0.75–0.95  frames_3 plays
    0.95–1.00  fade out
  */
  const idx1 = useTransform(scrollYProgress, [0, 0.20], [0, T1 - 1])
  const idx2 = useTransform(scrollYProgress, [0.25, 0.45], [0, T2 - 1])
  const idx6 = useTransform(scrollYProgress, [0.50, 0.70], [0, T6 - 1])
  const idx3 = useTransform(scrollYProgress, [0.75, 0.95], [0, T3 - 1])

  const op1 = useTransform(scrollYProgress, [0, 0.20, 0.25], [1, 1, 0])
  const op2 = useTransform(scrollYProgress, [0.20, 0.25, 0.45, 0.50], [0, 1, 1, 0])
  const op6 = useTransform(scrollYProgress, [0.45, 0.50, 0.70, 0.75], [0, 1, 1, 0])
  const op3 = useTransform(scrollYProgress, [0.70, 0.75, 0.95, 1], [0, 1, 1, 0])

  // Song info — frames_1
  const info1Op = useTransform(scrollYProgress, [0.02, 0.05, 0.17, 0.22], [0, 1, 1, 0])
  const s1aY = useTransform(scrollYProgress, [0.02, 0.06], [40, 0])
  const s1bY = useTransform(scrollYProgress, [0.03, 0.07], [40, 0])

  // Song info — frames_2
  const info2Op = useTransform(scrollYProgress, [0.26, 0.30, 0.42, 0.47], [0, 1, 1, 0])
  const s2Y = useTransform(scrollYProgress, [0.26, 0.32], [30, 0])

  // Song info — frames_6
  const info6Op = useTransform(scrollYProgress, [0.51, 0.55, 0.67, 0.72], [0, 1, 1, 0])
  const s6Y = useTransform(scrollYProgress, [0.51, 0.57], [30, 0])

  // Song info — frames_3
  const info3Op = useTransform(scrollYProgress, [0.76, 0.80, 0.92, 0.97], [0, 1, 1, 0])
  const s3Y = useTransform(scrollYProgress, [0.76, 0.82], [30, 0])

  useMotionValueEvent(idx1, 'change', (v) => { if (l1) draw(c1, i1, Math.round(v)) })
  useMotionValueEvent(idx2, 'change', (v) => { if (l2) draw(c2, i2, Math.max(0, Math.round(v)), '#000', -40) })
  useMotionValueEvent(idx6, 'change', (v) => { if (l6) draw(c6, i6, Math.max(0, Math.round(v))) })
  useMotionValueEvent(idx3, 'change', (v) => { if (l3) draw(c3, i3, Math.max(0, Math.round(v))) })

  // Track when frames_2 is active (dark background) and notify parent
  const [isDark, setIsDark] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const dark = v >= 0.20 && v < 0.50
    setIsDark(dark)
    if (onDarkChange) onDarkChange(dark)
  })

  return (
    <section ref={sectionRef} className="album-section">
      <div className={`album-sticky${isDark ? ' album-sticky-dark' : ''}`}>
        <motion.canvas ref={c1} className="album-canvas" style={{ opacity: op1 }} />
        <motion.canvas ref={c2} className="album-canvas album-canvas-2" style={{ opacity: op2 }} />
        <motion.canvas ref={c6} className="album-canvas album-canvas-2" style={{ opacity: op6 }} />
        <motion.canvas ref={c3} className="album-canvas album-canvas-2" style={{ opacity: op3 }} />

        {/* Section title — mobile */}
        <div className={`album-section-title${isDark ? ' dark' : ''}`}>ÖNE ÇIKAN PARÇALAR</div>

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

        {/* Info — frames_2 */}
        <motion.div className="album-info" style={{ opacity: info2Op }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: s2Y }}>
              <span className="album-song-name">KUSURA BAKMA</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Info — frames_6 */}
        <motion.div className="album-info" style={{ opacity: info6Op }}>
          <div className="album-info-label">ALBÜM</div>
          <div className="album-info-line" />
          <div className="album-songs">
            <motion.div className="album-song" style={{ y: s6Y }}>
              <span className="album-song-name">GELME İSTEMEM</span>
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
      </div>
    </section>
  )
}
