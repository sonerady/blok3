import { useRef, useEffect, useState, memo } from 'react'
import { motion, useInView, useScroll, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import statisticImg from '../assets/statistic_gold.png'

/* ── Animated number counter ── */
const AnimatedCounter = memo(function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { damping: 30, stiffness: 80, mass: 0.5 })
  const displayRef = useRef(null)

  useEffect(() => {
    if (isInView) motionVal.set(target)
  }, [isInView, target, motionVal])

  // Write directly to DOM instead of setState per frame
  useEffect(() => {
    const unsubscribe = springVal.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = Math.floor(v).toLocaleString('tr-TR') + suffix
      }
    })
    return unsubscribe
  }, [springVal, suffix])

  return <span ref={(el) => { ref.current = el; displayRef.current = el }}>0{suffix}</span>
})

/* ── Platform data ── */
const platforms = [
  {
    id: 'spotify',
    name: 'Spotify',
    color: '#1DB954',
    title: 'SPOTIFY PERFORMANSI',
    desc: 'Aylık 10 milyonun üzerinde dinleyiciye ulaşarak Türkiye\'de bu eşiği geçen ilk ve tek sanatçı.',
    highlights: [
      { value: 2910000000, suffix: '+', label: 'Toplam Stream' },
      { value: 28, suffix: '', label: 'Şarkı' },
      { value: 10000000, suffix: '+', label: 'Aylık Dinleyici' },
    ],
    stats: [
      'Günlük en fazla dinlenen şarkı rekoru',
      'Yılın en çok dinlenen şarkısı',
      "Türkiye'nin en çok dinlenen albümleri",
      'Top 50 Türkiye — en uzun süre 1. sıra',
      'Tüm Dünya kategorisinde yılın en çıkış yapan şarkısı',
    ],
    topCities: [
      { name: 'İstanbul', count: '2.880.168' },
      { name: 'Ankara', count: '1.423.946' },
      { name: 'İzmir', count: '936.562' },
    ],
    topCountries: [
      { name: 'Türkiye', count: '7.687.008' },
      { name: 'Almanya', count: '706.551' },
      { name: 'Hollanda', count: '152.249' },
    ],
    bigNumber: 28,
    bigLabel: 'ŞARKI',
    time: { current: '1:47', total: '3:22', progress: 53 },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    title: 'YOUTUBE & SOSYAL MEDYA',
    desc: 'Resmi klipler kısa sürede milyonlarca görüntülenmeye ulaşarak BLOK3\'ün görsel anlatım gücünü ortaya koymaktadır.',
    highlights: [
      { value: 111000000, suffix: '+', label: 'Görüntülenme' },
      { value: 840000, suffix: '+', label: 'Beğeni' },
      { value: 45000, suffix: '+', label: 'Yorum' },
    ],
    stats: [
      'YouTube Shorts — 476.000+ video',
      'Shorts İzlenme — 323 Milyon+',
      'Shorts Beğeni — 5.750.000+',
    ],
    bigNumber: 111,
    bigLabel: 'MİLYON',
    time: { current: '2:31', total: '4:15', progress: 59 },
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#00F2EA',
    title: 'TIKTOK PERFORMANSI',
    desc: 'Şarkıların kullanıcılar tarafından yoğun şekilde kullanılması, viral yayılımını hızlandırmıştır.',
    highlights: [
      { value: 2000000000, suffix: '+', label: 'Görüntülenme' },
      { value: 260000, suffix: '+', label: 'Video' },
      { value: 88000000, suffix: '+', label: 'Beğeni' },
    ],
    stats: [
      'En viral Türkçe ses',
      'Organik erişimi önemli ölçüde artırmıştır',
    ],
    bigNumber: 2,
    bigLabel: 'MİLYAR+',
    time: { current: '0:42', total: '1:05', progress: 65 },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    title: 'INSTAGRAM REELS',
    desc: 'Instagram, TikTok ve YouTube Shorts gibi mecralarda yüksek etkileşim oranları elde etmiştir.',
    highlights: [
      { value: 486000000, suffix: '+', label: 'Reels İzlenme' },
      { value: 400000, suffix: '+', label: 'Reels Video' },
      { value: 13900000, suffix: '+', label: 'Reels Beğeni' },
    ],
    stats: [
      'Sosyal medya kanallarında yüksek etkileşim',
      'Viral yayılım ve organik erişim',
    ],
    bigNumber: 486,
    bigLabel: 'MİLYON',
    time: { current: '0:18', total: '0:30', progress: 60 },
  },
]

