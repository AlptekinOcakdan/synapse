# Proje Düzenleme ve Yeniden Yapılandırma Görevleri (tasks.md)

Bu dosya, projenin arayüz, stil ve kod kalitesini artırmak için izlenecek adımları tanımlar. Çalışmaya başlamadan önce aşağıdaki genel kurallar mutlaka dikkate alınmalıdır.

## 📌 Genel Kurallar ve Ön Koşullar

- **Mimari Bütünlük:** Projenin mevcut Next.js, Tailwind CSS v4, Radix UI ve Zustand/React Query mimarisi korunacaktır. `CLAUDE.md` dosyasında belirtilen `modules/` tabanlı özellik (feature) mimarisi bozulmadan geliştirme yapılacaktır.
- **Standart İsimlendirme:** Dosya, klasör ve route (yönlendirme) isimlendirmelerinde yerel dilde isimlendirmeler yerine standart İngilizce isimlendirme kuralları (örn. `/company`, `/student`) kullanılacaktır.
- **Shadcn UI ve Bileşenler:** Mümkün olan her senaryoda Shadcn UI bileşenleri kullanılacaktır. Arayüzde özel, manuel animasyonlar yazmak yerine UI kütüphanesinin (örneğin carousel yapıları için resmi Shadcn UI carousel bileşeni) standartlarına bağlı kalınacaktır.
- **Scroll-Area Davranışı:** Mevcut layout ve bileşenlerdeki `scroll-area` kullanımlarına devam edilecektir. Eğer `scroll-area` bileşeninden kaynaklı bir bug veya sorun tespit edilirse, doğrudan Radix UI kaynak kodlarının davranış biçimi incelenerek dosyada gerekli düzeltmeler yapılacaktır.
- **Dil ve Metinler:** Yazılan kodlar veya açıklamalar farklı dilde olsa dahi, arayüzde (UI) kullanıcıya gösterilecek bütün metinler kesinlikle **Türkçe** olmalıdır.
- **Genelleştirme (DRY - Don't Repeat Yourself):** Birden fazla yerde kullanılan arayüz elementleri, fonksiyonlar veya stiller genel bir bileşene/hook'a dönüştürülecektir. (Sadece tek bir yere özgü spesifik bir renk tanımı istisnadır, bunlar olduğu gibi bırakılabilir.)

---

## 🛠️ Phase 1: Stil ve Tema Düzenlemesi

**Hedef:** Proje genelindeki tüm arayüzlerin, ana sayfa (landing page) teması ve `globals.css` içerisindeki renk paletiyle kusursuz uyumunu sağlamak. `text-[#f3f3f3]` gibi hard-coded renkler kesinlikle kullanılmamalı, her zaman semantik Tailwind sınıfları (`text-primary`, `bg-background` vb.) tercih edilmelidir.

**İzlenecek Adımlar:**
1. **İnceleme:** Bütün sayfa ve bileşenlerin ana sayfadaki temayla görsel uyumu kontrol edilecek.
2. **Listeleme:** Tema uyumsuzluğu tespit edilen bileşen veya sayfalar, ana dizindeki `edit-list.md` dosyasına **"Phase 1: Stil Uyumsuzlukları"** başlığı altında eklenecek.
3. **Düzenleme:** `edit-list.md` listesindeki maddeler sırayla düzeltilecek ve işlem biten her madde dosyada "tamamlandı" olarak işaretlenecek.
4. **Test:** Bütün uyumsuzluklar giderildikten sonra arayüz testleri yapılacak.

---

## 📱 Phase 2: Duyarlı (Responsive) Tasarım Düzenlemesi

**Hedef:** Tüm arayüzlerin üç ana ekran tipinde (Masaüstü, Tablet, Telefon) dinamik olarak kusursuz çalışmasını sağlamak.

**İzlenecek Adımlar:**
1. **İnceleme:** Arayüzler ekran genişliklerine göre test edilecek. Özellikle sabit bir genişlik (fixed width) biçilmiş ve ekran küçüldüğünde dinamik olarak daralmayan/esnemeyen yapılar aranacak.
2. **Listeleme:** Responsive davranmayan, sabit kalmış arayüzler tespit edilip `edit-list.md` dosyasına **"Phase 2: Responsive Hataları"** başlığı altına eklenecek. Eklenirken hatanın nerede ve ne olduğuna dair açıklayıcı notlar düşülecek.
3. **Düzenleme:** `edit-list.md` içerisindeki responsive sorunları sırayla düzeltilecek ve bitenler işaretlenecek.
4. **Test:** Bütün cihaz tipleri için ekran küçültme/büyütme testleri yapılarak hataların giderildiğinden emin olunacak.

---

## 🏗️ Phase 3: Kod Mimarisi ve Clean Code Düzenlemesi

**Hedef:** Single Responsibility (Tek Sorumluluk) prensibine uyarak, okunabilir, modüler ve temiz bir kod tabanı elde etmek. *(Not: `node_modules`, `.next` ve `components/ui` klasörlerindeki kodlar bu aşamanın **kapsamı dışındadır.**)*

**İzlenecek Adımlar:**
1. **Fonksiyon ve Bileşen Ayrıştırması:** Geliştirici tarafından oluşturulan kodlarda; eğer bir dosya içerisinde birden fazla ana bileşen veya birden fazla bağımsız fonksiyon tanımlanmışsa, bunlar modüler kod mimarisine uygun olarak ayrı dosyalara taşınarak oradan çağrılacak.
2. **Utility (Yardımcı) Fonksiyonların Taşınması:** UI bileşenlerinin (component dosyalarının) içerisine yazılmış veri işleme veya mantık (utility) fonksiyonları tespit edilecek ve bunlar `lib/` klasörüne veya ilgili modül klasöründeki yardımcı dosyalara taşınacak.
3. **Tekrarların Yok Edilmesi:** Kendini tekrar eden UI parçaları veya kod blokları tespit edilecek. Bunlar bağımsız, tekrar kullanılabilir (reusable) bileşenler veya custom hook'lar haline getirilip projenin ilgili yerlerine entegre edilecek.
4. **Düzenleme ve Refactor:** Bu prensiplere aykırı tüm kod blokları, `CLAUDE.md` içindeki modül (`modules/feature/ui`) yapısına sadık kalınarak yeniden yapılandırılacak.

## 🛡️ Phase 4: Statik Analiz, Tip Güvenliği ve IDE Uyarıları

**Hedef:** Projedeki tüm statik analiz hatalarını, ESLint uyarılarını ve TypeScript tip eksikliklerini gidermek. WebStorm gibi gelişmiş IDE'lerin sunduğu kod kalitesi tavsiyelerini uygulayarak projeyi "sıfır hata/uyarı" (zero warnings/errors) noktasına getirmek.

**Önemli Kurallar:**
- **Kati Tip Güvenliği:** `any` veya `unknown` gibi kaçamak ve belirsiz tiplerin kullanımı kesinlikle yasaktır.
- Eğer bir verinin tipi yoksa, `types.ts` dosyalarında veya Convex şemasında (`convex/schema.ts`) var olan yapılara bakılarak doğru `interface` veya `type` tanımları eksiksiz bir şekilde yazılacaktır.
- Gerekiyorsa tip doğrulama (validation) işlemleri için Zod kullanılacaktır.
- Kullanılmayan importlar, ölü kodlar (dead code) ve gereksiz değişkenler temizlenecektir.

**İzlenecek Adımlar:**
1. **İnceleme:** Projede `bun run lint` komutunu çalıştırarak ve TypeScript derleme süreçlerini analiz ederek mevcut uyarı (warning) ve hataları (error) tespit et.
2. **Listeleme:** Tespit edilen tip eksikliklerini (`any` kullanımları dahil) ve ESLint/IDE uyarılarını `edit-list.md` dosyasına **"Phase 4: Statik Analiz ve Tip Hataları"** başlığı altında listele.
3. **Düzenleme:** `edit-list.md` listesindeki hataları sırayla çöz. Önceliği her zaman `any` tiplerini gerçek projelere uygun `interface/type` tanımlarına dönüştürmeye ver. Tamamlanan maddeleri işaretle.
4. **Test:** Bütün işlemler bittiğinde tekrar `bun run lint` ve TypeScript derleme kontrollerini çalıştırarak terminalin tamamen temiz (sıfır hata) olduğundan emin ol.

---

## 🧪 Phase 5: Playwright ile Uçtan Uca (E2E) Responsive ve Taşma (Overflow) Testleri

**Hedef:** Projedeki tüm sayfa, layout, modal, sheet ve dinamik bileşenlerin 3 ana ekran boyutunda (Masaüstü, Tablet, Mobil) kusursuz çalıştığını, hiçbir arayüzde istenmeyen taşma (overflow) olmadığını otomatize edilmiş E2E testleri ile kanıtlamak.

**Önemli Kurallar:**
- **Test Aracı:** Bu aşama için Playwright kullanılacaktır (Eğer projede kurulu değilse Claude tarafından kurulmalıdır).
- **Hedef Ekranlar:** Testler 3 farklı viewport (görünüm alanı) için çalıştırılacaktır: Masaüstü (örn. 1280x720), Tablet (örn. 768x1024) ve Mobil (örn. 375x667).
- **Sıfır Yatay Kaydırma (Zero Horizontal Scroll):** Sayfalarda ve **özellikle `scroll-area` kullanılan hiçbir bileşende yatay eksende taşma (`overflow-x`) kesinlikle olmamalıdır.** Testler bunu `scrollWidth === clientWidth` mantığıyla açıkça doğrulamalıdır. Claude hatalı bir taşma düzeltmesi yaparken *asla* `overflow-x-auto` sınıfını eklememeli, bunun yerine içeriği sınırlandırmalıdır.
- **Dinamik Bileşenler:** Sadece statik sayfalar değil; Modallar (Dialog), Drawer/Sheet'ler ve Dropdown'lar da açılarak içlerindeki içeriklerin mobil ve tablet görünümlerinde yatay taşma yapmadan ekrana sığıp sığmadığı test edilmelidir.

**İzlenecek Adımlar:**
1. **Kurulum ve İnceleme:** Projede Playwright kurulu değilse yapılandır. Tüm ana route'ları (yönlendirmeleri) ve kritik dinamik arayüzleri (modallar vb.) tespit et.
2. **Test Yazımı:** Her sayfa ve bileşen için yukarıdaki kurallara uygun, "yatay taşma yoktur" (no horizontal scroll) ve görünürlük (visibility) kontrolleri yapan Playwright test senaryoları (`.spec.ts`) yaz.
3. **Çalıştırma ve Listeleme:** Testleri terminalde çalıştır. Hata veren (yatay kaydırma yapan, ekrandan taşan) yerleri `edit-list.md` dosyasına **"Phase 5: Playwright Arayüz Hataları"** başlığı altında listele.
4. **Düzenleme:** `edit-list.md` listesindeki arayüz hatalarını kaynak kodlarda (UI bileşenlerinde veya layoutlarda) düzelt. Düzelttikçe listeden işaretle.
5. **Son Test:** Düzeltmelerden sonra test paketini tekrar çalıştır ve terminalde tüm Playwright testlerinin %100 "Passed" durumunda olduğunu onayla.