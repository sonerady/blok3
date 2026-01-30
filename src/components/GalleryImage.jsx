export default function GalleryImage({ src, index }) {
  return (
    <div
      className="gallery-image-wrapper"
      style={{
        position: 'absolute',
        left: `${index * 12}vw`,
        top: `${index * 8}vh`,
        width: '28vw',
        height: '28vw',
      }}
    >
      <img
        src={src}
        alt={`Gallery ${index + 1}`}
        className="gallery-image"
        loading="lazy"
      />
    </div>
  )
}