/* ── Platform SVG icons — accept color prop ── */
const PlatformIcon = memo(function PlatformIcon({ id, size = 40, color }) {
  const fill = color || '#999'
  switch (id) {
    case 'spotify':
      return (
        <svg viewBox="0 0 168 168" width={size} height={size}>
          <path fill={fill} d="M84 0C37.6 0 0 37.6 0 84s37.6 84 84 84 84-37.6 84-84S130.4 0 84 0zm38.5 121.2c-1.5 2.5-4.7 3.2-7.1 1.7-19.5-11.9-44-14.6-72.9-8-2.8.6-5.6-1.1-6.2-3.9-.6-2.8 1.1-5.6 3.9-6.2 31.6-7.2 58.7-4.1 80.6 9.3 2.5 1.5 3.2 4.7 1.7 7.1zm10.3-22.9c-1.9 3.1-5.9 4-9 2.1-22.3-13.7-56.3-17.7-82.7-9.7-3.4 1-7.1-.9-8.1-4.3-1-3.4.9-7.1 4.3-8.1 30.1-9.1 67.5-4.7 93.1 11 3.1 1.9 4 5.9 2.4 9zm.9-23.8c-26.8-15.9-71-17.4-96.6-9.6-4.1 1.2-8.5-1.1-9.7-5.2-1.2-4.1 1.1-8.5 5.2-9.7 29.4-8.9 78.3-7.2 109.2 11.1 3.7 2.2 4.9 7 2.7 10.7-2.2 3.6-7 4.9-10.8 2.7z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill={fill} d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill={fill} d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill={fill} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      )
    default:
      return null
  }
})

/* ── Animation variants ── */
const scaleIn = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      type: 'spring',
      damping: 20,
      stiffness: 150,
      mass: 0.5,
    },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
}

const statItemVariant = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 150,
      mass: 0.5,
    },
  },
}

/* ── Content transition — no blur, GPU-friendly ── */
const contentTransition = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
}

