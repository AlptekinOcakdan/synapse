# Synapse - Sistem Denetim Raporu

**Tarih:** 2026-04-15
**Kapsam:** Mimari tutarlılık, kod kalitesi, performans, CLAUDE.md kural uyumu
**Durum:** Sadece rapor - onay bekliyor, dosya degisikligi yapilmadi

---

## Ozet Tablo

| Kategori | Kritik | Yuksek | Orta | Dusuk | Toplam |
|---|---|---|---|---|---|
| Mimari Tutarlilik | 1 | 2 | 2 | 3 | 8 |
| Kod Kalitesi (DRY / Dead Code) | 0 | 4 | 3 | 2 | 9 |
| Performans | 0 | 3 | 4 | 2 | 9 |
| CLAUDE.md Kural Ihlalleri | 0 | 1 | 2 | 1 | 4 |
| **Toplam** | **1** | **10** | **11** | **8** | **30** |

---

## 1. Mimari Tutarlilik

### 1.1 [KRITIK] `rejectApplication` Yetkilendirme Eksikligi

**Dosya:** `convex/applications.ts:84-92`

Basvuru reddetme mutation'inda herhangi bir yetkilendirme kontrolu yok. Application ID'sine sahip herkes basvuruyu reddedebilir.

```ts
export const rejectApplication = mutation({
    args: { applicationId: v.id("applications") },
    handler: async (ctx, args) => {
        // TODO: Add auth check to ensure only project owner can reject
        await ctx.db.patch(args.applicationId, { status: "rejected" });
    },
});
```

**Cozum Plani:**
1. Mutation args'a `userId: v.id("users")` ekle
2. Application'dan project'e, project'ten owner'a erisip `userId === project.ownerId` kontrolu yap
3. Eslesmezse `throw new Error("Yetkilendirme hatasi")` firlat

---

### 1.2 [YUKSEK] Tip Uyumsuzlugu: `AcademyEvent.date`

**Schema:** `convex/schema.ts` -> `date: v.number()` (timestamp)
**Frontend Tipi:** `src/modules/dashboard/types.ts` -> `date: string`

Backend number dondururken frontend tipi string olarak tanimlanmis. Calisma aninda `new Date(event.date)` ile dogru parse ediliyor ancak tip guvenligi bozuk.

**Cozum Plani:**
- Frontend tip taniminda `date: number` olarak guncelle
- Veya backend query'de string'e donusturup tutarlilik sagla

---

### 1.3 [YUKSEK] Tip Uyumsuzlugu: `ChatSession.lastMessageTime`

**Schema:** `lastMessageTime: v.number()`
**Frontend Tipi:** `src/modules/dashboard/types.ts` -> `lastMessageTime: string`

Backend number dondururken frontend string bekliyor.

**Cozum Plani:**
- Frontend tipini `number` olarak guncelle

---

### 1.4 [ORTA] Kullanilmayan Schema Alanlari

| Alan | Tablo | Durum |
|---|---|---|
| `relatedPositionId` | applications | Tanimli ama hicbir yerde set edilmiyor |
| `format` | messages | Sadece `"text"` olarak set ediliyor, hicbir yerde okunmuyor |
| `source` | mailMessages | Optional, hicbir yerde kullanilmiyor |
| `messageId` | mailMessages | Optional, hicbir yerde kullanilmiyor |

**Cozum Plani:**
- Bu alanlarin gelecekte kullanilip kullanilmayacagina karar ver
- Kullanilmayacaksa schema'dan kaldir
- Kullanilacaksa ilgili is mantigi ile entegre et

---

### 1.5 [ORTA] Notification Type Alani Tip Guvenligi

**Dosya:** `convex/schema.ts` -> `notifications.type: v.string()`

4 farkli bildirim tipi (`application_received`, `mentorship_offer`, `badge_awarded`, `application_approved`) string olarak kullaniliyor. Tip guvenligi yok.

**Cozum Plani:**
- `v.string()` yerine `v.union(v.literal("application_received"), ...)` kullan

---

### 1.6 [DUSUK] `skills` vs `competencies` Legacy Alan

**Dosya:** `convex/users.ts:107`

Schema'da hem `skills` hem `competencies` alanlari var. Backend'de `competencies ?? user.skills ?? []` fallback pattern'i ile yonetiliyor. Calisir durumda ama legacy alan kirlilik yaratiyor.

**Cozum Plani:**
- Mevcut verilerde `skills` kullanan kayitlari `competencies`'e migrate et
- Migration sonrasi `skills` alanini schema'dan kaldir

---

## 2. Kod Kalitesi

