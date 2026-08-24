import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
// Katmanlar — fal smart-resize + qwen layer çıktıları (görsel işlenince doldurulacak)
import albumBg from '../assets/album/kayip_persona_bg.webp'           // geniş arka plan (koyu zemin)
import albumFront from '../assets/album/kayip_persona_front.webp'      // ön katman (melek + mumlar, şeffaf)
import albumBgMobile from '../assets/album/kayip_persona_bg_mobile.webp'
import albumFrontMobile from '../assets/album/kayip_persona_front_mobile.webp'

const springConfig = { damping: 28, stiffness: 140, mass: 0.6 }

// Albüm: "Kayıp Persona" — tüm parçalar albüm sayfasına gider
const ALBUM_URL = 'https://open.spotify.com/album/0gWJ1CcNLmXTdlgT8e9QRp'
const YOUTUBE_URL = 'https://www.youtube.com/channel/UCJUNWGsVf__EuL51xydR7ag'
const APPLE_MUSIC_URL = 'https://music.apple.com/tr/artist/blok3/1633245914'

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
              </a>
            </li>
          ))}
        </ol>
      </motion.div>

      <div className="album-cta-group">
          <a
            href={ALBUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="album-cta album-cta-spotify"
            aria-label="Spotify'da Dinle"
          >
            <svg className="album-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.63.63 0 0 1-.28-1.22c3.82-.87 7.09-.5 9.72 1.11.3.18.39.57.21.86Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.64-1.1 8.16-.56 11.24 1.33.37.22.49.71.25 1.07Zm.11-2.84C14.8 8.97 9.3 8.79 6.16 9.74a.94.94 0 1 1-.54-1.8c3.6-1.09 9.68-.88 13.49 1.39a.94.94 0 0 1-.96 1.62Z" />
            </svg>
            <span className="album-cta-text">Spotify</span>
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="album-cta album-cta-youtube"
            aria-label="YouTube'da Dinle"
          >
            <svg className="album-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="album-cta-text">YouTube</span>
          </a>
          <a
            href={APPLE_MUSIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="album-cta album-cta-apple"
            aria-label="Apple Music'te Dinle"
          >
            <svg className="album-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.665 16.811a10.316 10.316 0 0 1-1.021 1.837c-.537.767-.978 1.297-1.316 1.592-.525.482-1.089.73-1.692.744-.432 0-.954-.123-1.562-.373-.61-.249-1.17-.371-1.683-.371-.537 0-1.113.122-1.73.371-.616.25-1.114.381-1.495.393-.578.025-1.156-.229-1.732-.764-.367-.32-.826-.87-1.377-1.648-.59-.829-1.075-1.794-1.455-2.891-.407-1.187-.611-2.335-.611-3.447 0-1.273.275-2.372.826-3.292a4.857 4.857 0 0 1 1.73-1.751 4.65 4.65 0 0 1 2.34-.662c.46 0 1.063.142 1.81.422s1.227.422 1.436.422c.158 0 .686-.167 1.582-.498.848-.307 1.563-.434 2.149-.385 1.587.128 2.78.753 3.575 1.881-1.418.86-2.12 2.063-2.106 3.61.013 1.207.452 2.211 1.314 3.008.391.371.825.659 1.31.866-.105.305-.216.598-.336.879zM15.998 2.38c0 .95-.348 1.838-1.04 2.659-.836.976-1.846 1.541-2.941 1.452a2.95 2.95 0 0 1-.022-.36c0-.913.396-1.889 1.103-2.688.353-.404.802-.741 1.347-1.011.543-.266 1.058-.413 1.541-.44.014.13.02.26.02.388z" />
            </svg>
            <span className="album-cta-text">Apple Music</span>
          </a>
      </div>
    </section>
  )
}
