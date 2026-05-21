-- ============================================
-- BLOK3 Events — Manuel siralama (oncelik) destegi
-- Supabase SQL Editor'da calistirin.
-- ============================================

-- 1) sort_order sutunu ekle
ALTER TABLE blok3_events
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2) Mevcut kayitlara default sort_order ata
--    En yeni tarih en ust (sort_order = 1)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY date DESC) AS rn
  FROM blok3_events
)
UPDATE blok3_events
SET sort_order = ranked.rn
FROM ranked
WHERE blok3_events.id = ranked.id;
