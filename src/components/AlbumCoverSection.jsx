import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
// Katmanlar — fal smart-resize + qwen layer çıktıları (görsel işlenince doldurulacak)
import albumBg from '../assets/album/kayip_persona_bg.jpg'           // geniş arka plan (koyu zemin)
import albumFront from '../assets/album/kayip_persona_front.png'      // ön katman (melek + mumlar, şeffaf)
import albumBgMobile from '../assets/album/kayip_persona_bg_mobile.jpg'
import albumFrontMobile from '../assets/album/kayip_persona_front_mobile.png'

const springConfig = { damping: 28, stiffness: 140, mass: 0.6 }

// Albüm: "Kayıp Persona" — tüm parçalar albüm sayfasına gider
const ALBUM_URL = 'https://open.spotify.com/album/0gWJ1CcNLmXTdlgT8e9QRp'

const TRACKS = [
  'Kayıp Kalp',
  'Sebebi Yar',
  'Baba',
  'Kırgınım',
  'Değiştiremezsin Yazılmışsa',
  'Son Bi Dans',
  'Sakin Ol Champ',
  'Çok Güzel Gülüyorsun (feat. Poizi)',
  'Allah Allah?',
  'Her Gece',
]

export default function AlbumCoverSection({ containerRef }) {
  const sectionRef = useRef(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
    ...(containerRef ? { container: containerRef } : {}),
  })
  const bgY = useTransform(scrollYProgress, [0, 0.5, 1], ['8%', '0%', '-8%'])
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.15])
  const frontY = useTransform(scrollYProgress, [0, 0.5, 1], ['4%', '0%', '-6%'])
  const titleOp = useTransform(scrollYProgress, [0.05, 0.2, 0.85, 1], [0, 1, 1, 0])

  // Mouse parallax (desktop)
  const frontX = useSpring(useMotionValue(0), springConfig)
  const frontMX = useSpring(useMotionValue(0), springConfig)
  const bgMX = useSpring(useMotionValue(0), springConfig)

  const handleMouseMove = (e) => {
    if (isMobile) return
    const r = sectionRef.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    frontX.set(nx * -28)
    frontMX.set(ny * -18)
    bgMX.set(nx * 14)
  }

  return (
    <section
      ref={sectionRef}
      className="album-cover-section"
      onMouseMove={handleMouseMove}
    >
      {/* Arka katman — koyu zemin, hafif zoom + parallax */}
      <motion.div
        className="album-bg"
        style={{
          backgroundImage: `url(${isMobile ? albumBgMobile : albumBg})`,
          y: bgY,
          scale: bgScale,
          x: bgMX,
        }}
      />
      <div className="album-vignette" />

      {/* Mobil: başlık front resmin ARKASINDA (behind-image efekti) */}
      {isMobile && <h2 className="album-title-behind">Kayıp Persona</h2>}

      {/* Ön katman — masa + figürler. Mobilde de desktop front kullanılır */}
      <motion.img
        src={albumFront}
        alt="Kayıp Persona"
        className="album-front"
        style={{ y: frontY, x: frontX, translateY: frontMX, scale: isMobile ? 1.02 : 2.05, transformOrigin: 'center center' }}
        draggable={false}
      />

      {/* Başlık + şarkı listesi */}
      <motion.div className="album-content" style={{ opacity: titleOp }}>
        <div className="album-heading">
          <span className="album-kicker">YENİ ALBÜM</span>
          <h2 className="album-title">Kayıp Persona</h2>
        </div>

        <ol className="album-tracklist" data-count={TRACKS.length}>
          {TRACKS.map((t, i) => (
            <li key={t} className="album-track">
              <a
                href={ALBUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="album-track-link"
              >
                <span className="album-track-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="album-track-name">{t}</span>
                <svg className="album-track-spotify" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.63.63 0 0 1-.28-1.22c3.82-.87 7.09-.5 9.72 1.11.3.18.39.57.21.86Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.64-1.1 8.16-.56 11.24 1.33.37.22.49.71.25 1.07Zm.11-2.84C14.8 8.97 9.3 8.79 6.16 9.74a.94.94 0 1 1-.54-1.8c3.6-1.09 9.68-.88 13.49 1.39a.94.94 0 0 1-.96 1.62Z" />
                </svg>
              </a>
            </li>
          ))}
        </ol>

        <a
          href={ALBUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="album-cta"
        >
          <svg className="album-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.63.63 0 0 1-.28-1.22c3.82-.87 7.09-.5 9.72 1.11.3.18.39.57.21.86Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.64-1.1 8.16-.56 11.24 1.33.37.22.49.71.25 1.07Zm.11-2.84C14.8 8.97 9.3 8.79 6.16 9.74a.94.94 0 1 1-.54-1.8c3.6-1.09 9.68-.88 13.49 1.39a.94.94 0 0 1-.96 1.62Z" />
          </svg>
          Spotify'da Dinle
        </a>
      </motion.div>
    </section>
  )
}
