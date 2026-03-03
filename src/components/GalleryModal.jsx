import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemFade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function GalleryModal({ isOpen, onClose }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch('/api/blok3/gallery')
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isOpen])

  const closeLightbox = () => setSelectedIndex(null)

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(null)
      return
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedIndex !== null) closeLightbox()
        else onClose()
      }
      if (selectedIndex !== null) {
        if (e.key === 'ArrowRight') goNext()
        if (e.key === 'ArrowLeft') goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, selectedIndex, onClose, goNext, goPrev])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="gallery-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="gallery-modal-close" onClick={onClose} aria-label="Kapat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="gallery-modal-content">
              <span className="gallery-label">2025 TURNE</span>
              <h2 className="gallery-heading">Konser Galerisi</h2>
              <p className="gallery-desc">
                Türkiye ve Avrupa turnelerinden sahne anları
              </p>

              {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Yükleniyor...</p>}
              {!loading && <motion.div
                className="gallery-grid"
                variants={gridStagger}
                initial="hidden"
                animate="visible"
              >
                {photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="gallery-item"
                    variants={itemFade}
                    onClick={() => setSelectedIndex(i)}
                  >
                    <img src={photo.src} alt={photo.caption} loading="lazy" />
                    <div className="gallery-item-overlay">
                      <span>{photo.caption}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>}
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedIndex !== null && photos[selectedIndex] && (
              <motion.div
                className="gallery-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeLightbox}
              >
                <motion.img
                  key={selectedIndex}
                  src={photos[selectedIndex].src}
                  alt={photos[selectedIndex].caption}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <span className="gallery-lightbox-caption">
                  {photos[selectedIndex].caption}
                </span>

                {/* Prev */}
                <button
                  className="gallery-lightbox-nav prev"
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  aria-label="Önceki"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  className="gallery-lightbox-nav next"
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  aria-label="Sonraki"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Close lightbox */}
                <button
                  className="gallery-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Kapat"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
