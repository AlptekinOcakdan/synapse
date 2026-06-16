# Synapse

Akademik proje pazaryeri. Öğrencilerin proje oluşturduğu ve katıldığı, akademisyenlerin danışmanlık yaptığı bir platform.

## Özellikler

- **Proje Yönetimi** — Proje oluşturma, başvurma, kabul/red ve üye yönetimi
- **Gerçek Zamanlı Sohbet** — Kullanıcılar arası anlık mesajlaşma
- **Akademisyen Postası** — Öğrenci↔akademisyen arası kalıcı mail sistemi
- **Academy** — Etkinlik ve duyuru takibi
- **Rozet Sistemi** — Kullanıcı başarı ve tanınma kayıtları
- **Profil Sayfaları** — Deneyim, sertifika, yetenek ve proje geçmişi
- **OTP Kimlik Doğrulama** — E-posta tabanlı tek kullanımlık şifre ile giriş

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 15 (App Router) · React 19 · TypeScript |
| Backend | Convex (gerçek zamanlı veritabanı, sorgular, mutasyonlar) |
| Stil | Tailwind CSS v4 · Radix UI |
| Durum Yönetimi | Zustand · React Query |
| Dosya Depolama | AWS S3 (presigned URL) |
| E-posta | Resend / Nodemailer (SMTP) |
| Oturum | Jose (JWT HS256, 7 günlük) |

## Kurulum

**Gereksinimler:** [Bun](https://bun.sh), [Convex](https://convex.dev) hesabı, AWS S3 bucket

```bash
bun install
bunx convex dev
bun run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Ortam Değişkenleri

`.env.local` dosyasına aşağıdaki değişkenleri ekleyin:

```env
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
SESSION_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
RESEND_API_KEY=
```

## Komutlar

```bash
bun run dev          # Geliştirme sunucusu (localhost:3000)
bun run dev:all      # Next.js + ngrok webhook tüneli
bun run dev:webhook  # Yalnızca ngrok tüneli
bun run build        # Production build
bun run start        # Production sunucusu
bun run lint         # ESLint kontrolü
```

## Proje Yapısı

```
src/
  app/              # Next.js App Router sayfaları
    (auth)/         # Giriş / kayıt akışları
    (public)/       # Genel sayfalar (ana sayfa, hakkında)
    dashboard/      # Öğrenci paneli
    academician/    # Akademisyen paneli
    admin/          # Yönetici paneli
    profile/        # Kullanıcı profil sayfaları
  modules/          # Özellik modülleri (types + ui/ içerir)
  components/ui/    # Radix tabanlı paylaşımlı UI bileşenleri
  providers/        # ConvexClientProvider, SessionProvider
  lib/              # Yardımcı fonksiyonlar (session, aws, utils)
  actions/          # Server actions (createSession, deleteSession)

convex/             # Backend: şema, sorgular, mutasyonlar, webhook'lar
```

## Kimlik Doğrulama Akışı

1. Kullanıcı e-posta gönderir — Convex 6 haneli OTP üretir ve iletir
2. OTP doğrulanır — Profil tamamlama adımı
3. Profil fotoğrafı S3'e presigned URL ile doğrudan yüklenir
4. Kullanıcı Convex'te oluşturulur; JWT httpOnly cookie olarak saklanır (7 gün)
5. `useSession()` hook'u ile `userId` / `isAuthenticated` erişimi sağlanır
6. Giriş sonrası: öğrenciler `/dashboard`, akademisyenler `/academician` yönlendirilir

## Paket Yöneticisi

Bu proje **Bun** kullanır. `npm` veya `yarn` kullanmayın.
