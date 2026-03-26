import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
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
      groupMap[key] = { name: photo.group_name || photo.caption, isSolo: !photo.group_name, photos: [] }
      groups.push(groupMap[key])
    }
    groupMap[key].photos.push(photo)
  })

  return groups
}

export default function GalleryModal({ isOpen, onClose }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  // null = albums view, number = album detail view
  const [openedGroupIndex, setOpenedGroupIndex] = useState(null)
  // null = no lightbox, number = lightbox photo index within group
  const [lightboxIndex, setLightboxIndex] = useState(null)

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
  const openedGroup = openedGroupIndex !== null ? groups[openedGroupIndex] : null

  const closeLightbox = () => setLightboxIndex(null)
  const closeAlbum = () => { setOpenedGroupIndex(null); setLightboxIndex(null) }

  const goNext = useCallback(() => {
    if (!openedGroup) return
    setLightboxIndex((prev) => (prev + 1) % openedGroup.photos.length)
  }, [openedGroup])

  const goPrev = useCallback(() => {
    if (!openedGroup) return
    setLightboxIndex((prev) => (prev - 1 + openedGroup.photos.length) % openedGroup.photos.length)
  }, [openedGroup])

  useEffect(() => {
    if (!isOpen) {
      setOpenedGroupIndex(null)
      setLightboxIndex(null)
      return
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) closeLightbox()
        else if (openedGroupIndex !== null) closeAlbum()
        else onClose()
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') goNext()
        if (e.key === 'ArrowLeft') goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, openedGroupIndex, lightboxIndex, onClose, goNext, goPrev])

  const handleAlbumClick = (groupIndex) => {
    const group = groups[groupIndex]
    // Solo photo (no group) — open lightbox directly
    if (group.isSolo) {
      setOpenedGroupIndex(groupIndex)
      setLightboxIndex(0)
    } else {
      // Album with group — open album detail
      setOpenedGroupIndex(groupIndex)
      setLightboxIndex(null)
    }
  }

  // ─── ALBUMS VIEW ───
  const renderAlbumsView = () => (
    <div className="gallery-modal-content">
      <span className="gallery-label">2025 TURNE</span>
      <h2 className="gallery-heading">Konser Galerisi</h2>
      <p className="gallery-desc">Turkiye ve Avrupa turnelerinden sahne anlari</p>

      {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Yukleniyor...</p>}
      {!loading && (
        <motion.div className="gallery-grid" variants={gridStagger} initial="hidden" animate="visible">
          {groups.map((group, i) => {
            const cover = group.photos[0]
            const count = group.photos.length
            return (
              <motion.div
                key={i}
                className="gallery-item"
                variants={itemFade}
                onClick={() => handleAlbumClick(i)}
              >
                <img src={cover.src} alt={cover.caption} loading="lazy" />
                <div className="gallery-item-overlay">
                  <span className="gallery-item-name">{group.name}</span>
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
        </motion.div>
      )}
    </div>
  )

  // ─── ALBUM DETAIL VIEW ───
  const renderAlbumDetail = () => {
    if (!openedGroup) return null
    return (
      <div className="gallery-modal-content">
        <button className="gallery-album-back" onClick={closeAlbum}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Geri
        </button>
        <h2 className="gallery-heading" style={{ marginTop: '0.5rem' }}>{openedGroup.name}</h2>
        <p className="gallery-desc">{openedGroup.photos.length} gorsel</p>

        <motion.div className="gallery-grid" variants={gridStagger} initial="hidden" animate="visible">
          {openedGroup.photos.map((photo, idx) => (
            <motion.div
              key={idx}
              className={`gallery-item${idx === 0 ? ' gallery-item-cover' : ''}`}
              variants={itemFade}
              onClick={() => setLightboxIndex(idx)}
            >
              <img src={photo.src} alt={photo.caption} loading="lazy" />
              {idx === 0 && <span className="gallery-cover-badge">Kapak</span>}
              <div className="gallery-item-overlay">
                <span>{photo.caption}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }

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
            <button className="gallery-modal-close" onClick={onClose} aria-label="Kapat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {openedGroupIndex === null || (openedGroup && openedGroup.isSolo)
              ? renderAlbumsView()
              : renderAlbumDetail()
            }
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {openedGroup && lightboxIndex !== null && openedGroup.photos[lightboxIndex] && (
              <motion.div
                className="gallery-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeLightbox}
              >
                <motion.img
                  key={`${openedGroupIndex}-${lightboxIndex}`}
                  src={openedGroup.photos[lightboxIndex].src}
                  alt={openedGroup.photos[lightboxIndex].caption}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <span className="gallery-lightbox-caption">
                  {openedGroup.photos[lightboxIndex].caption}
                  {openedGroup.photos.length > 1 && (
                    <span className="gallery-lightbox-counter">
                      {' '}{lightboxIndex + 1} / {openedGroup.photos.length}
                    </span>
                  )}
                </span>

                {/* Prev */}
                <button
                  className="gallery-lightbox-nav prev"
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  aria-label="Onceki"
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
