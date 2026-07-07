import { motion } from 'framer-motion'

const steps = [
  { label: 'BİYOGRAFİ' },
  { label: 'YENİ ALBÜM' },
  { label: 'TÜRKİYE TOUR' },
  { label: '2026 TURNE PLANLAMASI', hasProgress: true },
  { label: '2025 KONSER PERFORMANSLARI' },
  { label: 'PLATFORMLAR' },
  { label: 'İLETİŞİM' },
]

const mobileHiddenSteps = [0, 1, 5]

export default function StepNav({ activeStep = 0, videoProgress = 0, light = false, hideOnMobile = false, hideOnContact = false }) {
  const hideMobileStep = mobileHiddenSteps.includes(activeStep)
  return (
    <motion.nav
      className={`step-nav${light ? ' light' : ''}${hideOnMobile ? ' hide-mobile' : ''}${hideOnContact ? ' hide-on-contact' : ''}${hideMobileStep ? ' hide-mobile-step' : ''}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {steps.map((step, i) => {
        const isActive = i === activeStep
        const isPast = i < activeStep
        return (
          <div key={i} className={`step-nav-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}>
            {i > 0 && <div className="step-nav-line" />}
            <div className="step-nav-row">
              <div className="step-nav-dot" />
              <span className="step-nav-label">
                {step.label}
                {step.hasProgress && videoProgress > 0 && videoProgress < 100 && (
                  <span className="step-nav-progress"> {videoProgress}%</span>
                )}
              </span>
            </div>
          </div>
        )
      })}
    </motion.nav>
  )
}
