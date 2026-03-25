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

function groupPhotos(photos) {
  const groups = []
  const groupMap = {}

  photos.forEach((photo) => {
    const key = photo.group_name || `__solo_${photo.id || photo.src}`
    if (!groupMap[key]) {
      groupMap[key] = { name: photo.group_name || photo.caption, photos: [] }
      groups.push(groupMap[key])
    }
    groupMap[key].photos.push(photo)
  })

  return groups
}

export default function GalleryModal({ isOpen, onClose }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null)
  const [innerIndex, setInnerIndex] = useState(0)

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

  const groups = groupPhotos(photos)
  const selectedGroup = selectedGroupIndex !== null ? groups[selectedGroupIndex] : null
  const hasMultiple = selectedGroup ? selectedGroup.photos.length > 1 : false

  const closeLightbox = () => {
    setSelectedGroupIndex(null)
    setInnerIndex(0)
  }

  const goNextInner = useCallback(() => {
    if (!selectedGroup) return
    setInnerIndex((prev) => (prev + 1) % selectedGroup.photos.length)
  }, [selectedGroup])

  const goPrevInner = useCallback(() => {
    if (!selectedGroup) return
    setInnerIndex((prev) => (prev - 1 + selectedGroup.photos.length) % selectedGroup.photos.length)
  }, [selectedGroup])

  const goNextGroup = useCallback(() => {
    setSelectedGroupIndex((prev) => (prev + 1) % groups.length)
    setInnerIndex(0)
  }, [groups.length])

  const goPrevGroup = useCallback(() => {
    setSelectedGroupIndex((prev) => (prev - 1 + groups.length) % groups.length)
    setInnerIndex(0)
  }, [groups.length])

  useEffect(() => {
    if (!isOpen) {
      setSelectedGroupIndex(null)
      setInnerIndex(0)
      return
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedGroupIndex !== null) closeLightbox()
        else onClose()
      }
      if (selectedGroupIndex !== null) {
        if (e.key === 'ArrowRight') {
          if (hasMultiple) goNextInner()
          else goNextGroup()
        }
        if (e.key === 'ArrowLeft') {
          if (hasMultiple) goPrevInner()
          else goPrevGroup()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, selectedGroupIndex, onClose, hasMultiple, goNextInner, goPrevInner, goNextGroup, goPrevGroup])

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
                Turkiye ve Avrupa turnelerinden sahne anlari
              </p>

              {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Yukleniyor...</p>}
              {!loading && <motion.div
                className="gallery-grid"
                variants={gridStagger}
                initial="hidden"
                animate="visible"
              >
                {groups.map((group, i) => {
                  const cover = group.photos[0]
                  const count = group.photos.length
                  return (
                    <motion.div
                      key={i}
                      className="gallery-item"
                      variants={itemFade}
                      onClick={() => { setSelectedGroupIndex(i); setInnerIndex(0) }}
                    >
                      <img src={cover.src} alt={cover.caption} loading="lazy" />
                      <div className="gallery-item-overlay">
                        <span>{group.name}</span>
                        {count > 1 && (
                          <span className="gallery-item-count">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <line x1="9" y1="3" x2="9" y2="21" />
                            </svg>
                            {count}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>}
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedGroup && (
              <motion.div
                className="gallery-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeLightbox}
              >
                <motion.img
                  key={`${selectedGroupIndex}-${innerIndex}`}
                  src={selectedGroup.photos[innerIndex].src}
                  alt={selectedGroup.photos[innerIndex].caption}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <span className="gallery-lightbox-caption">
                  {selectedGroup.photos[innerIndex].caption}
                  {hasMultiple && (
                    <span className="gallery-lightbox-counter">
                      {' '}{innerIndex + 1} / {selectedGroup.photos.length}
                    </span>
                  )}
                </span>

                {/* Inner thumbnails — only when group has multiple photos */}
                {hasMultiple && (
                  <div className="gallery-inner-thumbs" onClick={(e) => e.stopPropagation()}>
                    {selectedGroup.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        className={`gallery-inner-thumb${idx === innerIndex ? ' active' : ''}`}
                        onClick={() => setInnerIndex(idx)}
                      >
                        <img src={photo.src} alt={photo.caption} />
                      </button>
                    ))}
                  </div>
                )}

                {/* Prev */}
                <button
                  className="gallery-lightbox-nav prev"
                  onClick={(e) => { e.stopPropagation(); hasMultiple ? goPrevInner() : goPrevGroup() }}
                  aria-label="Onceki"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  className="gallery-lightbox-nav next"
                  onClick={(e) => { e.stopPropagation(); hasMultiple ? goNextInner() : goNextGroup() }}
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
