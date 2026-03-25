import { Router } from 'express'
import multer from 'multer'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// GET /api/blok3/gallery
router.get('/gallery', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/gallery (ADMIN — single file upload)
router.post('/gallery', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { caption, group_name } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ success: false, message: 'Dosya zorunludur' })
    }

    const ext = file.originalname.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('blok3-gallery')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('blok3-gallery')
      .getPublicUrl(filename)

    const src = urlData.publicUrl

    const { data: maxRow } = await supabase
      .from('blok3_gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxRow?.sort_order || 0) + 1

    const { data, error } = await supabase
      .from('blok3_gallery')
      .insert({ src, caption: caption || '', sort_order: nextOrder, group_name: group_name || null })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/gallery/bulk (ADMIN — multiple file upload)
router.post('/gallery/bulk', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    const { caption, group_name } = req.body
    const files = req.files

    if (!files || !files.length) {
      return res.status(400).json({ success: false, message: 'En az bir dosya zorunludur' })
    }

    const { data: maxRow } = await supabase
      .from('blok3_gallery')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    let nextOrder = (maxRow?.sort_order || 0) + 1
    const results = []

    for (const file of files) {
      const ext = file.originalname.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('blok3-gallery')
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('blok3-gallery')
        .getPublicUrl(filename)

      const { data, error } = await supabase
        .from('blok3_gallery')
        .insert({
          src: urlData.publicUrl,
          caption: caption || '',
          sort_order: nextOrder++,
          group_name: group_name || null,
        })
        .select()
        .single()

      if (error) throw error
      results.push(data)
    }

    res.status(201).json({ success: true, data: results, count: results.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/gallery/:id (ADMIN)
router.put('/gallery/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { caption, sort_order, src, group_name } = req.body
    const updates = {}
    if (caption !== undefined) updates.caption = caption
    if (sort_order !== undefined) updates.sort_order = sort_order
    if (src !== undefined) updates.src = src
    if (group_name !== undefined) updates.group_name = group_name

    const { data, error } = await supabase
      .from('blok3_gallery')
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

// DELETE /api/blok3/gallery/:id (ADMIN)
router.delete('/gallery/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    const { data: record, error: findError } = await supabase
      .from('blok3_gallery')
      .select('src')
      .eq('id', id)
      .single()

    if (findError) throw findError

    if (record.src.includes('supabase.co/storage')) {
      const filename = record.src.split('/').pop()
      await supabase.storage.from('blok3-gallery').remove([filename])
    }

    const { error } = await supabase
      .from('blok3_gallery')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
