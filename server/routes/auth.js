import { Router } from 'express'
import crypto from 'crypto'
import { signToken, requireAuth } from '../middleware/auth.js'

const router = Router()

// Collect admin users from env:
//   ADMIN_USERNAME / ADMIN_PASSWORD         (primary)
//   ADMIN_USERNAME_2 / ADMIN_PASSWORD_2     (additional)
//   ADMIN_USERNAME_3 / ADMIN_PASSWORD_3
//   ... up to _20
function loadAdminUsers() {
  const users = []
  const primaryU = process.env.ADMIN_USERNAME
  const primaryP = process.env.ADMIN_PASSWORD
  if (primaryU && primaryP) users.push({ username: primaryU, password: primaryP })

  for (let i = 2; i <= 20; i++) {
    const u = process.env['ADMIN_USERNAME_' + i]
    const p = process.env['ADMIN_PASSWORD_' + i]
    if (u && p) users.push({ username: u, password: p })
  }

  if (users.length === 0) {
    users.push({ username: 'admin', password: 'blok3admin' })
  }
  return users
}

const ADMIN_USERS = loadAdminUsers()

function timingSafeEquals(a, b) {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// POST /api/blok3/auth/login
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Kullanici adi ve sifre zorunludur' })
  }

  // Iterate all admin users, timing-safe
  let matchedUser = null
  for (const u of ADMIN_USERS) {
    if (timingSafeEquals(username, u.username) && timingSafeEquals(password, u.password)) {
      matchedUser = u
      break
    }
  }

  if (!matchedUser) {
    return res.status(401).json({ success: false, message: 'Gecersiz kullanici adi veya sifre' })
  }

  const token = signToken({ username: matchedUser.username, role: 'admin' }, 8)

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
