import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll, AnimatePresence } from 'framer-motion'
import landingBg from '../assets/first_background.jpg'
import landingFront from '../assets/first_front.png'
import secondVideo from '../assets/second_video.mp4'
import secondFront from '../assets/second_front.png'

const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }

const cities = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin',
  'Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur',
  'Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan',
  'Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Iğdır','Isparta','İstanbul',
  'İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kilis','Kırıkkale','Kırklareli',
  'Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş',
  'Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Şanlıurfa','Siirt','Sinop',
  'Sivas','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak',
]

const bioText = 'BLOK3 (Hakan Aydın), 15 Ağustos 2002 tarihinde Kocaeli\'nin Gebze ilçesinde doğmuş, Türkiye rap sahnesinin yeni nesil ve en etkili isimlerinden biridir. Müziğe erken yaşlarda ilgi duyan sanatçı, sokak kültüründen beslenen güçlü anlatımı ve enerjik vokaliyle kısa sürede geniş bir dinleyici kitlesine ulaşmıştır.'

function TypewriterText({ text, delay = 0, speed = 18 }) {
  const [charCount, setCharCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (charCount >= text.length) return
    const timer = setTimeout(() => {
      setCharCount((c) => c + 1)
    }, speed)
    return () => clearTimeout(timer)
  }, [started, charCount, text, speed])

  return (
    <span>
      {text.slice(0, charCount)}
      {charCount < text.length && started && <span className="typewriter-cursor">|</span>}
    </span>
  )
}

const phrases = [
  'KUSURA BAKMA',
  '100M+ DİNLENME',
  '#1 TÜRKİYE',
  'REKOR HİT',
  'VİRAL FENOMEN',
]

const phraseVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: 'blur(8px)',
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
}

