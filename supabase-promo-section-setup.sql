-- ============================================
-- BLOK3 Promo Section — Supabase Setup
-- Supabase SQL Editor'da çalıştırın
-- Landing'de Türkiye Tour'dan önce gelen, içeriği
-- dashboard'dan yönetilen tanıtım section'ı.
-- ============================================

CREATE TABLE IF NOT EXISTS blok3_promo_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_label text NOT NULL DEFAULT 'ÖZEL DUYURU',
  desktop_image_url text,
  mobile_image_url text,
  button_text text NOT NULL DEFAULT 'Keşfet',
  button_url text NOT NULL DEFAULT 'https://www.bubilet.com.tr/sanatci/blok3-',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tek satırlık ayar tablosu — seed
INSERT INTO blok3_promo_section (step_label, button_text, button_url)
SELECT 'ÖZEL DUYURU', 'Keşfet', 'https://www.bubilet.com.tr/sanatci/blok3-'
WHERE NOT EXISTS (SELECT 1 FROM blok3_promo_section);

-- ============================================
-- STORAGE BUCKET: blok3-promo
-- Section'ın masaüstü + mobil görselleri.
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blok3-promo', 'blok3-promo', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read blok3-promo"
ON storage.objects FOR SELECT
USING (bucket_id = 'blok3-promo');

CREATE POLICY "Service insert blok3-promo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blok3-promo');

CREATE POLICY "Service update blok3-promo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blok3-promo');

CREATE POLICY "Service delete blok3-promo"
ON storage.objects FOR DELETE
USING (bucket_id = 'blok3-promo');
