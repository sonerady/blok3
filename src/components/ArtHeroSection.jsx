export default function ArtHeroSection() {
  return (
    <section className="art-hero">
      <div className="art-hero-inner">
        {/* Nav */}
        <nav className="art-nav">
          <span className="art-nav-icon">+</span>
          <span className="art-nav-logo">Knm</span>
          <span className="art-nav-link">TICKETS</span>
        </nav>

        {/* Main content */}
        <div className="art-content">
          {/* Side labels */}
          <span className="art-side-label art-side-left">
            HERITAGE<br />ART HALL
          </span>
          <span className="art-side-label art-side-right">
            SINCE<br />1957
          </span>

          {/* Floating images */}
          <div className="art-frame art-frame-1">
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400"
              alt="Painting 1"
            />
          </div>
          <div className="art-frame art-frame-2">
            <img
              src="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400"
              alt="Painting 2"
            />
          </div>
          <div className="art-frame art-frame-3">
            <img
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600"
              alt="Painting 3"
            />
          </div>
          <div className="art-frame art-frame-4">
            <img
              src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=400"
              alt="Painting 4"
            />
          </div>

          {/* Big title */}
          <h1 className="art-title">
            <span className="art-title-line">THE ART</span>
            <span className="art-title-line">THAT KEEPS</span>
            <span className="art-title-line">SPEAKING</span>
          </h1>
        </div>

        {/* Bottom exhibition card */}
        <div className="art-bottom">
          <div className="art-exhibition-card">
            <div className="art-exhibition-thumb">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200"
                alt="Exhibition"
              />
            </div>
            <div className="art-exhibition-info">
              <h3 className="art-exhibition-title">
                Current <em>Exhibition</em>
              </h3>
              <p className="art-exhibition-desc">
                A CAREFULLY SELECTED GROUP OF WORKS FROM THE EXHIBITION, PRESENTING INFLUENTIAL ARTISTS AND ESSENTIAL VISUAL LANGUAGES.
              </p>
              <span className="art-exhibition-arrow">&rarr;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
