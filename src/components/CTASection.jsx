import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-30%' })

  return (
    <section ref={ref} className="cta-section">
      <motion.h2
        className="cta-title"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6 }}
      >
        CATCH ME LIVE
      </motion.h2>
      <motion.div
        className="cta-dates"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p>ISTANBUL - JUL 15</p>
        <p>BERLIN - JUL 22</p>
        <p>LONDON - AUG 03</p>
        <p>PARIS - AUG 10</p>
      </motion.div>
    </section>
  )
}