### 2.1 [YUKSEK] Tekrarlanan Bilesenler: ProjectDetailsDialog

**Dosyalar:**
- `src/modules/dashboard/ui/components/projects/project-details-dialog.tsx` (237 satir)
- `src/modules/dashboard/ui/components/dashboard/project-details-dialog.tsx` (145 satir)

Neredeyse ayni islevi goren iki ayri dialog bileseni. Kucuk layout farkliliklari disinda %80+ kod ortakligina sahip.

**Cozum Plani:**
- Tek bir `ProjectDetailsDialog` bileseni olustur
- Farkli davranislar icin props ile konfigurasyon sagla (orn. `variant: "compact" | "full"`)
- Her iki import noktasini yeni bilesene yonlendir

---

### 2.2 [YUKSEK] Tekrarlanan Bilesenler: Mail Area & Sidebar

**Dosyalar:**
- `src/modules/profile/ui/components/questions/mail-area.tsx` (281 satir)
- `src/modules/academician/ui/components/questions/academician-mail-area.tsx` (279 satir)
- `src/modules/profile/ui/components/questions/mail-sidebar.tsx` (129 satir)
- `src/modules/academician/ui/components/questions/academician-mail-sidebar.tsx` (123 satir)

%95+ kod ortakligi var. Farkliliklar sadece ikon ve degisken isimlendirmesinde.

**Cozum Plani:**
- Ortak bir `MailAreaBase` ve `MailSidebarBase` bileseni olustur
- Rol bazli farkliliklar (`student` / `academician`) props uzerinden inject edilsin
- Modullerdeki mevcut dosyalar bu base bilesenleri sarmalayan ince wrapper'lar olsun

---

### 2.3 [YUKSEK] Tekrarlanan Mantik: Skill/Tag Input Pattern

**Dosyalar (5 farkli dosyada ayni pattern):**
- `src/modules/profile/ui/components/profile/profile-edit-modal.tsx`
- `src/modules/dashboard/ui/components/dashboard/advanced-search-panel.tsx`
- `src/modules/auth/ui/sections/cv-builder-section.tsx`
- `src/modules/dashboard/ui/components/projects/create-project-dialog.tsx`
- `src/modules/dashboard/ui/components/projects/project-edit-dialog.tsx`

Hepsinde ayni `handleAddSkill()`, `removeSkill()` mantigi tekrarlaniyor.

**Cozum Plani:**
- `useTagInput(initialTags)` custom hook'u olustur
- Butun dosyalardaki tekrarlanan mantigi bu hook ile degistir

---

### 2.4 [YUKSEK] Buyuk Bilesenler (>200 Satir)

| Dosya | Satir |
|---|---|
| `auth/ui/sections/cv-builder-section.tsx` | 439 |
| `profile/ui/components/profile/profile-edit-modal.tsx` | 394 |
| `dashboard/ui/components/projects/create-project-dialog.tsx` | 375 |
| `dashboard/ui/components/projects/project-edit-dialog.tsx` | 366 |
| `profile/ui/components/profile/overview-tab.tsx` | 320 |
| `dashboard/ui/views/reports-view.tsx` | 318 |
| `auth/ui/components/profile-photo-modal.tsx` | 317 |
| `dashboard/ui/components/chats/chat-area.tsx` | 306 |

**Cozum Plani:**
- Her buyuk bileseni mantiksal alt bilesenlerine ayir (hedef: <150 satir/bilesen)
- Ornek: `cv-builder-section.tsx` -> `DepartmentSelector`, `SkillsEditor`, `ExperienceForm`, `CompetitionForm` alt bilesenleri
- Ornek: `create-project-dialog.tsx` -> `ProjectForm`, `PositionManager` alt bilesenleri

---

### 2.5 [ORTA] console.log Ifadeleri Uretim Kodunda

**Toplam:** 43 adet (src: 30, convex: 13) - 22 farkli dosyada

**En yogun dosyalar:**
- `convex/seed.ts` (7 adet) - Kabul edilebilir (seed script)
- `convex/http.ts` (4 adet) - Webhook hata kayitlari
- `src/modules/profile/ui/components/questions/mail-area.tsx` (4 adet)
- `src/modules/dashboard/ui/components/projects/project-edit-dialog.tsx` (3 adet)

**Cozum Plani:**
- `convex/seed.ts` ve `convex/http.ts` haric tum console.log/error ifadelerini kaldir
- Gercek hata raporlamasi gereken yerlerde conditional logging veya error boundary kullan

---

### 2.6 [ORTA] `any` Tip Kullanimi

