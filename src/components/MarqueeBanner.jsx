const MARQUEE_ITEMS = [
  'BLOK3 FESTIVAL', '3 DAYS OF PURE ENERGY', 'SUMMER FEST',
  'WEEK OF BEATS', 'FEEL THE BASS', 'NONSTOP VIBES', 'RAP SEASON',
]

function MarqueeGroup() {
  return (
    <>
      {MARQUEE_ITEMS.map((text, i) => (
        <span key={i} className="marquee-item">
          <span className="marquee-text">{text}</span>
          <span className="marquee-star">★</span>
        </span>
      ))}
    </>
  )
}

export default function MarqueeBanner() {
  return (
    <div className="marquee-banner">
      <div className="marquee-track">
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  )
}
