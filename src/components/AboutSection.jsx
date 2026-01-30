import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-20%' })

  return (
    <section ref={ref} className="about-section">
      <motion.h2
        className="buradasin-text"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        buradasın
      </motion.h2>
    </section>
  )
}
