import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'blok3-default-secret-change-me'

// Simple JWT implementation (no external dependency needed)
function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64url')
}

function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString()
}

export function signToken(payload, expiresInHours = 8) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + expiresInHours * 3600 }

  const segments = [
    base64UrlEncode(JSON.stringify(header)),
    base64UrlEncode(JSON.stringify(body)),
  ]

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(segments.join('.'))
    .digest('base64url')

  return [...segments, signature].join('.')
}

export function verifyToken(token) {
  try {
    const [headerB64, payloadB64, signature] = token.split('.')
    if (!headerB64 || !payloadB64 || !signature) return null

    const expected = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url')

    // Timing-safe comparison
    if (expected.length !== signature.length) return null
    const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    if (!valid) return null

    const payload = JSON.parse(base64UrlDecode(payloadB64))

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Yetkilendirme gerekli' })
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)

  if (!payload) {
    return res.status(401).json({ success: false, message: 'Gecersiz veya suresi dolmus token' })
  }

  req.admin = payload
  next()
}
