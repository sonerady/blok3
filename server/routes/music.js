import { Router } from 'express'
import multer from 'multer'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || /\.mp3$/i.test(file.originalname)
    if (!ok) return cb(new Error('Sadece MP3 dosyasi yukleyebilirsiniz'))
    cb(null, true)
  },
})

// GET /api/blok3/music/active — PUBLIC, frontend için
router.get('/music/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_music')
      .select('id, title, file_url')
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    res.json(data || null)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/blok3/music — ADMIN, tüm müzikler
router.get('/music', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_music')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/music — ADMIN, upload mp3
router.post('/music', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ success: false, message: 'Dosya zorunludur' })

    const title = (req.body.title || file.originalname.replace(/\.[^.]+$/, '')).slice(0, 200)
    const ext = (file.originalname.split('.').pop() || 'mp3').toLowerCase()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('blok3-music')
      .upload(filename, file.buffer, { contentType: file.mimetype, upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('blok3-music')
      .getPublicUrl(filename)

    // İlk kayıtsa otomatik aktif yap
    const { count } = await supabase
      .from('blok3_music')
      .select('id', { count: 'exact', head: true })

    const { data, error } = await supabase
      .from('blok3_music')
      .insert({
        title,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.mimetype,
        is_active: (count || 0) === 0,
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/blok3/music/:id/active — ADMIN, aktif olarak işaretle
router.patch('/music/:id/active', requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    // Önce herkesi pasifleştir
    const { error: deactivateError } = await supabase
      .from('blok3_music')
      .update({ is_active: false })
      .eq('is_active', true)

    if (deactivateError) throw deactivateError

    // Sonra seçileni aktif yap
    const { data, error } = await supabase
      .from('blok3_music')
      .update({ is_active: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/music/:id — ADMIN, başlık güncelle
router.put('/music/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body
    const updates = {}
    if (title !== undefined) updates.title = title

    const { data, error } = await supabase
      .from('blok3_music')
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

// DELETE /api/blok3/music/:id — ADMIN
router.delete('/music/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    const { data: record, error: findError } = await supabase
      .from('blok3_music')
      .select('file_url')
      .eq('id', id)
      .single()

    if (findError) throw findError

    if (record?.file_url && record.file_url.includes('supabase.co/storage')) {
      const filename = record.file_url.split('/').pop()
      await supabase.storage.from('blok3-music').remove([filename])
    }

    const { error } = await supabase
      .from('blok3_music')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Multer hata yakalayıcı
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Dosya cok buyuk (maksimum 15 MB)' })
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
  next()
})

export default router