**Dosyalar:**
1. `src/modules/dashboard/ui/components/chats/chat-sidebar.tsx:24,26`
   - `chats: any[]` ve `onSelectChat: (chat: any) => void`
   - Ayni dosyada `ChatItem` interface'i tanimli (satir 13-21) ama kullanilmiyor

2. `convex/http.ts:34`
   - `let body: any` - Webhook body parse

**Cozum Plani:**
- `chat-sidebar.tsx`: `any[]` -> `ChatItem[]`, `(chat: any)` -> `(chat: ChatItem)` olarak guncelle
- `http.ts`: Svix webhook body icin bir interface tanimla

---

### 2.7 [ORTA] Yaniltici Degisken Isimlendirmesi

**Dosya:** `src/modules/academician/ui/components/questions/academician-mail-area.tsx:35-37`
```ts
const student = mailThread.academician; // Not: Isimlendirme 'academician' kalsa da icerik 'karsi taraf'tir.
```
Degisken adi `student` ama aslinda `academician` field'ina isaret ediyor. Yaniltici yorum ile gecistirilmis.

**Cozum Plani:**
- Degisken adini `counterpart` veya `otherParty` olarak degistir
- Mail thread yapisinda rolle bagimli olmayan bir isimlendirme kullan

---

### 2.8 [DUSUK] Hardcoded Status String'leri

Proje durumlari (`"completed"`, `"ongoing"`, `"recruiting"`, `"cancelled"`) ve sohbet tipleri (`"direct"`, `"group"`) birden fazla dosyada string literal olarak tekrarlaniyor.

**Etkilenen dosyalar:** project-card.tsx, project-details-dialog.tsx (x2), projects-advanced-filter.tsx, create-project-dialog.tsx, project-edit-dialog.tsx, chat-sidebar.tsx

**Cozum Plani:**
- `src/lib/constants.ts`'e enum-like sabitler ekle:
  ```ts
  export const PROJECT_STATUS = { RECRUITING: "recruiting", ONGOING: "ongoing", ... } as const;
  export const CHAT_TYPE = { DIRECT: "direct", GROUP: "group" } as const;
  ```

---

### 2.9 [DUSUK] Yaniltici / Gereksiz Yorumlar

**Dosyalar:**
- `src/modules/dashboard/ui/components/dashboard/project-details-dialog.tsx:15-16`
  ```ts
  import { Project } from "../../../types"; // Yolunuzu kontrol edin
  import {ReactNode} from "react"; // Yolunuzu kontrol edin
  ```
  "Yolunuzu kontrol edin" yorumlari gelistirme sirasinda kalmis.

**Cozum Plani:**
- Bu tur gecici yorumlari kaldir

---

## 3. Performans

### 3.1 [YUKSEK] Liste Ogelerinde Tekrarlanan useQuery Cagirilari

**Dosya:** `src/modules/dashboard/ui/components/profiles/profile-card.tsx:19`
```tsx
const departments = useQuery(api.departments.get);
```

Her `ProfileCard` instance'i bagimsiz olarak `departments` query'sini cagiriyor. Sayfalandirilmis listede 8+ kart = 8+ ayni sorgu. Ayni durum:

- `src/modules/dashboard/ui/components/projects/project-card.tsx:23` (`api.users.viewer`)
- `src/modules/dashboard/ui/components/chats/chat-area.tsx:81` (`api.users.viewer`)

**Cozum Plani:**
- Paylasilmis verileri (departments, currentUser) ust bilesen veya Context Provider'a tasi
- Alt bilesenlere props olarak ilet
- `DepartmentsProvider` gibi bir context olustur

---

### 3.2 [YUKSEK] Sayfalandirma Eksik Listeler

**Dosyalar:**
- `src/modules/dashboard/ui/views/chats-view.tsx:33-36` - `listConversations` sayfalandirmasiz
- `src/modules/dashboard/ui/views/academicians-view.tsx:27-30` - `getAcademicians` sayfalandirmasiz

100+ kayit durumunda tum veriler tek seferde cekilip render ediliyor.

**Cozum Plani:**
- Backend'de `usePaginatedQuery` destegi ekle (profiles-view.tsx'teki gibi)
- `convex/chats.ts` ve `convex/users.ts`'deki ilgili query'lere pagination args ekle

---

### 3.3 [YUKSEK] Stabil Olmayan Query Argumanlari

**Dosya:** `src/modules/dashboard/ui/views/profiles-view.tsx:23-31`
```tsx
const { results, status, loadMore } = usePaginatedQuery(
    api.users.getProfiles,
    {
        departments: selectedDepartments,  // Her render'da yeni array referansi
        competencies: selectedSkills,      // Her render'da yeni array referansi
    },
    { initialNumItems: ITEMS_PER_PAGE }
);
```

