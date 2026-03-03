import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const subjectOptions = [
  'İş Birliği',
  'Konser & Etkinlik',
  'Basın & Medya',
  'Diğer',
]

export default function ContactSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState(null) // 'sending' | 'sent' | 'error'

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch('https://wearup-server.onrender.com/api/blok3/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setStatus('sent')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setStatus(null), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <section ref={sectionRef} className="contact-section" id="contact">
      <div className="contact-inner">
        {/* Left — info */}
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="contact-label">İLETİŞİM</span>
          <h2 className="contact-heading">Bizimle İletişime Geçin</h2>
          <p className="contact-desc">
            İş birliği, konser, basın ve diğer talepleriniz için formu doldurabilir veya doğrudan e-posta gönderebilirsiniz.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href="mailto:info@blok3team.com">info@blok3team.com</a>
            </div>
            <div className="contact-detail-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Istanbul, Türkiye</span>
            </div>
          </div>

          {/* Social links */}
          <div className="contact-socials">
            <a href="https://www.instagram.com/blok3.real/" target="_blank" rel="noreferrer" className="contact-social" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a href="https://x.com/realblok3" target="_blank" rel="noreferrer" className="contact-social" aria-label="X">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.youtube.com/@blok3real" target="_blank" rel="noreferrer" className="contact-social" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="contact-form-row">
            <div className="contact-field">
              <label htmlFor="contact-name">Ad Soyad</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">E-posta</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ornek@mail.com"
              />
            </div>
          </div>

          <div className="contact-form-row">
            <div className="contact-field">
              <label htmlFor="contact-phone">Telefon <span className="contact-optional">(Opsiyonel)</span></label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+90 5XX XXX XX XX"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-subject">Konu</label>
              <select
                id="contact-subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="" disabled>Konu Seçiniz</option>
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Mesajınız</label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Mesajınızı buraya yazın..."
            />
          </div>

          <button
            type="submit"
            className="contact-submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Gönderiliyor...' : status === 'sent' ? 'Gönderildi!' : 'Gönder'}
          </button>

          {status === 'error' && (
            <p className="contact-error">Bir hata oluştu. Lütfen tekrar deneyin.</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