export default function StatisticSection({ containerRef }) {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const prevIndexRef = useRef(0)

  // Only setState when index actually changes — prevents unnecessary re-renders
  // Give Instagram extra buffer at the end so user doesn't scroll past it
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      // 0–0.25 spotify, 0.25–0.5 youtube, 0.5–0.75 tiktok, 0.75–1.0 instagram (each ~150vh)
      const idx = Math.min(3, Math.floor(v * 4))
      if (idx !== prevIndexRef.current) {
        prevIndexRef.current = idx
        setActiveIndex(idx)
      }
    })
    return unsubscribe
  }, [scrollYProgress])

  const current = platforms[activeIndex]

  return (
    <section ref={sectionRef} className="statistic-section">
      <div className="statistic-sticky">
        <nav className="hero-nav">
          <div className="hero-nav-left">
            <a href="#about" className="hero-nav-link">ABOUT</a>
          </div>
          <div className="hero-nav-center" />
          <div className="hero-nav-right">
            <a href="https://spotify.com" target="_blank" rel="noreferrer" className="hero-nav-link">SPOTIFY</a>
            <a href="https://music.apple.com" target="_blank" rel="noreferrer" className="hero-nav-link">ITUNES</a>
            <a href="https://deezer.com" target="_blank" rel="noreferrer" className="hero-nav-link">DEEZER</a>
            <span className="hero-nav-divider">|</span>
            <a href="https://www.bubilet.com.tr/sanatci/blok3-" target="_blank" rel="noreferrer" className="hero-nav-link">BUBILET</a>
            <a href="https://biletinial.com/tr-tr/profile/blok" target="_blank" rel="noreferrer" className="hero-nav-link">BILETINIAL</a>
          </div>
        </nav>
        <img src={statisticImg} alt="Statistics" className="statistic-img" />

        {/* Platform icons — left sidebar */}
        <motion.div
          className="stat-platforms"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {platforms.map((platform, i) => {
            const isActive = activeIndex === i
            return (
              <div key={platform.id}>
                {i > 0 && <div className="stat-platform-step" />}
                <motion.div
                  className={`stat-platform ${isActive ? 'active' : 'inactive'}`}
                  variants={statItemVariant}
                >
                  <div className={isActive ? 'platform-icon-wrapper' : 'stat-platform-icon'}>
                    {isActive && platform.id === 'spotify' && (
                      <motion.div
                        className="platform-glow-ring"
                        style={{ borderColor: platform.color }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                    {/* Active = brand color, inactive = gray */}
                    <PlatformIcon
                      id={platform.id}
                      color={isActive ? platform.color : 'rgba(0,0,0,0.25)'}
                    />
                  </div>
                  <div className="stat-platform-info">
                    <span className="stat-platform-name">{platform.name}</span>
                    <span className="stat-platform-data">{platform.highlights[0].label}</span>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </motion.div>

        {/* Floating label — top right */}
        <motion.div
          className="stat-label stat-label-top"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={1}
          variants={scaleIn}
        >
          <span className="stat-label-dot" style={{ background: current.color }} />
          <div className="stat-equalizer">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="stat-eq-bar"
                style={{
                  background: current.color,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <span>CANLI VERİ</span>
        </motion.div>

        {/* Stats block — bottom right */}
        <div className="stat-info-block">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              {...contentTransition}
            >
              <h3 className="stat-info-title">{current.title}</h3>
              <p className="stat-info-desc">{current.desc}</p>

              {/* Highlight numbers grid */}
              <div className="stat-highlights">
                {current.highlights.map((h, i) => (
                  <motion.div
                    key={h.label}
                    className="stat-highlight"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <span className="stat-highlight-value" style={{ color: current.color }}>
                      <AnimatedCounter target={h.value} suffix={h.suffix} />
                    </span>
                    <span className="stat-highlight-label">{h.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats list */}
              <div className="stat-info-list">
                {current.stats.map((stat, i) => (
                  <motion.div
                    key={stat}
                    className="stat-info-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                    whileHover={{ x: -8, color: current.color, transition: { duration: 0.2 } }}
                  >
                    <span
                      className="stat-info-bullet"
                      style={{ background: current.color }}
                    />
                    <span>{stat}</span>
                  </motion.div>
                ))}
              </div>

              {/* Spotify top cities/countries */}
              {current.topCities && (
                <div className="stat-geo">
                  <div className="stat-geo-col">
                    <span className="stat-geo-heading">Top Şehirler</span>
                    {current.topCities.map((c, i) => (
                      <motion.div
                        key={c.name}
                        className="stat-geo-row"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                      >
                        <span className="stat-geo-rank">{i + 1}</span>
                        <span className="stat-geo-name">{c.name}</span>
                        <span className="stat-geo-count">{c.count}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="stat-geo-col">
                    <span className="stat-geo-heading">Top Ülkeler</span>
                    {current.topCountries.map((c, i) => (
                      <motion.div
                        key={c.name}
                        className="stat-geo-row"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                      >
                        <span className="stat-geo-rank">{i + 1}</span>
                        <span className="stat-geo-name">{c.name}</span>
                        <span className="stat-geo-count">{c.count}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating numbers — left side */}
        <div className="stat-floating-numbers">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + '-num'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <span className="stat-big-number">
                <AnimatedCounter target={current.bigNumber} />
              </span>
              <span className="stat-number-label">{current.bigLabel}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Phone frame */}
        <motion.div
          className="phone-frame"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={isInView ? {
            opacity: 1,
            y: 0,
            scale: 1,
            borderColor: `${current.color}50`,
            boxShadow: `0 0 30px ${current.color}15`,
          } : {}}
          transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {current.id === 'instagram' ? (
              <motion.div
                key="instagram-bottom"
                className="phone-bottom phone-bottom-ig"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="ig-actions">
                  <div className="ig-actions-left">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </div>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span className="ig-likes">3.842.591 beğenme</span>
                <span className="ig-caption"><strong>blok3</strong> Yeni içerik yakında...</span>
              </motion.div>
            ) : current.id === 'tiktok' ? (
              <motion.div
                key="tiktok-bottom"
                className="phone-bottom phone-bottom-tk"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="tk-info">
                  <span className="tk-username">@blok3</span>
                  <span className="tk-desc">En viral Türkçe ses #blok3 #rap #türkçerap</span>
                </div>
                <div className="tk-actions">
                  <div className="tk-action">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>845K</span>
                  </div>
                  <div className="tk-action">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>12.4K</span>
                  </div>
                  <div className="tk-action">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                    <span>8.2K</span>
                  </div>
                  <div className="tk-music-disc">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(0,0,0,0.6)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                  </div>
                </div>
              </motion.div>
            ) : current.id === 'youtube' ? (
              <motion.div
                key="youtube-bottom"
                className="phone-bottom phone-bottom-yt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* YouTube progress bar */}
                <div className="yt-progress">
                  <motion.div
                    className="yt-progress-fill"
                    animate={{ width: `${current.time.progress}%` }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
                <div className="yt-controls">
                  <div className="yt-controls-left">
                    {/* Play */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)"><path d="M8 5v14l11-7z"/></svg>
                    {/* Next */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,0,0,0.55)"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    {/* Volume */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,0,0,0.55)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    <span className="yt-time">{current.time.current} / {current.time.total}</span>
                  </div>
                  <div className="yt-controls-right">
                    {/* Subtitles */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,0,0,0.45)"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>
                    {/* Settings */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,0,0,0.45)"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                    {/* Fullscreen */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,0,0,0.45)"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                  </div>
                </div>
                <div className="yt-info">
                  <span className="yt-title">BLOK3 - Official Music Video</span>
                  <span className="yt-views">1.2B görüntülenme · 4.5M abone</span>
                </div>
              </motion.div>
            ) : (
              /* Spotify player */
              <motion.div
                key="spotify-bottom"
                className="phone-bottom phone-bottom-sp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Song info row */}
                <div className="sp-song-row">
                  <div className="sp-album-art">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                  </div>
                  <div className="sp-song-info">
                    <span className="sp-song-name">Neden Böyle</span>
                    <span className="sp-artist-name">BLOK3</span>
                  </div>
                  {/* Heart */}
                  <svg className="sp-heart" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                {/* Progress bar */}
                <div className="sp-progress-wrap">
                  <div className="phone-bar">
                    <motion.div
                      className="phone-bar-fill"
                      animate={{ width: `${current.time.progress}%` }}
                      style={{ background: '#1DB954' }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <div className="sp-times">
                    <span className="phone-time">{current.time.current}</span>
                    <span className="phone-time">{current.time.total}</span>
                  </div>
                </div>
                {/* Controls */}
                <div className="sp-controls">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(0,0,0,0.45)"><path d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356A2.25 2.25 0 0111.16 4.5h1.95l-1.018 1.018a.75.75 0 001.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5zM1.724 4.5A2.25 2.25 0 010 3.804V2h.391a3.75 3.75 0 012.873 1.34L4.89 5.277l-1.164 1.387A2.25 2.25 0 011.724 4.5zM11.16 12.5h1.95l-1.018-1.018a.75.75 0 111.06-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L13.109 14H11.16a3.75 3.75 0 01-2.873-1.34l-1.627-1.938 1.164-1.387 1.627 1.938a2.25 2.25 0 001.724.727z"/></svg>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="rgba(0,0,0,0.6)"><path d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.15v5.15a.7.7 0 01-1.4 0V1.7a.7.7 0 01.7-.7z"/></svg>
                  <div className="sp-play-btn">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="#fff"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"/></svg>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="rgba(0,0,0,0.6)"><path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.15v5.15a.7.7 0 001.4 0V1.7a.7.7 0 00-.7-.7z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(0,0,0,0.45)"><path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a.75.75 0 01-1.5 0v-5A2.25 2.25 0 0012.25 2.5h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5zM12.25 2.5a2.25 2.25 0 012.25 2.25v5a2.25 2.25 0 01-2.25 2.25h-8.5A2.25 2.25 0 011.5 9.75v-5A2.25 2.25 0 013.75 2.5h8.5z"/><path d="M7.828 4.953l2.293 2.293a.75.75 0 010 1.06L7.828 10.6a.75.75 0 01-1.06-1.06L8.293 8 6.768 6.475a.75.75 0 011.06-1.06v-.462z"/></svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