State array'leri her render'da yeni referans olusturarak gereksiz query tekrarina neden olabilir.

**Cozum Plani:**
- Array argumanlari `useMemo` ile sarmalayarak referans stabilitesi sagla

---

### 3.4 [ORTA] Dinamik Import (Code Splitting) Eksikligi

Projede **0 adet** `next/dynamic` kullanimi var. Agir bilesenler (dialog, modal, gelismis filtre panelleri) sayfa yuklendiginde hemen yukleniyor.

**Etkilenen bilesenler:**
- Tum dialog/modal bilesenleri
- `advanced-search-panel.tsx` (framer-motion dahil)
- `projects-advanced-filter.tsx` (framer-motion dahil)

**Cozum Plani:**
- Kullanicinin her zaman goremedigi bilesenleri `dynamic(() => import(...), { ssr: false })` ile lazy-load yap
- Ozellikle framer-motion iceren bilesenler (~40KB ek bundle) icin oncelikli

---

### 3.5 [ORTA] Eksik useCallback / useMemo

**Dosyalar:**
- `src/modules/dashboard/ui/components/chats/chat-area.tsx:194-245`
  - Mesaj listesinde her mesaj icin yeni `onClick` handler olusturuluyor (N mesaj = N fonksiyon/render)
- `src/modules/dashboard/ui/views/dashboard-view.tsx:45-51`
  - `handleCloseDialog` her render'da yeniden olusturuluyor
- `src/modules/dashboard/ui/views/profiles-view.tsx:87-91`
  - Filtre sifirlama callback'i inline

**Cozum Plani:**
- Sik kullanilan callback'leri `useCallback` ile sarmalala
- Ozellikle liste icindeki tekrarlanan handler'lar icin tek bir callback + parametre pattern'i kullan

---

### 3.6 [ORTA] `next/image` Kullanilmiyor

Projede avatar ve profil resimleri icin `<img>` HTML etiketi veya Radix `<AvatarImage>` kullaniliyor. `next/image` optimizasyonlarindan (lazy loading, responsive sizing, format donusumu) yararlanilmiyor.

