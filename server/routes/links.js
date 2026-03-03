import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/blok3/links (PUBLIC)
router.get('/links', async (req, res) => {
  try {
    const { category, all } = req.query
    let query = supabase
      .from('blok3_links')
      .select('*')
      .order('sort_order', { ascending: true })

    if (all !== 'true') {
      query = query.eq('is_active', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/links (ADMIN)
router.post('/links', requireAuth, async (req, res) => {
  try {
    const { category, platform, label, url, sort_order, is_active } = req.body
    if (!category || !platform || !label || !url) {
      return res.status(400).json({ success: false, message: 'category, platform, label ve url zorunludur' })
    }

    const { data, error } = await supabase
      .from('blok3_links')
      .insert({ category, platform, label, url, sort_order: sort_order || 0, is_active: is_active !== false })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/links/:id (ADMIN)
router.put('/links/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { category, platform, label, url, sort_order, is_active } = req.body
    const updates = {}
    if (category !== undefined) updates.category = category
    if (platform !== undefined) updates.platform = platform
    if (label !== undefined) updates.label = label
    if (url !== undefined) updates.url = url
    if (sort_order !== undefined) updates.sort_order = sort_order
    if (is_active !== undefined) updates.is_active = is_active

    const { data, error } = await supabase
      .from('blok3_links')
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

// DELETE /api/blok3/links/:id (ADMIN)
router.delete('/links/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('blok3_links')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
