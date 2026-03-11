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

// POST /api/blok3/concert-stats (ADMIN)
router.post('/concert-stats', requireAuth, async (req, res) => {
  try {
    const { region, stat_key, value, suffix, label, sort_order } = req.body
    if (!region || !stat_key) {
      return res.status(400).json({ success: false, message: 'region ve stat_key zorunlu' })
    }
    const { data, error } = await supabase
      .from('blok3_concert_stats')
      .insert({ region, stat_key, value: value || 0, suffix: suffix || '', label: label || '', sort_order: sort_order || 0 })
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/blok3/concert-stats/:id (ADMIN)
router.delete('/concert-stats/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('blok3_concert_stats')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
