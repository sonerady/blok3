import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import gitCover from '../assets/ALBUMS/git.png'
import kusuraBakmaCover from '../assets/ALBUMS/kusura_bakma.png'
import sevmeyiDenemedinCover from '../assets/ALBUMS/sevmeyi_denemedin.png'
import yaptiricazCover from '../assets/ALBUMS/yaptırıcaz_tırnaklarını.png'

const songs = [
  {
    title: 'YAPTIRICAZ TIRNAKLARINI',
    artist: 'BLOK3',
    cover: yaptiricazCover,
    playerCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f9/96/2d/f9962d3d-1417-39fd-8390-00dc462632e6/cover.jpg/600x600bb.jpg',
    duration: '2:48',
    current: '1:24',
    progress: 50,
  },
  {
    title: 'GİT',
    artist: 'BLOK3',
    subtitle: 'Virtüöz, EP',
    cover: gitCover,
    playerCover: 'https://i.scdn.co/image/ab67616d0000b273e25c4335171904f5a6c2e2ce',
    duration: '3:12',
    current: '1:55',
    progress: 60,
  },
  {
    title: 'KUSURA BAKMA',
    artist: 'BLOK3',
    cover: kusuraBakmaCover,
    playerCover: 'https://i.scdn.co/image/ab67616d0000b27333f51b5590a571fef62c26bc',
    duration: '3:22',
    current: '2:10',
    progress: 64,
  },
  {
    title: 'SEVMEYİ DENEMEDİN',
    artist: 'BLOK3',
    subtitle: 'Obsesif, Albüm',
    cover: sevmeyiDenemedinCover,
    playerCover: 'https://i.scdn.co/image/ab67616d0000b27324d60e8a761684a09973719f',
    duration: '3:45',
    current: '1:38',
    progress: 44,
  },
]

function GalleryImage({ song, index, scrollYProgress, total }) {
  const segmentSize = 1 / total
  const start = index * segmentSize
  const end = (index + 1) * segmentSize
  const isFirst = index === 0
  const [isVisible, setIsVisible] = useState(isFirst)

  // First album starts fully visible, others fade in
  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, end - segmentSize * 0.05, end]
      : [Math.max(0, start - segmentSize * 0.05), start, end - segmentSize * 0.05, end],
    isFirst
      ? [1, 1, 0]
      : [0, 1, 1, 0]
  )

  const scale = useTransform(scrollYProgress, [start, end], [1.05, 1.15])

  const titleOpacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, end - segmentSize * 0.05, end]
      : [Math.max(0, start - segmentSize * 0.05), start, end - segmentSize * 0.05, end],
    isFirst
      ? [1, 1, 0]
      : [0, 1, 1, 0]
  )

  // Player — first album starts in place, others slide in
  const playerX = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 0.001]
      : [Math.max(0, start - segmentSize * 0.05), start],
    isFirst
      ? [0, 0]
      : [30, 0]
  )

  // Track visibility for letter-by-letter trigger
  useEffect(() => {
    const unsubscribe = titleOpacity.on('change', (v) => {
      setIsVisible(v > 0.5)
    })
    return unsubscribe
  }, [titleOpacity])

  const titleChars = song.title.split('')

  return (
    <motion.div className="gallery-fullscreen-item" style={{ opacity }}>
      <motion.img
        src={song.cover}
        alt={song.title}
        className="gallery-fullscreen-img"
        style={{ scale }}
      />
      {/* Song info — bottom left */}
      <motion.div
        className="gallery-fullscreen-info"
        style={{ opacity: titleOpacity }}
      >
        <AnimatePresence>
          {isVisible && (
            <>
              {/* Index — slides up */}
              <motion.span
                className="gallery-fullscreen-index"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </motion.span>

              {/* Title — letter by letter with blur */}
              <h2 className="gallery-fullscreen-name">
                {titleChars.map((char, i) => (
                  <motion.span
                    key={`${index}-${i}`}
                    initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                    transition={{
                      delay: 0.15 + i * 0.035,
                      duration: 0.55,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h2>

              {/* Subtitle — slides up with delay */}
              {song.subtitle && (
                <motion.span
                  className="gallery-fullscreen-subtitle"
                  initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    delay: 0.15 + titleChars.length * 0.035 + 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {song.subtitle}
                </motion.span>
              )}

              {/* Decorative line under title */}
              <motion.div
                className="gallery-fullscreen-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{
                  delay: 0.3 + titleChars.length * 0.035,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mini player — bottom right */}
      <motion.div
        className="gallery-player"
        style={{ x: playerX, opacity: titleOpacity }}
      >
        <div className="gallery-player-top">
          <div className="gallery-player-cover">
            <img src={song.playerCover} alt="" />
          </div>
          <div className="gallery-player-meta">
            <span className="gallery-player-title">{song.title}</span>
            <span className="gallery-player-artist">{song.artist}</span>
          </div>
        </div>
        <div className="gallery-player-progress">
          <div className="gallery-player-bar">
            <div
              className="gallery-player-bar-fill"
              style={{ width: `${song.progress}%` }}
            />
            <div
              className="gallery-player-bar-dot"
              style={{ left: `${song.progress}%` }}
            />
          </div>
          <div className="gallery-player-times">
            <span>{song.current}</span>
            <span>{song.duration}</span>
          </div>
        </div>
        <div className="gallery-player-controls">
          {/* Shuffle */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          {/* Prev */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
          {/* Play */}
          <div className="gallery-player-play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Next */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M16 18h2V6h-2zM6 18l8.5-6L6 6z" />
          </svg>
          {/* Repeat */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function GallerySection({ containerRef }) {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      ref={sectionRef}
      className="gallery-section"
      style={{ height: `${songs.length * 100}vh` }}
    >
      <div className="gallery-sticky">
        {/* Nav */}
        <nav className="hero-nav gallery-nav">
          <div className="hero-nav-left" style={{ position: 'relative' }}>
            <span className="hero-nav-logo">
              <span>3</span>
              <span style={{ display: 'inline-block', transform: 'scaleX(-1)', marginLeft: '0.08em' }}>3</span>
            </span>
            <span className="gallery-nav-category">ÖNE ÇIKAN PARÇALAR</span>
          </div>
          <div className="hero-nav-right">
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="hero-nav-link">SPOTIFY</a>
            <a href="https://music.apple.com" target="_blank" rel="noreferrer" className="hero-nav-link">ITUNES</a>
            <a href="https://deezer.com" target="_blank" rel="noreferrer" className="hero-nav-link">DEEZER</a>
            <span className="hero-nav-divider">|</span>
            <a href="https://www.bubilet.com.tr/sanatci/blok3-" target="_blank" rel="noreferrer" className="hero-nav-link">BUBILET</a>
            <a href="https://biletinial.com/tr-tr/profile/blok" target="_blank" rel="noreferrer" className="hero-nav-link">BILETINIAL</a>
          </div>
        </nav>

        {songs.map((song, i) => (
          <GalleryImage
            key={song.title}
            song={song}
            index={i}
            scrollYProgress={scrollYProgress}
            total={songs.length}
          />
        ))}
      </div>
    </section>
  )
}
