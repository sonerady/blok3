import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardFade = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function PressModal({ isOpen, onClose }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch('/api/blok3/press')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="press-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="press-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="press-modal-close" onClick={onClose} aria-label="Kapat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="press-modal-content">
              <span className="press-label">MEDYA</span>
              <h2 className="press-heading">Basında Biz</h2>
              <p className="press-desc">BLOK3 hakkında çıkan haberler ve basın yansımaları</p>

              {loading && (
                <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>
                  Yükleniyor...
                </p>
              )}

              {!loading && (
                <motion.div
                  className="press-grid"
                  variants={listStagger}
                  initial="hidden"
                  animate="visible"
                >
                  {articles.map((article) => (
                    <motion.a
                      key={article.id}
                      className="press-card"
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      variants={cardFade}
                    >
                      <div className="press-card-image">
                        <img src={article.image_url} alt={article.title} loading="lazy" />
                        <div className="press-card-overlay" />
                      </div>
                      <div className="press-card-body">
                        <h3 className="press-card-title">{article.title}</h3>
                        <span className="press-card-link">
                          Haberi Oku
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
