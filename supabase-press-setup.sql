-- ============================================
-- BLOK3 Press Images — Supabase Setup
-- Supabase SQL Editor'da çalıştırın
-- ============================================

-- ============================================
-- STORAGE BUCKET: blok3-press
-- Haberler (press) için görsel yüklemesi.
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blok3-press', 'blok3-press', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read blok3-press"
ON storage.objects FOR SELECT
USING (bucket_id = 'blok3-press');

CREATE POLICY "Service insert blok3-press"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blok3-press');

CREATE POLICY "Service update blok3-press"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blok3-press');

CREATE POLICY "Service delete blok3-press"
ON storage.objects FOR DELETE
USING (bucket_id = 'blok3-press');