**Dosya ornegi:** `src/modules/profile/ui/components/questions/photo-upload-dialog.tsx:60-64`
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={previewUrl} alt="Preview" />
```
ESLint uyarisi eslint-disable ile bastirilmis.

**Cozum Plani:**
- S3'ten gelen resimleri `next.config.ts` remotePatterns'a ekle
- Mumkun olan yerlerde `<Image>` bilesenine gec
- Avatar bilesenleri icin Radix bileseninin icinde `next/image` kullanilabilir

---

### 3.7 [ORTA] Dialog Acilislarinda Tekrarlanan Sorgular

**Dosya:** `src/modules/dashboard/ui/components/academics/academician-contact-dialog.tsx:50-54`
```tsx
const myProjects = useQuery(api.projects.getMyProjects, { userId });
const currentUser = useQuery(api.users.getAuthUser, { userId });
```

Dialog her acildiginda sorgular calisiyor. Kullanici diyalogu 5 kez acip kaparsa 10 gereksiz sorgu.

**Cozum Plani:**
- Dialog acik degilken query'leri `"skip"` ile duraklat:
  ```tsx
  const myProjects = useQuery(api.projects.getMyProjects, open ? { userId } : "skip");
  ```

---

### 3.8 [DUSUK] 75 Dosyada "use client" Direktifi

75 dosya "use client" olarak isaretli. Bunlarin bir kismi (ozellikle `components/ui/` altindaki Radix primitive'leri) Radix gereksinimleri nedeniyle zorunlu. Ancak bazi bilesenler gercekten server component olabilir:

- `src/modules/home/ui/components/home-navigation-bar.tsx` - Statik icerik
- `src/modules/profile/ui/components/profile/profile-sidebar.tsx` - Goruntuleme odakli

**Cozum Plani:**
- Her "use client" dosyasini tek tek incele
- Hook, event handler veya browser API kullanmayanlardan direktifi kaldir

---

### 3.9 [DUSUK] Framer Motion Bundle Etkisi

10 dosyada `framer-motion` kullaniliyor (~40KB ek bundle). Cogu animasyon basit fade/slide efektleri icin.

**Cozum Plani:**
- Basit animasyonlar icin CSS transition/animation kullanmayi degerlendir
- Framer-motion gereken bilesenleri dynamic import ile lazy-load yap

---

## 4. CLAUDE.md Kural Ihlalleri

### 4.1 [YUKSEK] `any` Tip Kullanimi

**Kural:** "any kullanma. Tum veriler icin types.ts dosyalarindaki arayuzleri kullan."

**Ihlaller:**
- `src/modules/dashboard/ui/components/chats/chat-sidebar.tsx:24` -> `chats: any[]`
- `src/modules/dashboard/ui/components/chats/chat-sidebar.tsx:26` -> `onSelectChat: (chat: any) => void`
- `convex/http.ts:34` -> `let body: any`

**Cozum Plani:** Bolum 2.6'daki cozume bak.

---

### 4.2 [ORTA] Ingilizce Kullanici Arayuzu Metinleri

**Kural:** "Butun kullanici arayuzundeki kullanilacak yazilar Turkce dilinde olmalidir."

**Ihlaller:**

| Dosya | Satir | Metin |
|---|---|---|
| `src/app/dashboard/chats/page.tsx` | 6 | `"Loading chats..."` |
| `src/modules/dashboard/ui/components/chats/chat-area.tsx` | 178 | `"Load Previous Messages"` |
| `src/modules/dashboard/ui/components/chats/chat-area.tsx` | 191 | `"No messages yet. Send a wave!"` |
| `src/modules/dashboard/ui/components/chats/chat-area.tsx` | 279 | `"Message Details"` |
| `src/modules/dashboard/ui/components/chats/chat-area.tsx` | 280 | `"Message metadata."` |
| `src/modules/dashboard/ui/components/chats/chat-area.tsx` | 290 | `"Sender"` |
| `src/components/ui/command.tsx` | 33 | `"Command Palette"` |
| `src/components/ui/pagination.tsx` | 74,91 | `"Go to previous/next page"` |

**Cozum Plani:**
- Her metni Turkce karsiligiyla degistir:
  - "Loading chats..." -> "Sohbetler yukleniyor..."
  - "Load Previous Messages" -> "Onceki Mesajlari Yukle"
  - "No messages yet. Send a wave!" -> "Henuz mesaj yok. Bir merhaba gonder!"
  - "Message Details" -> "Mesaj Detaylari"
  - "Sender" -> "Gonderen"

---

### 4.3 [ORTA] README'de npm/yarn Onerileri

**Kural:** "Sadece Bun kullan. Asla npm veya yarn komutu onerme."

**Dosya:** `README.md:8-12` - Next.js varsayilan README'si `npm run dev`, `yarn dev`, `pnpm dev` oneriyor.

**Cozum Plani:**
- README'yi guncelleyerek sadece `bun run dev` komutunu goster

---

### 4.4 [DUSUK] ESLint Kuralinin Bastirilmasi

**Dosya:** `src/modules/profile/ui/components/questions/photo-upload-dialog.tsx:59`
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
```

`@next/next/no-img-element` kurali bastirilmis. Bu, Next.js'in gorsel optimizasyonunu atliyor.

**Cozum Plani:**
- `<img>` yerine `<Image>` bileseni kullan veya preview icin kabul edilebilir bir nedeni dokumante et

---

## Oncelik Sirasi ve Uygulama Plani

### Fase 1: Kritik ve Guvenlik (Hemen)
1. `rejectApplication` yetkilendirme kontrolu ekle (1.1)

### Fase 2: Tip Guvenligi (Kisa Vadeli)
2. Tip uyumsuzluklarini duzelt (1.2, 1.3)
3. `any` kullanimlarini kaldir (2.6, 4.1)
4. Ingilizce UI metinlerini Turkcele (4.2)

### Fase 3: DRY ve Temiz Kod (Orta Vadeli)
5. Tekrarlanan bilesenleri birlestir (2.1, 2.2)
6. `useTagInput` custom hook'u olustur (2.3)
7. Buyuk bilesenleri parcala (2.4)
8. console.log ifadelerini temizle (2.5)

### Fase 4: Performans Optimizasyonu (Orta-Uzun Vadeli)
9. Paylasilmis query'leri Context'e tasi (3.1)
10. Eksik sayfalandirmalari ekle (3.2)
11. Dynamic import ekle (3.4)
12. Dialog query'lerini "skip" ile optimize et (3.7)
13. useCallback/useMemo ekle (3.5)

### Fase 5: Ince Ayar (Uzun Vadeli)
14. Kullanilmayan schema alanlarini temizle (1.4)
15. Status sabitlerini merkezi hale getir (2.8)
16. next/image migrasyonu (3.6)
17. Gereksiz "use client" direktiflerini kaldir (3.8)
18. README guncelle (4.3)