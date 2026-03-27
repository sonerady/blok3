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

export default function GalleryModal({ isOpen, onClose }) {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [openedAlbum, setOpenedAlbum] = useState(null) // { id, name, subtitle }
  const [photos, setPhotos] = useState([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Fetch albums list
  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch('/api/blok3/albums')
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOpenedAlbum(null)
      setPhotos([])
      setLightboxIndex(null)
    }
  }, [isOpen])

  // Fetch album photos when album is opened
  useEffect(() => {
    if (!openedAlbum) return
    setPhotosLoading(true)
    fetch(`/api/blok3/albums/${openedAlbum.id}/photos`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data)
        setPhotosLoading(false)
      })
      .catch(() => setPhotosLoading(false))
  }, [openedAlbum])

  const closeLightbox = () => setLightboxIndex(null)
  const closeAlbum = () => { setOpenedAlbum(null); setPhotos([]); setLightboxIndex(null) }

  const goNext = useCallback(() => {
    if (!photos.length) return
    setLightboxIndex((prev) => (prev + 1) % photos.length)
  }, [photos])

  const goPrev = useCallback(() => {
    if (!photos.length) return
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) closeLightbox()
        else if (openedAlbum) closeAlbum()
        else onClose()
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') goNext()
        if (e.key === 'ArrowLeft') goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, openedAlbum, lightboxIndex, onClose, goNext, goPrev])

  const handleAlbumClick = (album) => {
    if (album.photo_count === 0) return
    setOpenedAlbum(album)
    setLightboxIndex(null)
  }

  // ─── ALBUMS VIEW ───
  const renderAlbumsView = () => (
    <div className="gallery-modal-content">
      <span className="gallery-label">2025 TURNE</span>
      <h2 className="gallery-heading">Konser Galerisi</h2>
      <p className="gallery-desc">Turkiye ve Avrupa turnelerinden sahne anlari</p>

      {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Yukleniyor...</p>}
      {!loading && !albums.length && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Henuz album yok</p>}
      {!loading && albums.length > 0 && (
        <motion.div className="gallery-grid" variants={gridStagger} initial="hidden" animate="visible">
          {albums.filter(a => a.photo_count > 0).map((album) => (
            <motion.div
              key={album.id}
              className="gallery-item"
              variants={itemFade}
              onClick={() => handleAlbumClick(album)}
            >
              <img src={album.cover} alt={album.name} loading="lazy" />
              <div className="gallery-item-overlay">
                <span className="gallery-item-name">{album.name}</span>
                {album.photo_count > 1 && (
                  <span className="gallery-item-count">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                    {album.photo_count}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )

  // ─── ALBUM PHOTOS VIEW ───
  const renderAlbumPhotos = () => {
    if (!openedAlbum) return null
    return (
      <div className="gallery-modal-content">
        <button className="gallery-album-back" onClick={closeAlbum}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Geri
        </button>
        <h2 className="gallery-heading" style={{ marginTop: '0.5rem' }}>{openedAlbum.name}</h2>
        {openedAlbum.subtitle && <p className="gallery-desc">{openedAlbum.subtitle}</p>}
        <p className="gallery-desc">{photos.length} gorsel</p>

        {photosLoading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>Yukleniyor...</p>}
        {!photosLoading && (
          <motion.div className="gallery-grid" variants={gridStagger} initial="hidden" animate="visible">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                className={`gallery-item${idx === 0 ? ' gallery-item-cover' : ''}`}
                variants={itemFade}
                onClick={() => setLightboxIndex(idx)}
              >
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                {idx === 0 && <span className="gallery-cover-badge">Kapak</span>}
              </motion.div>
            ))}
          </motion.div>
        )}
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

            {openedAlbum === null ? renderAlbumsView() : renderAlbumPhotos()}
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxIndex !== null && photos[lightboxIndex] && (
              <motion.div
                className="gallery-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeLightbox}
              >
                <motion.img
                  key={lightboxIndex}
                  src={photos[lightboxIndex].src}
                  alt={photos[lightboxIndex].caption}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <span className="gallery-lightbox-caption">
                  {photos[lightboxIndex].caption}
                  {photos.length > 1 && (
                    <span className="gallery-lightbox-counter">
                      {' '}{lightboxIndex + 1} / {photos.length}
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
