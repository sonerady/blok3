import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/blok3/subscribe (PUBLIC — frontend form)
router.post('/subscribe', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city } = req.body
    if (!firstName || !lastName || !email || !city) {
      return res.status(400).json({ success: false, message: 'Ad, soyad, e-posta ve şehir zorunludur' })
    }

    const { data: existing } = await supabase
      .from('blok3_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return res.status(409).json({ success: false, message: 'Bu e-posta adresi zaten kayıtlı' })
    }

    const { error } = await supabase
      .from('blok3_subscribers')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        city,
      })

    if (error) throw error
    res.status(201).json({ success: true, message: 'Abonelik başarıyla oluşturuldu' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/blok3/subscribers (ADMIN)
router.get('/subscribers', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const offset = (page - 1) * limit

    const { count } = await supabase
      .from('blok3_subscribers')
      .select('*', { count: 'exact', head: true })

    const { data, error } = await supabase
      .from('blok3_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    res.json({ data, total: count, page, limit, totalPages: Math.ceil(count / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/blok3/subscribers/export (ADMIN — CSV/Excel download)
router.get('/subscribers/export', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const BOM = '\uFEFF'
    const headers = ['#', 'Ad', 'Soyad', 'E-posta', 'Telefon', 'Sehir', 'Kayit Tarihi']

    const rows = (data || []).map((row, i) => [
      i + 1,
      row.first_name || '',
      row.last_name || '',
      row.email || '',
      row.phone ? '+90 ' + row.phone : '',
      row.city || '',
      new Date(row.created_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
    ])

    const csvContent = BOM + [headers, ...rows]
      .map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(';'))
      .join('\n')

    const filename = 'blok3-aboneler-' + new Date().toISOString().slice(0, 10) + '.csv'

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(csvContent)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
