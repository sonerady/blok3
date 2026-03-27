import { Router } from 'express'
import multer from 'multer'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

// ─── ALBUMS ───

// GET /api/blok3/albums — list all albums with cover + photo count
router.get('/albums', async (req, res) => {
  try {
    const { data: albums, error } = await supabase
      .from('blok3_albums')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    // For each album, get first photo as cover and count
    const result = []
    for (const album of albums) {
      const { data: photos, error: pErr } = await supabase
        .from('blok3_gallery')
        .select('id, src')
        .eq('album_id', album.id)
        .order('sort_order', { ascending: true })

      if (pErr) throw pErr
      result.push({
        ...album,
        cover: photos.length > 0 ? photos[0].src : null,
        photo_count: photos.length,
      })
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/albums — create album
router.post('/albums', requireAuth, async (req, res) => {
  try {
    const { name, subtitle } = req.body
    if (!name) return res.status(400).json({ success: false, message: 'Album adi zorunludur' })

    const { data: maxRow } = await supabase
      .from('blok3_albums')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxRow?.sort_order || 0) + 1

    const { data, error } = await supabase
      .from('blok3_albums')
      .insert({ name, subtitle: subtitle || null, sort_order: nextOrder })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/blok3/albums/:id — update album
router.put('/albums/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { name, subtitle } = req.body
    const updates = {}
    if (name !== undefined) updates.name = name
    if (subtitle !== undefined) updates.subtitle = subtitle

    const { data, error } = await supabase
      .from('blok3_albums')
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

// DELETE /api/blok3/albums/:id — delete album + all its photos
router.delete('/albums/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    // Get all photos in this album to delete from storage
    const { data: photos } = await supabase
      .from('blok3_gallery')
      .select('src')
      .eq('album_id', id)

    // Delete files from storage
    if (photos && photos.length) {
      const filenames = photos
        .filter(p => p.src && p.src.includes('supabase.co/storage'))
        .map(p => p.src.split('/').pop())
      if (filenames.length) {
        await supabase.storage.from('blok3-gallery').remove(filenames)
      }
    }

    // Delete album (cascade deletes photos from DB)
    const { error } = await supabase
      .from('blok3_albums')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ─── ALBUM PHOTOS ───

// GET /api/blok3/albums/:id/photos — get photos in album
router.get('/albums/:id/photos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_gallery')
      .select('*')
      .eq('album_id', req.params.id)
      .order('sort_order', { ascending: true })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/blok3/albums/:id/photos — upload photos to album (bulk, up to 20)
router.post('/albums/:id/photos', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    const albumId = req.params.id
    const files = req.files

    if (!files || !files.length) {
      return res.status(400).json({ success: false, message: 'En az bir dosya zorunludur' })
    }

    // Verify album exists
    const { data: album, error: albumErr } = await supabase
      .from('blok3_albums')
      .select('id')
      .eq('id', albumId)
      .single()

    if (albumErr || !album) {
      return res.status(404).json({ success: false, message: 'Album bulunamadi' })
    }

    const { data: maxRow } = await supabase
      .from('blok3_gallery')
      .select('sort_order')
      .eq('album_id', albumId)
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
        .upload(filename, file.buffer, { contentType: file.mimetype, upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('blok3-gallery')
        .getPublicUrl(filename)

      const { data, error } = await supabase
        .from('blok3_gallery')
        .insert({
          src: urlData.publicUrl,
          caption: '',
          sort_order: nextOrder++,
          album_id: albumId,
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

// ─── SINGLE PHOTO OPERATIONS (keep for backward compat) ───

// GET /api/blok3/gallery — all photos
router.get('/gallery', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blok3_gallery')
      .select('*, blok3_albums(name, subtitle)')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/blok3/gallery/:id — delete single photo
router.delete('/gallery/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    const { data: record, error: findError } = await supabase
      .from('blok3_gallery')
      .select('src')
      .eq('id', id)
      .single()

    if (findError) throw findError

    if (record.src && record.src.includes('supabase.co/storage')) {
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
