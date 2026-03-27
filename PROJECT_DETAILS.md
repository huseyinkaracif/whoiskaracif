# Proje Detayları: Hüseyin Karacif Kişisel Web Sitesi

Bu proje, bir "Kıdemli Yazılım Geliştirici" portfolyosunu modern bir tasarımla sunmak ve ziyaretçilere eğlenceli mini oyunlar sunmak amacıyla oluşturulmuş bir statik web sitesidir.

## 🚀 Proje Özeti
*   **İsim:** Hüseyin Karacif - Kişisel Portfolyo
*   **Tür:** Statik Web Sitesi
*   **Tasarım:** Modern, Karanlık Tema (Dark Mode), Glassmorphism, Responsive (Mobil Uyumlu)

## 🛠 Kullanılan Teknolojiler
*   **HTML5:** Semantik yapı ve temel sayfa düzeni.
*   **Tailwind CSS (CDN):** Hızlı ve esnek UI geliştirme için modern CSS kütüphanesi.
*   **JavaScript (Vanilla):** UI etkileşimleri, animasyonlar ve oyun mantığı için.
*   **Font Awesome:** Proje içi ikon setleri.
*   **Google Fonts:** Plus Jakarta Sans & JetBrains Mono tipografi.

## 🤖 Ajanların Yaptığı İşlemler (Özet)

### 🏗 Temel Site Yapımı (Site Maker Agent)
*   Sitenin temel HTML yapısı ve iskeleti oluşturuldu.
*   Semantik HTML etiketleri kullanılarak SEO dostu bir yapı sağlandı.
*   Ana Sayfa, Hakkımda, Yetenekler, Projeler, Oyunlar ve İletişim bölümleri kurgulandı.

### 📊 Veri Toplama (Data Collection Agent)
*   Hüseyin Karacif'in profesyonel özgeçmişi ve kariyer bilgileri (obilet, .NET, React uzmanlığı vb.) derlendi.
*   Gerçek projelerden (DYS, ai-blog-team, KanbanBoard) bilgiler toplandı.
*   Yetenek seti (.NET Core, React, Flutter, SQL, Tailwind vb.) sınıflandırıldı.

### 🎨 UI/UX Tasarımı (UI/UX Design Agent)
*   Tailwind CSS yapılandırması ile özel renk paleti (Indigo, Purple, Pink aksanları) oluşturuldu.
*   **Karanlık Tema:** Göz yormayan, modern ve şık bir görünüm sağlandı.
*   **Özel Animasyonlar:** Blob (kabarcık) arka planlar, yüzen elemanlar (float), ve geçiş efektleri (scroll reveal).
*   **Etkileşimler:** Özel imleç (custom cursor), glassmorphism (buzlu cam) efektli navbar ve kartlar.
*   **Gürültü Katmanı (Noise Overlay):** Tasarıma derinlik ve doku katan ince bir gürültü filtresi eklendi.

### 🎮 5 Mini Oyun Geliştirme (Game Developer Agent)
Sitenin "Oyunlar" bölümüne ziyaretçilerin keyifli vakit geçirebileceği 5 farklı oyun eklendi:
1.  **Snake (Yılan):** Canvas API ile geliştirilmiş klasik yılan oyunu.
2.  **Tic-Tac-Toe (X-O-X):** İki kişilik klasik mantık oyunu.
3.  **Memory (Hafıza):** Font Awesome ikonları ile eşleştirme oyunu.
4.  **Pong:** Canvas API ile hazırlanan klasik raket-top oyunu.
5.  **Minesweeper (Mayın Tarlası):** Dinamik tablo yapısıyla oluşturulan mayın bulma oyunu.

## 🔗 Deploy (Canlıya Alma) Bilgileri
Proje statik yapıda olduğu için herhangi bir ücretsiz platformda kolayca yayınlanabilir.

### GitHub Pages'e Deploy Adımları:
1.  GitHub üzerinde yeni bir depo (repository) oluşturun (örneğin: `portfolio`).
2.  Aşağıdaki komutları kullanarak projeyi GitHub'a gönderin:
    ```bash
    git init
    git add .
    git commit -m "Deploy: İlk sürüm"
    git branch -M main
    git remote add origin https://github.com/KULLANICI_ADINIZ/portfolio.git
    git push -u origin main
    ```
3.  GitHub ayarlarından (Settings > Pages) `main` branch'ini seçerek yayına alın.
4.  Yayına alındığında siteniz şu adreste olacaktır: `https://KULLANICI_ADINIZ.github.io/portfolio/`

## 💻 Yerelde Çalıştırma Talimatları
Projeyi kendi bilgisayarınızda çalıştırmak oldukça basittir, çünkü herhangi bir derleme (build) işlemi gerektirmez:

1.  Proje dosyalarını indirin veya klonlayın.
2.  Proje ana dizinindeki `index.html` dosyasını herhangi bir modern tarayıcıda (Chrome, Edge, Firefox, Brave vb.) açın.
3.  Veya bir geliştirme sunucusu (Live Server vb.) kullanarak çalıştırın:
    ```bash
    # npm ile (varsa)
    npx serve .
    
    # Python ile
    python -m http.server 8000
    ```

---
*Bu web sitesi, modern AI ajanları tarafından Hüseyin Karacif için özel olarak tasarlanıp geliştirilmiştir.*
