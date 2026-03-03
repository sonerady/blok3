import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/blok3/concert-stats (PUBLIC)
router.get('/concert-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_concert_stats')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/concert-stats/:id (ADMIN)
router.put('/concert-stats/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { value, suffix, label, sort_order } = req.body
    const updates = { updated_at: new Date().toISOString() }
    if (value !== undefined) updates.value = value
    if (suffix !== undefined) updates.suffix = suffix
    if (label !== undefined) updates.label = label
    if (sort_order !== undefined) updates.sort_order = sort_order

    const { data, error } = await supabase
      .from('blok3_concert_stats')
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

export default router
