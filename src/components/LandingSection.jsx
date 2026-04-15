import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import landingBgVideo from "../assets/section_v1_background_video_v4.mp4";
import landingFront from "../assets/section_v1_front.png";
import landingFrontMobile from "../assets/section_v1_front_mobile.png";
// import secondVideo from "../assets/second_video.mp4";
// import secondFrontDesktop from "../assets/second_front.png";
// import secondFrontMobile from "../assets/second_front_mobile.png";

// const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };

const cities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Şanlıurfa",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];


const phrases = [
  "KUSURA BAKMA",
  "100M+ DİNLENME",
  "#1 TÜRKİYE",
  "REKOR HİT",
  "VİRAL FENOMEN",
];

const phraseVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, display: "none" },
  visible: {
    opacity: 1,
    display: "inline",
    transition: { duration: 0.01 },
  },
};

export default function LandingSection({ containerRef, onEventsOpen, isActive, onEnter }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const activeFront = isMobile ? landingFrontMobile : landingFront;
  // const secondFront = isMobile ? secondFrontMobile : secondFrontDesktop;
  const sectionRef = useRef(null);
  // const secondVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const [entered, setEntered] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("blok3_subscribed") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
  });
  const [key, setKey] = useState(0);
  const [titleKey, setTitleKey] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [frontGlitching, setFrontGlitching] = useState(false);

  // Parallax — desktop: mouse (spring), mobile: auto-sway (direct)
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const rawFrontX = useMotionValue(0);
  const rawBgX = useMotionValue(0);
  const springFrontX = useSpring(rawFrontX, springConfig);
  const springBgX = useSpring(rawBgX, springConfig);
  const frontX = isMobile ? rawFrontX : springFrontX;
  const bgMoveX = isMobile ? rawBgX : springBgX;

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const nx = (e.clientX - centerX) / (rect.width / 2);
    rawFrontX.set(nx * -30);
    rawBgX.set(nx * 10);
  };

  // Mobile: smooth continuous sway (direct motionValue, no spring)
  useEffect(() => {
    if (!isMobile) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const wave = Math.sin(elapsed * 0.0003);
      rawFrontX.set(wave * -18);
      rawBgX.set(wave * 7);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  // Glitch effect on front image every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setFrontGlitching(true);
      setTimeout(() => setFrontGlitching(false), 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // If user already subscribed, trigger onEnter on mount (audio/video)
  useEffect(() => {
    if (entered && onEnter) onEnter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const showFirstContent = entered && videoEnded;

  // Scroll-driven crossfade
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ["start start", "end start"],
  });

  // First layer — keep visible (no trend crossfade)
  const bgOpacity = useMotionValue(1);
  const firstFrontOpacity = useMotionValue(1);
  // Second front — disabled (trend commented out)
  // const secondFrontOpacity = useTransform(scrollYProgress, [0.02, 0.1], [0, 1]);

  // Hide cursor only on first screen + track if in landing section
  const [isFirstScreen, setIsFirstScreen] = useState(true);
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setIsFirstScreen(v < 0.05);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Enter site — start video + music
  const handleEnter = () => {
    setEntered(true);
    if (onEnter) onEnter();
  };

  // Play/pause video based on section visibility
  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else if (entered) {
      video.pause();
    }
  }, [isActive, entered]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/blok3/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      // sessizce devam et
    }
    localStorage.setItem("blok3_subscribed", "true");
    setLoading(false);
    handleEnter();
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    handleEnter();
  };

  // Rotating phrase loop
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // BLOK3 title animation loop every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  return (
    <section
      ref={sectionRef}
      className="landing-section"
      onMouseMove={handleMouseMove}
    >
      {/* Entry overlay with subscribe form */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="entry-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="entry-logo"
              animate={{ rotate: [0, 360, 360, 0, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                times: [0, 0.4, 0.5, 0.9, 1],
                ease: "easeInOut",
              }}
            >
              <span>3</span>
              <span
                style={{
                  display: "inline-block",
                  transform: "scaleX(-1)",
                  marginLeft: "0.05em",
                }}
              >
                3
              </span>
            </motion.div>

            <motion.p
              className="entry-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Konserler, özel içerikler ve erken erişim fırsatları için abone
              ol.
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
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
                <input
                  className="entry-input"
                  type="text"
                  placeholder="Soyad"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <input
                className="entry-input"
                type="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <div className="entry-phone-row">
                <span className="entry-phone-prefix">+90</span>
                <input
                  className="entry-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="xxx xxx xxxx"
                  maxLength={12}
                  value={formData.phone}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    const parts = [
                      digits.slice(0, 3),
                      digits.slice(3, 6),
                      digits.slice(6, 10),
                    ].filter(Boolean);
                    setFormData({ ...formData, phone: parts.join(" ") });
                  }}
                />
              </div>
              <select
                className="entry-input entry-select"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Şehir seç
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button type="submit" className="entry-btn" disabled={loading}>
                {loading ? (
                  <span className="entry-btn-spinner" />
                ) : (
                  "ABONE OL VE SITEYE GİR"
                )}
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="landing-sticky">
        {/* TREND label — commented out
        <motion.span
          className="hero-nav-logo landing-trend-label"
          style={{ opacity: secondFrontOpacity }}
        >
          TREND
        </motion.span>

        <video
          ref={secondVideoRef}
          className="landing-video"
          src={secondVideo}
          muted
          loop
          playsInline
        />

        <motion.img
          className="landing-front landing-second-front"
          src={secondFront}
          alt=""
          style={{
            opacity: secondFrontOpacity,
            x: isMobile ? 0 : secondFrontX,
          }}
        />
        */}

        {/* Background with spotlight */}
        <motion.div className="landing-bg-wrapper" style={{ x: entered ? bgMoveX : 0 }}>
          <motion.video
            ref={bgVideoRef}
            className={`landing-bg${videoEnded ? " video-ended-pulse" : ""}`}
            src={landingBgVideo}
            muted
            playsInline
            autoPlay
            onEnded={() => setVideoEnded(true)}
            style={{
              opacity: entered ? bgOpacity : 1,
            }}
          />
          {isFirstScreen && entered && (
            <>
              <div className="concert-spotlights">
                <div className="spotlight spotlight-1" />
                <div className="spotlight spotlight-2" />
                <div className="spotlight spotlight-3" />
                <div className="spotlight spotlight-4" />
              </div>
              <div className="smoke-overlay">
                <div className="smoke-layer smoke-layer-1" />
                <div className="smoke-layer smoke-layer-2" />
                <div className="smoke-layer smoke-layer-3" />
              </div>
            </>
          )}
          {isFirstScreen && videoEnded && (
            <div className="video-ended-glow" />
          )}
        </motion.div>

        {/* First front */}
        <motion.img
          className={`landing-front${frontGlitching ? " front-glitch" : ""}`}
          src={activeFront}
          alt=""
          style={{ opacity: entered ? firstFrontOpacity : 1, x: entered ? frontX : 0 }}
        />

        {/* Bottom gradient */}
        <motion.div
          className="landing-bottom-gradient"
          style={{ opacity: entered ? bgOpacity : 0.5 }}
        />

        {/* Konser Takvimi button + description */}
        <motion.button
          className="turne-events-btn"
          style={{ opacity: bgOpacity }}
          onClick={onEventsOpen}
        >
          Konser Takvimi
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
        </motion.button>

        <motion.p className="turne-desc" style={{ opacity: bgOpacity }}>
          BLOK3, 2026 konser planlamasına göre bu yıl içerisinde Türkiye içinde 34 Şehirde 62 Konser, Yurt dışında 10 Ülke, 25 Şehirde 50 Konser gerçekleştirmesi planlanmaktadır.
        </motion.p>

        {/* 2026 title — appears after V1 video ends, letter-by-letter loops every 4s */}
        <AnimatePresence>
          {showFirstContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="landing-title"
                style={{ opacity: bgOpacity }}
              >
                {"2026".split("").map((char, i) => (
                  <motion.span
                    key={`${titleKey}-${i}`}
                    initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rotating praise phrases — trend screen commented out
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
              {(() => {
                const phrase = phrases[key % phrases.length];
                const words = phrase.split(" ");
                const orderedWords =
                  isMobile && phrase === "#1 TÜRKİYE"
                    ? [...words].reverse()
                    : words;
                return orderedWords.map((word, wi) => {
                  const isRekorHit = phrase === "REKOR HİT" && wi === 1;
                  return (
                    <span
                      key={wi}
                      style={{
                        display: "block",
                        alignSelf: "flex-start",
                        marginLeft: isRekorHit && !isMobile ? "45%" : "0",
                      }}
                    >
                      {word.split("").map((char, ci) => (
                        <motion.span
                          key={ci}
                          variants={charVariants}
                          style={{ display: "inline" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  );
                });
              })()}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        */}

        {/* YouTube video info — trend screen commented out
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
          <p className="landing-yt-meta">
            100 Mn görüntülenme &bull; 2 ay önce
          </p>
          <div className="landing-yt-channel">
            <div className="landing-yt-avatar">B3</div>
            <div className="landing-yt-channel-info">
              <span className="landing-yt-channel-name">Blok3</span>
              <span className="landing-yt-channel-subs">1.2M abone</span>
            </div>
          </div>
        </motion.div>
        */}
      </div>
    </section>
  );
}
