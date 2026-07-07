import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch('/api/blok3/events')
      .then((res) => res.json())
      .then((data) => {
        // Bugünden önceki konserleri gizle, kalanları en yeniden en eskiye sırala
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const upcoming = data
          .map((e) => ({ ...e, ticketUrl: e.ticket_url }))
          .filter((e) => new Date(e.date) >= today)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
        setEvents(upcoming)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isOpen])

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
                {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Yükleniyor...</p>}
                {!loading && !events.length && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Yaklaşan konser bulunmuyor</p>}
                {!loading && events.map((event, i) => {
                  const d = parseDate(event.date)
                  return (
                    <motion.div
                      key={event.date + event.city}
                      className="event-card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.04 }}
                    >
                      <div className="event-date-block">
                        <span className="event-day">{d.day}</span>
                        <span className="event-month">{d.month} {d.year}</span>
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
                        className="event-ticket-btn"
                      >
                        Bilet Al
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
