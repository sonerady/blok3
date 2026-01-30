import GalleryImage from './GalleryImage'
import MarqueeBanner from './MarqueeBanner'

const IMAGES = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
  'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800',
  'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
]

export default function GallerySection() {
  const allImages = [...IMAGES, ...IMAGES]

  return (
    <section className="gallery-container">
      <div className="gallery-sticky">
        <MarqueeBanner />
        <div className="gallery-grid">
          {allImages.map((src, i) => (
            <GalleryImage
              key={i}
              src={src}
              index={i}
            />
          ))}
        </div>
        <div className="gallery-label">
          <span className="gallery-label-small">IMAGE</span>
          <span className="gallery-label-large">GALLERY</span>
        </div>
      </div>
    </section>
  )
}
