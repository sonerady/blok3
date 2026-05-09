-- ============================================
-- BLOK3 — Sahte (test) iletisim verilerini temizle
-- Supabase SQL Editor'da calistirin.
-- DIKKAT: Bu islemler GERI ALINAMAZ!
-- ============================================

-- ──────────────────────────────────────────────
-- 1) MESAJLAR (Bize Yazin formundan gelen mesajlar)
-- Tum kayitlari siler.
-- ──────────────────────────────────────────────
DELETE FROM blok3_contacts;

-- ──────────────────────────────────────────────
-- 2) ABONELER (Landing sayfasindan abone olanlar)
-- Tum kayitlari siler. Eger gercek aboneleri korumak
-- istiyorsaniz bu satiri YORUM SATIRI yapin (--).
-- ──────────────────────────────────────────────
DELETE FROM blok3_subscribers;

-- ──────────────────────────────────────────────
-- ALTERNATIF: Sadece belirli kriterdekileri silmek isterseniz
-- ──────────────────────────────────────────────
-- Ornek: 1 Ocak 2026'dan onceki test kayitlari
-- DELETE FROM blok3_contacts WHERE created_at < '2026-01-01';
-- DELETE FROM blok3_subscribers WHERE created_at < '2026-01-01';

-- Ornek: belirli e-posta domain'leri (test mailler)
-- DELETE FROM blok3_contacts WHERE email LIKE '%@test.com' OR email LIKE '%@example.com';
-- DELETE FROM blok3_subscribers WHERE email LIKE '%@test.com' OR email LIKE '%@example.com';

-- Ornek: ad/soyad bos olanlar
-- DELETE FROM blok3_subscribers WHERE first_name = '' OR last_name = '';
