# BLOK3 Subscriber Backend Entegrasyonu

## Ne Yapıldı (Frontend)

BLOK3 rap sanatcisi web sitesinin giris ekraninda bir **abone olma formu** var. Kullanicilar konser, bilet erken erisim ve ozel icerikler icin abone olabiliyor. Form submit edildiginde backend'e POST istegi atilacak ve veri Supabase'deki `blok3_subscribers` tablosuna yazilacak.

---

## Supabase Tablo Yapisi

Tablo adi: `blok3_subscribers`

| Kolon       | Tip           | Zorunlu | Aciklama                  |
|-------------|---------------|---------|---------------------------|
| id          | UUID (PK)     | auto    | gen_random_uuid()         |
| first_name  | TEXT          | evet    | Kullanicinin adi          |
| last_name   | TEXT          | evet    | Kullanicinin soyadi       |
| email       | TEXT (UNIQUE) | evet    | E-posta adresi            |
| phone       | TEXT          | hayir   | Telefon (opsiyonel)       |
| city        | TEXT          | evet    | Turkiye'nin 81 ilinden biri |
| created_at  | TIMESTAMPTZ   | auto    | Kayit tarihi (now())      |

RLS **kapali**. Tablo zaten olusturuldu.

---

## Yapilmasi Gereken: Backend Route

Asagidaki POST endpoint'ini olustur:

### `POST /api/blok3/subscribe`

**Request body (JSON):**

```json
{
  "firstName": "Ahmet",
  "lastName": "Yilmaz",
  "email": "ahmet@gmail.com",
  "phone": "5321234567",
  "city": "Istanbul"
}
```

**Kurallar:**
- `firstName`, `lastName`, `email`, `city` zorunlu — yoksa 400 dondur
- `phone` opsiyonel — bos olabilir veya gelmeyebilir
- `email` unique — ayni email varsa 409 Conflict dondur, kullanici dostu mesajla
- `phone` varsa basa `+90` EKLEMEyeceksin, frontend sadece numarayi gonderiyor (orn: "5321234567")
- Supabase client ile `blok3_subscribers` tablosuna insert yap

**Supabase insert mapping:**

```
firstName  → first_name
lastName   → last_name
email      → email
phone      → phone (null olabilir)
city       → city
```

**Basarili response (201):**

```json
{
  "success": true,
  "message": "Abonelik basariyla olusturuldu"
}
```

**Email zaten kayitli (409):**

```json
{
  "success": false,
  "message": "Bu e-posta adresi zaten kayitli"
}
```

**Eksik alan (400):**

```json
{
  "success": false,
  "message": "Ad, soyad, e-posta ve sehir zorunludur"
}
```

---

## Frontend Entegrasyonu

Route hazir oldugunda frontend'de `handleSubscribe` fonksiyonu guncellenerek bu endpoint'e fetch atilacak. Simdilik sadece `console.log` ile calisiyor.

Frontend kodu: `src/components/LandingSection.jsx` satir 190-194

```javascript
const handleSubscribe = (e) => {
  e.preventDefault()
  console.log('Subscriber:', formData)
  handleEnter()
}
```

Bu fonksiyon backend route hazir oldugunda su sekilde guncellenecek:

```javascript
const handleSubscribe = async (e) => {
  e.preventDefault()
  try {
    await fetch('BACKEND_URL/api/blok3/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
  } catch (err) {
    // sessizce devam et
  }
  handleEnter()
}
```

**Not:** Form submit basarisiz olsa bile kullanici siteye girebilmeli. Hata durumunda kullaniciyi bloklama.

---

## Yapilmasi Gereken: Pagination (GET endpoint guncelleme)

Mevcut `GET /api/blok3/subscribers` endpoint'ine pagination destegi ekle.

### `GET /api/blok3/subscribers?page=1&limit=50`

**Query parametreleri:**
- `page` — Sayfa numarasi (varsayilan: 1)
- `limit` — Sayfa basina kayit sayisi (varsayilan: 50)

**Supabase sorgusu:**

```javascript
const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 50
const offset = (page - 1) * limit

// Toplam kayit sayisi
const { count } = await supabase
  .from('blok3_subscribers')
  .select('*', { count: 'exact', head: true })

// Sayfalanmis veri
const { data, error } = await supabase
  .from('blok3_subscribers')
  .select('*')
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1)
```

**Basarili response (200):**

```json
{
  "data": [ ... ],
  "total": 127,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

**Hesaplama:**
- `totalPages = Math.ceil(total / limit)`
- `data` icinde sadece o sayfanin kayitlari olacak (max 50)
- Siralama: `created_at` DESC (en yeni en ustte)

**Not:** Eger `page` ve `limit` query'de yoksa varsayilan degerler kullanilsin. Mevcut davranis bozulmasin.

---

## Ozet

1. `POST /api/blok3/subscribe` route'u olustur
2. Supabase `blok3_subscribers` tablosuna insert yap
3. Email unique kontrolu yap (409)
4. Zorunlu alan kontrolu yap (400)
5. Basarili kayit icin 201 dondur
6. `GET /api/blok3/subscribers` endpoint'ine pagination ekle (`?page=1&limit=50`)
7. Response'ta `data`, `total`, `page`, `limit`, `totalPages` dondur