export default function LandingSection({ containerRef, audioRef }) {
  const sectionRef = useRef(null)
  const secondVideoRef = useRef(null)
  const [entered, setEntered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '' })
  const [key, setKey] = useState(0)
  const [titleKey, setTitleKey] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spotlight
  const spotRawX = useMotionValue(-200)
  const spotRawY = useMotionValue(-200)
  const spotX = useSpring(spotRawX, { damping: 20, stiffness: 150, mass: 0.3 })
  const spotY = useSpring(spotRawY, { damping: 20, stiffness: 150, mass: 0.3 })
  const maskImage = useMotionTemplate`radial-gradient(circle 180px at ${spotX}px ${spotY}px, transparent 0px, black 180px)`

  // Scroll-driven crossfade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start start', 'end start'],
  })

  // First layer fades out quickly on first scroll
  const bgOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const firstFrontOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  // Second front fades in immediately
  const secondFrontOpacity = useTransform(scrollYProgress, [0.02, 0.1], [0, 1])

  // Hide cursor only on first screen + track if in landing section
  const [isFirstScreen, setIsFirstScreen] = useState(true)
  const [inFirstSection, setInFirstSection] = useState(true)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setIsFirstScreen(v < 0.05)
      setInFirstSection(v < 0.45)
    })
    return unsubscribe
  }, [scrollYProgress])

  // Pause/resume music when leaving/entering first section
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !entered) return
    if (inFirstSection) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [inFirstSection, entered])

  // Enter site — start music and video
  const handleEnter = () => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.4
      audio.play()
    }
    if (secondVideoRef.current) secondVideoRef.current.play()
    setEntered(true)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('https://wearup-server.onrender.com/api/blok3/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } catch (err) {
      // sessizce devam et
    }
    setLoading(false)
    handleEnter()
  }

  const handleSkip = (e) => {
    e.stopPropagation()
    handleEnter()
  }

  // Rotating phrase loop
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // BLOK3 title animation loop every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleKey((k) => k + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Parallax
  const frontX = useSpring(useTransform(mouseX, (v) => v * -40), springConfig)
  const secondFrontX = useSpring(useTransform(mouseX, (v) => v * -40), springConfig)
  const titleX = useSpring(useTransform(mouseX, (v) => v * 25), springConfig)
  const titleY = useSpring(useTransform(mouseY, (v) => v * 25), springConfig)

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    mouseX.set((e.clientX - centerX) / centerX)
    mouseY.set((e.clientY - centerY) / centerY)
    spotRawX.set(e.clientX)
    spotRawY.set(e.clientY)
  }

  return (
    <section ref={sectionRef} className="landing-section" onMouseMove={handleMouseMove} style={{ cursor: isFirstScreen && entered ? 'none' : 'auto' }}>
      {/* Entry overlay with subscribe form */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="entry-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <motion.div
              className="entry-logo"
              animate={{ rotate: [0, 360, 360, 0, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1], ease: 'easeInOut' }}
            >
              <span>3</span>
              <span style={{ display: 'inline-block', transform: 'scaleX(-1)', marginLeft: '0.05em' }}>3</span>
            </motion.div>

            <motion.p
              className="entry-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Konserler, özel içerikler ve erken erişim fırsatları için abone ol.
            </motion.p>

            <motion.form
              className="entry-form"
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="entry-row">
                <input
                  className="entry-input"
                  type="text"
                  placeholder="Ad"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <input
                  className="entry-input"
                  type="text"
                  placeholder="Soyad"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <input
                className="entry-input"
                type="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div className="entry-phone-row">
                <span className="entry-phone-prefix">+90</span>
                <input
                  className="entry-input"
                  type="tel"
                  placeholder="Telefon (opsiyonel)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <select
                className="entry-input entry-select"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              >
                <option value="" disabled>Şehir seç</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <button type="submit" className="entry-btn" disabled={loading}>
                {loading ? <span className="entry-btn-spinner" /> : 'ABONE OL VE SITEYE GİR'}
              </button>
            </motion.form>

            <motion.button
              className="entry-skip"
              onClick={handleSkip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Abone olmadan devam et
            </motion.button>

            <motion.a
              className="entry-credit"
              href="https://www.monailisa.com/"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              made by <span className="entry-credit-name">Monailisa Lab</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="landing-sticky">
        {/* TREND label */}
        <motion.span className="hero-nav-logo landing-trend-label" style={{ opacity: secondFrontOpacity }}>TREND</motion.span>

        {/* Video — always behind */}
        <video
          ref={secondVideoRef}
          className="landing-video"
          src={secondVideo}
          muted
          loop
          playsInline
        />

        {/* Second front — fades in */}
        <motion.img
          className="landing-front landing-second-front"
          src={secondFront}
          alt=""
          style={{ opacity: secondFrontOpacity, x: secondFrontX }}
        />

        {/* Background with spotlight */}
        <motion.div className="landing-bg-wrapper">
          <motion.img
            className="landing-bg"
            src={landingBg}
            alt=""
            style={{
              opacity: bgOpacity,
              WebkitMaskImage: maskImage,
              maskImage: maskImage,
            }}
          />
        </motion.div>

        {/* First front — static */}
        <motion.img
          className="landing-front"
          src={landingFront}
          alt=""
          style={{ x: frontX, opacity: firstFrontOpacity }}
        />

        {/* Bio info */}
        <motion.div
          className="landing-bio"
          style={{ opacity: bgOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="landing-bio-date">
            <motion.span
              className="landing-bio-num"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >15</motion.span>
            <span className="landing-bio-sep">—</span>
            <motion.span
              className="landing-bio-num"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >08</motion.span>
            <span className="landing-bio-sep">—</span>
            <motion.span
              className="landing-bio-num"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >2002</motion.span>
          </div>
          <motion.p
            className="landing-bio-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <TypewriterText text={bioText} delay={0.9} speed={18} />
          </motion.p>
        </motion.div>

        {/* BLOK3 title — first screen only, letter-by-letter loops every 4s */}
        <motion.h1
          className="landing-title"
          style={{ x: titleX, y: titleY, opacity: bgOpacity }}
        >
          {'BLOK3'.split('').map((char, i) => (
            <motion.span
              key={`${titleKey}-${i}`}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: i * 0.12,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Rotating praise phrases — second screen only */}
        <motion.h1
          className="landing-title landing-title-second"
          style={{ opacity: secondFrontOpacity }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={key}
              className="landing-title-inner"
              variants={phraseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {phrases[key % phrases.length].split(' ').map((word, i) => {
                const phrase = phrases[key % phrases.length]
                const isRekorHit = phrase === 'REKOR HİT' && i === 1
                return (
                  <span key={i} style={{ display: 'block', alignSelf: 'flex-start', marginLeft: isRekorHit ? '45%' : '0' }}>{word}</span>
                )
              })}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* YouTube video info — fades in on second screen */}
        <motion.div
          className="landing-yt-info"
          style={{ opacity: secondFrontOpacity }}
        >
          <div className="landing-yt-badge">
            <svg width="20" height="14" viewBox="0 0 24 17" fill="none">
              <rect width="24" height="17" rx="4" fill="#FF0000" />
              <path d="M16 8.5L10 12V5L16 8.5Z" fill="#fff" />
            </svg>
            <span className="landing-yt-badge-text">Official Music Video</span>
          </div>
          <h2 className="landing-yt-title">KUSURA BAKMA</h2>
          <p className="landing-yt-meta">100 Mn görüntülenme &bull; 2 ay önce</p>
          <div className="landing-yt-channel">
            <div className="landing-yt-avatar">B3</div>
            <div className="landing-yt-channel-info">
              <span className="landing-yt-channel-name">Blok3</span>
              <span className="landing-yt-channel-subs">1.2M abone</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
