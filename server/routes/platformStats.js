import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/blok3/platform-stats (PUBLIC)
router.get('/platform-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_platform_stats')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/platform-stats/:id (ADMIN)
router.put('/platform-stats/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { number, label, description, sort_order } = req.body
    const updates = { updated_at: new Date().toISOString() }
    if (number !== undefined) updates.number = number
    if (label !== undefined) updates.label = label
    if (description !== undefined) updates.description = description
    if (sort_order !== undefined) updates.sort_order = sort_order

    const { data, error } = await supabase
      .from('blok3_platform_stats')
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
