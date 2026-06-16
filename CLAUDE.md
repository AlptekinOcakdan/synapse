# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev          # Next.js dev server on localhost:3000
bun run dev:all      # Next.js + ngrok webhook tunnel concurrently
bun run dev:webhook  # ngrok tunnel only

# Production
bun run build
bun run start

# Code quality
bun run lint
```

Use **Bun** (not npm/yarn) as the package manager. There are no test files in this project.

## Architecture Overview

**Synapse** is an academic project marketplace that connects students and academicians. Students post/join projects; academicians can advise. There is also a real-time chat system, a persistent mail system for student↔academician communication, an events/academy section, and a badge/recognition system.

### Stack

- **Next.js** (App Router) + React 19 + TypeScript (strict)
- **Convex** — backend-as-a-service: real-time database, queries, mutations, and HTTP webhooks (Svix for webhook verification)
- **Tailwind CSS v4** + Radix UI primitives
- **Zustand** for local state; **React Query** for pagination/caching
- **AWS S3** for file uploads (presigned URLs)
- **Resend / Nodemailer (SMTP)** for email delivery
- **Jose / jsonwebtoken** for JWT session management
- Custom OTP-based email authentication (no OAuth)

### Frontend layout (`src/`)

- `app/` — Next.js App Router pages
  - `(auth)/` — sign-in and sign-up flows
  - `(public)/` — public pages (landing, about)
  - `dashboard/` — student dashboard (projects, profiles, chats, academy)
  - `academician/` — academician dashboard (projects, mail)
  - `admin/` — admin dashboard
  - `profile/` — user profile pages
  - `api/upload/` — server route for S3 presigned URL generation
- `modules/` — feature modules, each containing `types.ts` and `ui/` (components, views, layouts, sections)
  - `academician/`, `admin/`, `auth/`, `dashboard/`, `home/`, `profile/`, `users/`
- `components/ui/` — shared Radix-based UI primitives
- `providers/` — `ConvexClientProvider` and `SessionProvider` (exposes `useSession()`)
- `actions/auth.ts` — server actions for `createSession` / `deleteSession`
- `lib/` — `session.ts` (JWT), `aws.ts` (S3 client), `constants.ts`, `utils.ts`, `cropImage.ts`

### Backend (`convex/`)

Every file exports Convex queries/mutations/actions. Key files:

| File | Responsibility |
|---|---|
| `schema.ts` | Full data model |
| `auth.ts` | OTP generation, sign-in, sign-up |
| `users.ts` | User CRUD and search |
| `academics.ts` | Academic profile fields (publications, research interests) |
| `academician.ts` | Academician-specific queries |
| `academy.ts` | Academy/platform-level functions |
| `projects.ts` | Project CRUD, listing, filtering |
| `projectMembers.ts` | Project membership |
| `applications.ts` | Apply to projects, accept/reject |
| `chats.ts` / `messages.ts` | Real-time messaging |
| `emails.ts` | Email delivery logic |
| `departments.ts` | Department label queries |
| `badges.ts` | Badge issuance and retrieval |
| `notifications.ts` (via schema) | User notification records |
| `reports.ts` | Reporting/analytics |
| `http.ts` | HTTP webhook handlers (Svix-verified) |
| `seed.ts` | Database seeding |

### Data model highlights

- **users**: role = `student` | `academician` | `admin`. Rich profile (bio, skills, experiences, competitions, certificates). Academicians have additional fields (office, research interests, publications). Indexed by email and role; full-text search on firstName.
- **projects**: owner + optional advisor. Status = `recruiting` | `ongoing` | `completed` | `cancelled`. Has `positions[]` (department, count, required skills).
- **applications**: `pending` | `accepted` | `rejected`. Linked to a project position.
- **conversations / messages**: real-time chat.
- **mailThreads / mailMessages**: persistent mail separate from real-time chat, for student↔academician communication.
- **events / eventSubscriptions**: scheduled events with participant tracking.
- **notifications**: types = `application_received` | `mentorship_offer` | `badge_awarded` | `application_approved`.
- **badges**: user recognition/achievement records.
- **departments**: department label reference table.
- **authCodes**: OTP tokens with 15-minute TTL.

### Authentication flow

1. User submits email → Convex generates 6-digit OTP and emails it.
2. User verifies OTP → profile completion step.
3. Profile image uploaded directly to S3 via presigned URL (generated at `api/upload`).
4. User record created in Convex. Server action creates a JWT (HS256, 7-day expiry) stored in an httpOnly cookie.
5. `SessionProvider` decrypts the cookie server-side and exposes `userId` / `isAuthenticated` via `useSession()`.
6. On sign-in success, students → `/dashboard`, academicians → `/academician`.

### Convex data access pattern

Components call Convex hooks directly:

```ts
const projects = useQuery(api.projects.getProjects, { userId, paginationOpts });
const apply    = useMutation(api.applications.apply);
```

Convex provides reactivity — no manual cache invalidation needed for real-time data (chats, events).

### File upload pattern

Client requests a presigned URL from `POST /api/upload`, then uploads directly to S3. The resulting S3 URL is saved to the Convex DB field (e.g., `user.avatar`). Image cropping is handled client-side via `lib/cropImage.ts` before upload.

### Environment variables required

```
CONVEX_DEPLOYMENT
NEXT_PUBLIC_CONVEX_URL
SESSION_SECRET            # base64-encoded 32-byte key
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_BUCKET_NAME
RESEND_API_KEY
```

### Path aliases

`@/*` → `src/*`

# Claude Proje Kuralları

## Stil ve UI Kuralları
- **Renk Teması:** UI bileşenleri geliştirirken asla `src/app/globals.css` dosyasında tanımlanan CSS değişkenlerinin veya Tailwind tema renklerinin dışına çıkma. Tema violet-600 tabanlı oklch renk uzayı kullanır.
- **Hard-coded Renk Yasaktır:** Inline styles veya Tailwind içerisinde `text-[#f3f3f3]` gibi özel hex kodları kullanma. Her zaman `text-primary`, `bg-background` gibi semantik sınıfları kullan.
- **Bileşen Yapısı:** Yeni UI bileşenlerini `components/ui/` (primitives) veya ilgili modülün `ui/` klasörüne ekle. Mevcut Radix UI yapılarını bozma.

## Kod Kalitesi ve Temiz Kod (Clean Code)
- **Optimum Temizlik:** Fonksiyonlar tek bir iş yapmalı (Single Responsibility). Karmaşık mantıkları `lib/` altındaki yardımcı fonksiyonlara veya özel hook'lara ayır.
- **Tip Güvenliği:** `any` kullanma. Tüm veriler için `types.ts` dosyalarındaki arayüzleri (interface/type) kullan veya Convex şemasına sadık kal. Validasyon için Zod kullan.
- **Performans:** Gereksiz "use client" direktifinden kaçın. Veri çekme işlemlerini mümkünse Convex hooks (`useQuery`) ile bileşen seviyesinde yap.
- **Dosya Organizasyonu:** Mevcut modüler yapıya (`modules/feature/`) sadık kal. Bir özelliği eklerken o özelliğe ait tipleri, UI bileşenlerini ve mantığı ilgili modül klasöründe grupla.

## İş Akışı ve Mimari Koruma
- **Paket Yönetimi:** Sadece **Bun** kullan. Asla `npm` veya `yarn` komutu önerme.
- **Veri Erişimi:** Backend işlemleri için sadece Convex mutasyonlarını ve sorgularını kullan. Doğrudan dış API çağrılarını (S3 hariç) `convex/` içindeki action'larda yönet.
- **Kimlik Doğrulama:** Mevcut OTP tabanlı sistemi ve `useSession()` hook'unu koru. OAuth ekleme veya sistemi değiştirme.
- **Webhook'lar:** HTTP webhook'ları `convex/http.ts` içinde Svix ile doğrulanır. Yeni webhook endpoint'leri buraya eklenmeli.

## Dil tercihi
- Bütün kullanıcı arayüzündeki kullanılacak yazılar Türkçe dilinde olmalıdır.
- Verilen komut farklı dilde olsa da adlar Türkçe yazılmalıdır.