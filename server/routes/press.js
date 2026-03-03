import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/blok3/press (PUBLIC)
router.get('/press', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_press')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/press (ADMIN)
router.post('/press', requireAuth, async (req, res) => {
  try {
    const { title, image_url, link } = req.body
    if (!title || !image_url || !link) {
      return res.status(400).json({ success: false, message: 'Baslik, gorsel URL ve link zorunludur' })
    }

    const { data, error } = await supabase
      .from('blok3_press')
      .insert({ title, image_url, link })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/press/:id (ADMIN)
router.put('/press/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { title, image_url, link } = req.body
    const updates = {}
    if (title !== undefined) updates.title = title
    if (image_url !== undefined) updates.image_url = image_url
    if (link !== undefined) updates.link = link

    const { data, error } = await supabase
      .from('blok3_press')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/blok3/press/:id (ADMIN)
router.delete('/press/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('blok3_press')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
