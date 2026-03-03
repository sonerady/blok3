-- ============================================
-- BLOK3 Supabase Setup
-- Supabase SQL Editor'da çalıştırın
-- ============================================

-- ============================================
-- TABLE: blok3_events
-- ============================================
CREATE TABLE IF NOT EXISTS blok3_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  venue TEXT NOT NULL,
  ticket_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blok3_events DISABLE ROW LEVEL SECURITY;

INSERT INTO blok3_events (date, city, country, venue, ticket_url) VALUES
  ('2026-01-09', 'Berlin', 'Almanya', 'Columbiahalle', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-10', 'Ludwigsburg', 'Almanya', 'MHP Arena', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-11', 'Münih', 'Almanya', 'TonHalle', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-17', 'Düsseldorf', 'Almanya', 'Mitsubishi Electric HALLE', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-18', 'Hamburg', 'Almanya', 'Grosse Freiheit 36', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-24', 'Hohenems', 'Avusturya', 'Tennis.Event.Center', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-30', 'Mannheim', 'Almanya', 'Maimarkthalle', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-01-31', 'Utrecht', 'Hollanda', 'Gietijzer', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-02-01', 'Frankfurt', 'Almanya', 'Zoom', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-02-07', 'Londra', 'İngiltere', 'indigo at The O2', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-02-14', 'Bakü', 'Azerbaycan', 'Jolly Joker Baku', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-02-15', 'Bursa', 'Türkiye', 'Club Inferno', 'https://www.bubilet.com.tr/sanatci/blok3-'),
  ('2026-03-27', 'Hannover', 'Almanya', 'Swiss Life Hall', 'https://www.bubilet.com.tr/sanatci/blok3-');

-- ============================================
-- TABLE: blok3_contacts
-- ============================================
CREATE TABLE IF NOT EXISTS blok3_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blok3_contacts DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: blok3_gallery
-- ============================================
CREATE TABLE IF NOT EXISTS blok3_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  caption TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blok3_gallery DISABLE ROW LEVEL SECURITY;

INSERT INTO blok3_gallery (src, caption, sort_order) VALUES
  ('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80', 'İstanbul — Volkswagen Arena', 1),
  ('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'Ankara — Congresium', 2),
  ('https://images.unsplash.com/photo-1501386761578-eac5c94b0e6b?w=800&q=80', 'İzmir — Arena', 3),
  ('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', 'Antalya — Expo Center', 4),
  ('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', 'Bursa — Merinos Atatürk Kongre', 5),
  ('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 'Berlin — Columbiahalle', 6),
  ('https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80', 'Münih — TonHalle', 7),
  ('https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80', 'Hamburg — Grosse Freiheit', 8),
  ('https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80', 'Londra — O2 Arena', 9),
  ('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', 'Amsterdam — Ziggo Dome', 10),
  ('https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&q=80', 'Frankfurt — Zoom', 11),
  ('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', 'Düsseldorf — Mitsubishi HALLE', 12),
  ('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', 'Bakü — Jolly Joker', 13),
  ('https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&q=80', 'Adana — Açıkhava', 14),
  ('https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=800&q=80', 'Trabzon — Forum Sahne', 15),
  ('https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80', 'Konya — Selçuklu Kongre', 16),
  ('https://images.unsplash.com/photo-1564585222527-c2777e5bc6cb?w=800&q=80', 'Eskişehir — Açıkhava', 17),
  ('https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80', 'Samsun — Sahne', 18),
  ('https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80', 'Gaziantep — Arena', 19),
  ('https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=800&q=80', 'Diyarbakır — Kültür Merkezi', 20);

-- ============================================
-- STORAGE BUCKET: blok3-gallery
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blok3-gallery', 'blok3-gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read blok3-gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'blok3-gallery');

CREATE POLICY "Service insert blok3-gallery"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blok3-gallery');

CREATE POLICY "Service update blok3-gallery"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blok3-gallery');

CREATE POLICY "Service delete blok3-gallery"
ON storage.objects FOR DELETE
USING (bucket_id = 'blok3-gallery');

-- ============================================
-- TABLE: blok3_press
-- ============================================
CREATE TABLE IF NOT EXISTS blok3_press (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blok3_press DISABLE ROW LEVEL SECURITY;

INSERT INTO blok3_press (title, image_url, link) VALUES
  ('BLOK3 Avrupa Turnesinde Rekor Kırıyor', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80', 'https://www.hurriyet.com.tr/'),
  ('BLOK3 ile Ozel Roportaj: Yeni Albumun Hikayesi', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', 'https://www.ntv.com.tr/'),
  ('Almanya Turnesi Tum Biletler Tukendi', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', 'https://www.milliyet.com.tr/'),
  ('BLOK3 O2 Arena Londra Konserinden Kareler', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', 'https://www.sozcu.com.tr/'),
  ('2026 Yilinin En Cok Dinlenen Rap Grubu: BLOK3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'https://www.rollingstone.com.tr/');
