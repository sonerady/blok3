-- ============================================
-- BLOK3 Music — Supabase Setup
-- Supabase SQL Editor'da çalıştırın
-- ============================================

-- ============================================
-- TABLE: blok3_music
-- Ana sayfada çalan müziği yönetir.
-- Aynı anda sadece 1 kayıt is_active = true olabilir.
-- ============================================
CREATE TABLE IF NOT EXISTS blok3_music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  mime_type TEXT DEFAULT 'audio/mpeg',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blok3_music DISABLE ROW LEVEL SECURITY;

-- Aynı anda sadece 1 kayıt aktif olsun (partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS blok3_music_only_one_active
  ON blok3_music (is_active)
  WHERE is_active = true;

-- Son güncelleme otomatik
CREATE OR REPLACE FUNCTION blok3_music_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blok3_music_updated_at_trigger ON blok3_music;
CREATE TRIGGER blok3_music_updated_at_trigger
  BEFORE UPDATE ON blok3_music
  FOR EACH ROW
  EXECUTE FUNCTION blok3_music_set_updated_at();

-- ============================================
-- STORAGE BUCKET: blok3-music
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blok3-music', 'blok3-music', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read blok3-music"
ON storage.objects FOR SELECT
USING (bucket_id = 'blok3-music');

CREATE POLICY "Service insert blok3-music"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blok3-music');

CREATE POLICY "Service update blok3-music"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blok3-music');

CREATE POLICY "Service delete blok3-music"
ON storage.objects FOR DELETE
USING (bucket_id = 'blok3-music');
