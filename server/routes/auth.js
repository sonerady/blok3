import { Router } from 'express'
import crypto from 'crypto'
import { signToken, requireAuth } from '../middleware/auth.js'

const router = Router()

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'blok3admin'

// POST /api/blok3/auth/login
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Kullanici adi ve sifre zorunludur' })
  }

  // Timing-safe comparison to prevent timing attacks
  const usernameMatch =
    username.length === ADMIN_USERNAME.length &&
    crypto.timingSafeEqual(Buffer.from(username), Buffer.from(ADMIN_USERNAME))

  const passwordMatch =
    password.length === ADMIN_PASSWORD.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD))

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ success: false, message: 'Gecersiz kullanici adi veya sifre' })
  }

  const token = signToken({ username: ADMIN_USERNAME, role: 'admin' }, 8)

  res.json({
    success: true,
    token,
    expiresIn: 8 * 3600,
    message: 'Giris basarili',
  })
})

// GET /api/blok3/auth/verify — check if token is still valid
router.get('/auth/verify', requireAuth, (req, res) => {
  res.json({ success: true, admin: req.admin })
})

export default router
