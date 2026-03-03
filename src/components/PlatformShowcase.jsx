import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import spotifyImg from '../assets/platform/spotify.png'
import youtubeImg from '../assets/platform/youtube.png'
import tiktokImg from '../assets/platform/tiktok.png'
import instagramImg from '../assets/platform/instagram.png'
import spotifyMobileImg from '../assets/platform/spotify_mobile.png'
import youtubeMobileImg from '../assets/platform/youtube_mobile.png'
import tiktokMobileImg from '../assets/platform/tiktok_mobile.png'
import instagramMobileImg from '../assets/platform/instagram_mobile.png'

const platforms = [
  {
    id: 'spotify',
    name: 'SPOTIFY',
    color: '#1DB954',
    img: spotifyImg,
    mobileImg: spotifyMobileImg,
    number: '2.9 MİLYAR+',
    label: 'Toplam Stream',
    desc: "Türkiye'de aylık 10M+ dinleyiciye ulaşan ilk sanatçı",
    url: 'https://open.spotify.com/artist/1GMwSpFzrLd12jUX15bHB6',
  },
  {
    id: 'youtube',
    name: 'YOUTUBE',
    color: '#FF0000',
    img: youtubeImg,
    mobileImg: youtubeMobileImg,
    number: '111 MİLYON+',
    label: 'Görüntülenme',
    desc: 'Resmi klipler kısa sürede milyonlarca izlenmeye ulaştı',
    url: 'https://www.youtube.com/@blok3real',
  },
  {
    id: 'tiktok',
    name: 'TIKTOK',
    color: '#00F2EA',
    img: tiktokImg,
    mobileImg: tiktokMobileImg,
    number: '2 MİLYAR+',
    label: 'Görüntülenme',
    desc: 'En viral Türkçe ses — organik erişim rekoru',
    url: 'https://www.tiktok.com/@blok3',
  },
  {
    id: 'instagram',
    name: 'INSTAGRAM',
    color: '#E1306C',
    img: instagramImg,
    mobileImg: instagramMobileImg,
    number: '486 MİLYON+',
    label: 'Reels İzlenme',
    desc: 'Sosyal medyada yüksek etkileşim ve viral yayılım',
    url: 'https://www.instagram.com/blok3.real/',
  },
]

/* Platform SVG icons */
function PlatformIcon({ id, size = 22, color }) {
  const fill = color || '#fff'
  switch (id) {
    case 'spotify':
      return (
        <svg viewBox="0 0 168 168" width={size} height={size}>
          <path fill={fill} d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.5 121.2c-1.5 2.5-4.7 3.2-7.1 1.7-19.5-11.9-44-14.6-72.9-8-2.8.6-5.6-1.1-6.2-3.9-.6-2.8 1.1-5.6 3.9-6.2 31.6-7.2 58.7-4.1 80.6 9.3 2.5 1.5 3.2 4.7 1.7 7.1zm10.3-22.9c-1.9 3.1-5.9 4-9 2.1-22.3-13.7-56.3-17.7-82.7-9.7-3.4 1-7.1-.9-8.1-4.3-1-3.4.9-7.1 4.3-8.1 30.1-9.1 67.5-4.7 93.1 11 3.1 1.9 4 5.9 2.4 9zm.9-23.8c-26.8-15.9-71-17.4-96.6-9.6-4.1 1.2-8.5-1.1-9.7-5.2-1.2-4.1 1.1-8.5 5.2-9.7 29.4-8.9 78.3-7.2 109.2 11.1 3.7 2.2 4.9 7 2.7 10.7-2.2 3.6-7 4.9-10.8 2.7z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill={fill} d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill={fill} d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill={fill} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    default:
      return null
  }
}

export default function PlatformShowcase({ containerRef, links = [], platformStats = [] }) {
  // Override hardcoded data with dynamic ones from API
  const dynamicPlatforms = platforms.map((p) => {
    const linkMatch = links.find((l) => l.platform === p.id)
    const statMatch = platformStats.find((s) => s.platform === p.id)
    return {
      ...p,
      ...(linkMatch ? { url: linkMatch.url } : {}),
      ...(statMatch ? { number: statMatch.number, label: statMatch.label, desc: statMatch.description } : {}),
    }
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const intervalRef = useRef(null)

  const goTo = useCallback((nextIndex) => {
    if (isGlitching) return
    setIsGlitching(true)
    setTimeout(() => {
      setActiveIndex(nextIndex)
    }, 150)
    setTimeout(() => {
      setIsGlitching(false)
    }, 300)
  }, [isGlitching])

  // Auto-cycle
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % dynamicPlatforms.length
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
        return next
      })
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const handleDotClick = (index) => {
    if (index === activeIndex) return
    clearInterval(intervalRef.current)
    goTo(index)
    // Restart auto-cycle
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % dynamicPlatforms.length
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
        return next
      })
    }, 4000)
  }

  const current = dynamicPlatforms[activeIndex]

  return (
    <section className="platform-showcase">
        {/* Background images — desktop */}
        {dynamicPlatforms.map((p, i) => (
          <img
            key={p.id}
            className={`platform-showcase-bg desktop-only${i === activeIndex ? ' active' : ''}`}
            src={p.img}
            alt={p.name}
          />
        ))}
        {/* Background images — mobile */}
        {dynamicPlatforms.map((p, i) => (
          <img
            key={`${p.id}-mobile`}
            className={`platform-showcase-bg mobile-only${i === activeIndex ? ' active' : ''}`}
            src={p.mobileImg}
            alt={p.name}
          />
        ))}

        {/* Glitch layer */}
        {isGlitching && (
          <div className="platform-glitch-layer">
            <img className="desktop-only" src={current.img} alt="" />
            <img className="mobile-only" src={current.mobileImg} alt="" />
          </div>
        )}

        {/* Dark overlay for text readability */}
        <div className="platform-showcase-overlay" />

        {/* Scanline effect */}
        <div className="platform-showcase-scanlines" />

        {/* Info — bottom right */}
        <div className="platform-showcase-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="platform-showcase-name" style={{ color: current.color }}>
                {current.name}
              </span>
              <h2 className="platform-showcase-number">{current.number}</h2>
              <span className="platform-showcase-label">{current.label}</span>
              <p className="platform-showcase-desc">{current.desc}</p>
              <a
                className="platform-showcase-btn"
                href={current.url}
                target="_blank"
                rel="noreferrer"
                style={{ borderColor: current.color, color: current.color }}
              >
                {current.name}&rsquo;da Dinle
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="platform-showcase-progress">
          {dynamicPlatforms.map((p, i) => (
            <div key={p.id} className={`platform-progress-bar${i === activeIndex ? ' active' : ''}`}>
              {i === activeIndex && (
                <motion.div
                  className="platform-progress-fill"
                  style={{ background: p.color }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 4, ease: 'linear' }}
                  key={`${p.id}-${activeIndex}`}
                />
              )}
            </div>
          ))}
        </div>
    </section>
  )
}
