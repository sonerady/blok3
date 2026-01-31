import '../App.css'

export default function ClientDocument() {
  const today = new Date()
  const formatted = today.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="doc-page">
      <div className="doc-a4">
        {/* Header */}
        <div className="doc-header">
          <div className="doc-logo">
            <span>3</span>
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)', marginLeft: '0.05em' }}>3</span>
          </div>
          <div className="doc-header-right">
            <span className="doc-date">{formatted}</span>
            <span className="doc-ref">Ref: BLOK3-WEB-2025</span>
          </div>
        </div>

        <div className="doc-divider" />

        {/* Title */}
        <h1 className="doc-title">BLOK3 Resmi Web Sitesi — Proje Durum Raporu</h1>

        {/* Intro */}
        <p className="doc-text">
          BLOK3 resmi web sitesi projesinin mevcut durumu, tamamlanan çalışmalar, devam eden süreçler ve ihtiyaç duyulan materyaller aşağıda özetlenmiştir.
        </p>

        {/* Current Status */}
        <h2 className="doc-subtitle">1. Mevcut Durum</h2>
        <p className="doc-text">
          Proje şu an itibariyle <strong>yaklaşık %25 oranında tamamlanmıştır</strong>. Genel site yapısı, tema ve layout tasarımı belirlenmiş olup aşağıdaki dört ana ekran geliştirilmiştir:
        </p>
        <ul className="doc-list">
          <li><strong>Biyografi Ekranı</strong> — Giriş videosu, spotlight efekti, biyografi metni ve paralaks animasyonları</li>
          <li><strong>Trend Ekranı</strong> — YouTube verileri, dönen başlık animasyonları ve video arka planı</li>
          <li><strong>İstatistikler Ekranı</strong> — Spotify, YouTube, TikTok ve Instagram platform verileri, animasyonlu sayaçlar ve telefon mockup'ları</li>
          <li><strong>Öne Çıkan Parçalar (Galeri) Ekranı</strong> — Tam ekran albüm kapakları, scroll-driven geçişler ve mini müzik oynatıcı</li>
        </ul>
        <p className="doc-text">
          Bu dört ekrana ek olarak <strong>yaklaşık 6–7 ekran daha</strong> eklenecektir. Konser sayfaları, marka işbirlikleri, turne bilgileri ve diğer içerik bölümleri bu kapsamdadır.
        </p>

        {/* Important Notes */}
        <h2 className="doc-subtitle">2. Önemli Notlar</h2>
        <ul className="doc-list">
          <li>Site içerisindeki <strong>linkler henüz fonksiyonel değildir</strong>. Mevcut linkler yer tutucu olarak eklenmiş olup doğru adreslere yönlendirmeyebilir.</li>
          <li>Öne Çıkan Parçalar bölümünde ve müzik içeriği gereken diğer sayfalarda <strong>müzikler henüz eklenmemiştir</strong>.</li>
          <li>Site şu an <strong>mobil uyumlu değildir</strong>. Mobil taraf için ayrı ve kapsamlı bir responsive tasarım çalışması yapılacaktır.</li>
          <li className="doc-perf-note">Sitedeki <strong>yavaş yüklenme veya performans sorunları göz ardı edilmelidir</strong>; henüz herhangi bir optimizasyon çalışması yapılmamıştır. Proje tamamlandığında performans iyileştirmeleri ayrıca gerçekleştirilecektir.</li>
          <li>Trend ekranında 3–4 mevsim geçişi gibi ek görsel efektler eklenecektir.</li>
          <li>Öne Çıkan Parçalar bölümündeki statik albüm görselleri, ilerleyen aşamalarda <strong>daha efektif video içeriklerine</strong> dönüştürülecektir.</li>
          <li>Konser sayfalarında çok daha <strong>dinamik ve enerjik görsel, metin ve video</strong> içerikleri kullanılacaktır.</li>
          <li>Genel hatlarıyla layout ve tema bu şekilde devam edecek olup detaylar üzerinde iyileştirmeler yapılacaktır.</li>
        </ul>

        {/* Required Materials */}
        <h2 className="doc-subtitle">3. İhtiyaç Duyulan Materyaller</h2>
        <p className="doc-text">
          Projenin tamamlanabilmesi için BLOK3'e ait <strong>tüm görsel ve video materyallerin</strong> iletilmesi gerekmektedir:
        </p>
        <ul className="doc-list">
          <li>Yüksek çözünürlüklü fotoğraflar (konser, stüdyo, tanıtım vb.)</li>
          <li>Müzik klipleri ve tanıtım videoları</li>
          <li>Albüm kapak görselleri (orijinal, yüksek çözünürlük)</li>
          <li>Logo ve marka kimliği dosyaları</li>
          <li>Konser ve turne bilgileri (tarih, mekan, şehir)</li>
          <li>Sosyal medya hesap linkleri ve doğru yönlendirme adresleri</li>
          <li>Müzik platformlarına ait doğru sanatçı profil linkleri (Spotify, Apple Music, Deezer vb.)</li>
          <li>Marka işbirliği görselleri ve içerikleri (varsa)</li>
          <li>Site içerisinde kullanılması istenen özel metin ve açıklamalar</li>
        </ul>

        {/* Project Scope */}
        <h2 className="doc-subtitle">4. Proje Kapsamı ve Teknik Detaylar</h2>
        <p className="doc-text">
          Bu proje, klasik bir kurumsal web sitesi ya da hazır şablon (template) üzerinden yapılan standart bir çalışma <strong>değildir</strong>. Sıfırdan, tamamen özel olarak tasarlanıp geliştirilmekte olan interaktif ve animasyon odaklı bir web deneyimidir.
        </p>
        <p className="doc-text">
          Site genelinde kullanılan başlıca teknik ve görsel öğeler:
        </p>
        <ul className="doc-list">
          <li><strong>Scroll-driven animasyonlar</strong> — Kullanıcının scroll hareketine bağlı olarak tetiklenen, sahne sahne ilerleyen sinematik geçişler</li>
          <li><strong>Paralaks efektleri</strong> — Fare hareketine duyarlı çok katmanlı derinlik efektleri</li>
          <li><strong>Video entegrasyonları</strong> — Arka plan videoları, giriş videosu ve scroll'a bağlı video geçişleri</li>
          <li><strong>Spotlight ve maskeleme</strong> — Fare imlecini takip eden dinamik ışık/spotlight efektleri</li>
          <li><strong>Harf harf animasyonlar</strong> — Başlık ve metin öğelerinin tek tek harf bazında animasyonlu görünüm kazanması</li>
          <li><strong>Animasyonlu sayaçlar</strong> — Platforma özel istatistiklerin gerçek zamanlı olarak sayılarak gösterilmesi</li>
          <li><strong>Tam ekran galeri sistemi</strong> — Scroll ile kontrol edilen, albüm kapakları arasında sinematik geçişler ve mini müzik oynatıcı</li>
          <li><strong>Çok katmanlı UI tasarımı</strong> — Her ekran için ayrı ayrı düşünülmüş, birbirinden bağımsız layout ve animasyon mimarisi</li>
          <li><strong>10+ ayrı ekran</strong> — Her biri kendine özgü tasarım, animasyon ve etkileşim mantığına sahip bölümler</li>
        </ul>
        <p className="doc-text">
          Bu tür bir proje, standart bir web sitesine kıyasla çok daha fazla tasarım, geliştirme süresi ve teknik uzmanlık gerektirmektedir. Her ekran, bağımsız bir mini proje gibi ele alınarak özenle geliştirilmektedir.
        </p>

        {/* Pricing */}
        <h2 className="doc-subtitle">5. Hizmet Bedeli</h2>
        <p className="doc-text">
          Projenin tamamı için hizmet bedeli <strong>2.250 USD</strong>'dir. Bu bedel; sıfırdan özel tasarım, tüm animasyon ve etkileşim geliştirmeleri, video entegrasyonları, kapsamlı mobil uyumluluk çalışması ve toplam 10+ ekranın eksiksiz tamamlanmasını kapsamaktadır.
        </p>

        <div className="doc-divider" />

        {/* Closing */}
        <p className="doc-text">
          İhtiyaç duyulan materyallerin iletilmesi, projenin eksiksiz tamamlanması açısından önemlidir.
        </p>

        <div className="doc-signature">
          <span className="doc-signature-name">Geliştirici</span>
          <span className="doc-signature-project">BLOK3 Web Projesi</span>
        </div>
      </div>
    </div>
  )
}
