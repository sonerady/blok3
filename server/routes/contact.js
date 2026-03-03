import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/blok3/contact (PUBLIC — frontend form)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Ad, e-posta, konu ve mesaj zorunludur' })
    }
    const { error } = await supabase
      .from('blok3_contacts')
      .insert({ name, email, phone: phone || null, subject, message })

    if (error) throw error
    res.status(201).json({ success: true, message: 'Mesajınız başarıyla gönderildi' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/blok3/contacts (ADMIN)
router.get('/contacts', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const offset = (page - 1) * limit

    const { count } = await supabase
      .from('blok3_contacts')
      .select('*', { count: 'exact', head: true })

    const { data, error } = await supabase
      .from('blok3_contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    res.json({ data, total: count, page, limit, totalPages: Math.ceil(count / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/blok3/contacts/:id/read (ADMIN)
router.patch('/contacts/:id/read', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('blok3_contacts')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/blok3/contacts/:id (ADMIN)
router.delete('/contacts/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('blok3_contacts')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
