import { motion, AnimatePresence } from 'framer-motion'

const events = [
  { date: '2026-01-09', city: 'Berlin', country: 'Almanya', venue: 'Columbiahalle', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-10', city: 'Ludwigsburg', country: 'Almanya', venue: 'MHP Arena', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-11', city: 'Münih', country: 'Almanya', venue: 'TonHalle', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-17', city: 'Düsseldorf', country: 'Almanya', venue: 'Mitsubishi Electric HALLE', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-18', city: 'Hamburg', country: 'Almanya', venue: 'Grosse Freiheit 36', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-24', city: 'Hohenems', country: 'Avusturya', venue: 'Tennis.Event.Center', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-30', city: 'Mannheim', country: 'Almanya', venue: 'Maimarkthalle', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-01-31', city: 'Utrecht', country: 'Hollanda', venue: 'Gietijzer', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-02-01', city: 'Frankfurt', country: 'Almanya', venue: 'Zoom', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-02-07', city: 'Londra', country: 'İngiltere', venue: 'indigo at The O2', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-02-14', city: 'Bakü', country: 'Azerbaycan', venue: 'Jolly Joker Baku', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-02-15', city: 'Bursa', country: 'Türkiye', venue: 'Club Inferno', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
  { date: '2026-03-27', city: 'Hannover', country: 'Almanya', venue: 'Swiss Life Hall', ticketUrl: 'https://www.bubilet.com.tr/sanatci/blok3-' },
]

const months = {
  '01': 'OCA', '02': 'ŞUB', '03': 'MAR', '04': 'NİS',
  '05': 'MAY', '06': 'HAZ', '07': 'TEM', '08': 'AĞU',
  '09': 'EYL', '10': 'EKİ', '11': 'KAS', '12': 'ARA',
}

const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d))
  return {
    day: d,
    month: months[m],
    year: y,
    dayName: days[dateObj.getDay()],
  }
}

function getCountryFlag(country) {
  const flags = {
    'Almanya': '🇩🇪',
    'Avusturya': '🇦🇹',
    'Hollanda': '🇳🇱',
    'İngiltere': '🇬🇧',
    'Azerbaycan': '🇦🇿',
    'Türkiye': '🇹🇷',
  }
  return flags[country] || ''
}

export default function EventsModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="events-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="events-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="events-close" onClick={onClose} aria-label="Kapat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="events-modal-scroll">
              <div className="events-header">
                <span className="events-label">2026 TURNE</span>
                <h2 className="events-heading">Konser Takvimi</h2>
                <p className="events-desc">Avrupa ve Türkiye turne tarihlerimiz</p>
              </div>

              <div className="events-list">
                {events.map((event, i) => {
                  const d = parseDate(event.date)
                  const isPast = new Date(event.date) < new Date()
                  return (
                    <motion.div
                      key={event.date + event.city}
                      className={`event-card${isPast ? ' event-past' : ''}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.04 }}
                    >
                      <div className="event-date-block">
                        <span className="event-day">{d.day}</span>
                        <span className="event-month">{d.month}</span>
                        <span className="event-day-name">{d.dayName}</span>
                      </div>

                      <div className="event-divider" />

                      <div className="event-info">
                        <div className="event-city-row">
                          <span className="event-flag">{getCountryFlag(event.country)}</span>
                          <span className="event-city">{event.city}</span>
                          <span className="event-country">{event.country}</span>
                        </div>
                        <span className="event-venue">{event.venue}</span>
                      </div>

                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`event-ticket-btn${isPast ? ' disabled' : ''}`}
                        onClick={(e) => isPast && e.preventDefault()}
                      >
                        {isPast ? 'Geçti' : 'Bilet Al'}
                      </a>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
