import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const turneDates = [
  { city: 'İSTANBUL', date: '14 MART' },
  { city: 'ANKARA', date: '21 MART' },
  { city: 'İZMİR', date: '28 MART' },
  { city: 'BURSA', date: '4 NİSAN' },
  { city: 'ANTALYA', date: '11 NİSAN' },
  { city: 'ADANA', date: '18 NİSAN' },
  { city: 'TRABZON', date: '25 NİSAN' },
  { city: 'GAZİANTEP', date: '2 MAYIS' },
]

export default function TurneSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-20%' })

  return (
    <section ref={ref} className="turne-section">
      <motion.p
        className="turne-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        YAKINDA
      </motion.p>

      <motion.h2
        className="turne-title"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        2026 TURNE
      </motion.h2>

      <motion.div
        className="turne-dates"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        {turneDates.map((item, i) => (
          <p key={i}>{item.city} — {item.date}</p>
        ))}
      </motion.div>
    </section>
  )
}
