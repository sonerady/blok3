import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/blok3/events (PUBLIC)
router.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_events')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/events (ADMIN)
router.post('/events', requireAuth, async (req, res) => {
  try {
    const { date, city, country, venue, ticket_url } = req.body
    if (!date || !city || !country || !venue) {
      return res.status(400).json({ success: false, message: 'Tarih, şehir, ülke ve mekan zorunludur' })
    }
    const { data, error } = await supabase
      .from('blok3_events')
      .insert({ date, city, country, venue, ticket_url: ticket_url || '' })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/events/:id (ADMIN)
router.put('/events/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { date, city, country, venue, ticket_url } = req.body
    const { data, error } = await supabase
      .from('blok3_events')
      .update({ date, city, country, venue, ticket_url, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/blok3/events/:id (ADMIN)
router.delete('/events/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('blok3_events')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
