# edit-list.md — Synapse Proje Düzenleme Listesi

---

## Phase 4: Statik Analiz ve Tip Hataları

> `bun run lint` çıktısına göre tespit edildi: 1 hata, 7 düzeltilebilir uyarı (4 adet `convex/_generated/` üretilmiş dosya uyarısı kapsam dışı).

- [x] `src/modules/dashboard/ui/views/chats-view.tsx:3` — `useMemo` import kaldırıldı.
- [x] `src/modules/dashboard/ui/views/chats-view.tsx:47` — **HATA:** `selectedChatId` state tamamen kaldırıldı; effect yalnızca `router.replace/push` side-effect'leri yapacak şekilde yeniden yazıldı.
- [x] `src/modules/dashboard/ui/views/profiles-view.tsx:14` — `Department` import kaldırıldı.
- [x] `src/modules/dashboard/ui/components/profiles/profile-details-dialog.tsx:45` — Kullanılmayan `departments` sorgu satırı kaldırıldı.
- [x] `convex/http.ts:54` — `subject` değişken satırı kaldırıldı.
- [x] `convex/projects.ts:490` — `eslint.config.mjs`'e `ignoreRestSiblings: true` ve `varsIgnorePattern: "^_"` eklendi; kural artık `_` prefix'li değişkenleri görmezden geliyor.
- [x] `src/modules/users/server/procedures.ts:36` — `catch (error)` → `catch` (parametre kaldırıldı).
- [x] `eslint.config.mjs` — `convex/_generated/**` ignore'a eklendi; `@typescript-eslint/no-unused-vars` kuralı `varsIgnorePattern`, `argsIgnorePattern`, `ignoreRestSiblings` seçenekleriyle yapılandırıldı.

---

---

## Phase 5: Playwright Arayüz Hataları

> `bunx playwright test` ile 63/63 test geçti (public sayfalar + auth redirect hedef sayfalar).
> Authenticated içerik için statik kod analizi yapıldı; aşağıdaki yatay taşma riskleri tespit edildi.

- [x] `src/modules/dashboard/ui/components/chats/chat-area.tsx` — Mesaj balonu sarmalayıcısına `min-w-0` eklendi; `whitespace-pre-wrap` içeriğine `break-words` eklendi.
- [x] `src/modules/dashboard/ui/components/academy/academy-event-card.tsx` — `pr-3` → `[&>[data-radix-scroll-area-viewport]]:pr-3` ile Radix viewport'a taşındı.
- [~] `src/modules/profile/ui/components/questions/mail-area.tsx` — `h-[calc(100dvh-5rem)]` tasarım kararı; mevcut yapıya dokunulmadı. Test geçiyor.
- [~] `src/modules/academician/ui/components/questions/academician-mail-area.tsx` — Aynı şekilde bırakıldı. Test geçiyor.

**Son test sonucu: 96/96 passed** (3 viewport × 32 test) — public sayfalar + authenticated sayfalar + ScrollArea'lar yatay taşma yok.

---

## Phase 1: Stil Uyumsuzlukları

> **Hedef:** Hard-coded Tailwind renk sınıfları (`text-indigo-*`, `bg-slate-*`, `bg-red-*`, `bg-green-*`, `text-white` vb.) kaldırılarak, `globals.css`'de tanımlı semantik değişkenler (`text-primary`, `bg-background`, `text-destructive`, vb.) kullanılacak.
>
> **Semantik Harita (Referans):**
> - `bg-slate-950` → `bg-background`
> - `text-slate-200` → `text-foreground`
> - `text-slate-400` / `text-slate-500` → `text-muted-foreground`
> - `text-slate-600` → `text-muted-foreground/70`
> - `bg-slate-900` → `bg-card`
> - `bg-slate-900/50` → `bg-card/50`
> - `border-slate-800` → `border-border`
> - `bg-slate-800` / `bg-slate-700` → `bg-muted` / `bg-border`
> - `bg-indigo-*` / `text-indigo-*` / `border-indigo-*` → `bg-primary/...` / `text-primary` / `border-primary/...`
> - `bg-indigo-600 hover:bg-indigo-700 text-white` → varsayılan `<Button>` (primary rengi zaten violet)
> - `bg-blue-500` (okunmamış nokta) → `bg-primary`
> - `text-red-*` / `bg-red-*` (tehlikeli aksiyon) → `text-destructive` / `bg-destructive`
> - `bg-destructive text-white` → `bg-destructive text-destructive-foreground`
> - `bg-green-*` / `text-green-*` (başarı/uygunluk durumu) → `globals.css`'e eklenecek `--success` değişkeni ile `bg-success/10 text-success` şeklinde
>
> **`--success` değişkeni `globals.css` `:root` bloğuna eklenecek:**
> ```css
> --success: oklch(0.627 0.194 145.000);   /* green-500 eşdeğeri */
> --success-foreground: oklch(0.985 0 0);
> ```
> ve `@theme inline` bloğuna:
> ```css
> --color-success: var(--success);
> --color-success-foreground: var(--success-foreground);
> ```

---

### 1.1 — `globals.css` — `--success` Renk Değişkeni Ekleme

- [x] `src/app/globals.css` — `@theme inline` ve `:root` bloklarına `--success` / `--success-foreground` değişkenleri eklenir; böylece `bg-success`, `text-success`, `border-success` semantik sınıfları kullanılabilir hale gelir.

---

### 1.2 — Ana Sayfa (Home) Modülü — `slate-*` → Semantik

Tüm home modülü sayfaları birebir `--background`, `--card`, `--border` eşlerine sahip `slate-*` sınıfları kullanmaktadır.

- [x] `src/modules/home/ui/views/home-view.tsx` (satır 11) — `bg-slate-950 text-slate-200` → `bg-background text-foreground`
- [x] `src/modules/home/ui/sections/features-section.tsx` (satır 5, 9, 14, 20, 26, 32, 38, 44) — `bg-slate-950/50`, `text-slate-400`, `bg-slate-900/50`, `border-slate-800`, `bg-slate-900` → semantik eşleri
- [x] `src/modules/home/ui/sections/footer-section.tsx` (satır 6, 15, 45, 46, 47, 48, 49) — `bg-slate-950`, `bg-slate-700`, `border-slate-800`, `text-slate-600`, `hover:text-slate-400` → semantik eşleri
- [x] `src/modules/home/ui/sections/dashboard-preview-section.tsx` (satır 7, 11, 17, 26-29, 44, 45, 51-53) — `border-slate-800`, `bg-slate-900/50`, `bg-slate-950/50`, `text-slate-500`, `bg-slate-800`, `bg-slate-800/50`, `bg-slate-800/30` → semantik eşleri

---

### 1.3 — Akademisyen Modülü — `indigo-*` → `primary`

- [x] `src/modules/academician/ui/views/advisor-projects-view.tsx` (satır 76, 129, 149) — `text-indigo-600 dark:text-indigo-400` → `text-primary`; `bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800` → `bg-primary/10 text-primary border-primary/20`; `bg-indigo-600 hover:bg-indigo-700` → kaldırılır, varsayılan `<Button>` yeterli
- [x] `src/modules/academician/ui/components/projects/advisor-project-card.tsx` (satır 22, 59) — `text-indigo-500 border-indigo-200 bg-indigo-500/10` → `text-primary border-primary/20 bg-primary/10`; `bg-indigo-600 hover:bg-indigo-700 text-white` → `bg-primary hover:bg-primary/90 text-primary-foreground`
- [x] `src/modules/academician/ui/components/questions/academician-mail-sidebar.tsx` (satır 68) — `bg-blue-500` (okunmamış gösterge) → `bg-primary`

---

### 1.4 — Dashboard Modülü — Karışık Renk Düzeltmeleri

- [x] `src/modules/dashboard/ui/components/academics/academician-details-dialog.tsx` (satır 70, 114, 119) — `bg-green-500/90 hover:bg-green-600 text-white` → `bg-success/90 hover:bg-success/80 text-success-foreground`; `text-indigo-500` → `text-primary`; `text-green-600` → `text-success`
- [x] `src/modules/dashboard/ui/components/academy/academy-event-card.tsx` (satır 99, 121–122, 215) — `bg-black/60 text-white` (image overlay badge) → `bg-background/60 text-foreground`; `bg-white/20 backdrop-blur-md` (play overlay) → `bg-foreground/20 backdrop-blur-md`; `bg-red-600 hover:bg-red-700 text-white shadow-red-500/20` → `bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20`
- [x] `src/modules/dashboard/ui/components/profiles/profile-card.tsx` (satır 43, 87–105) — `bg-green-500` (müsaitlik noktası) → `bg-success`; tüm `border-indigo-500/20`, `bg-indigo-500/5`, `text-indigo-400`, `bg-indigo-500/10` → `border-primary/20`, `bg-primary/5`, `text-primary`, `bg-primary/10`; `rgba(99,102,241,...)` içeren `shadow-[...]` değerleri → `shadow-primary/20` ve `shadow-primary/40` şeklinde güncellenir
- [x] `src/modules/dashboard/ui/components/profiles/profile-details-dialog.tsx` (satır 115, 240) — `bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200` → `bg-success/10 text-success hover:bg-success/20 border-success/20`; `bg-indigo-500/10 text-indigo-600 border-indigo-200` → `bg-primary/10 text-primary border-primary/20`
- [x] `src/modules/dashboard/ui/components/projects/application-card.tsx` (satır 150, 158, 167) — `text-red-500 hover:text-red-600` → `text-destructive hover:text-destructive/80`; `text-green-500 hover:text-green-600` → `text-success hover:text-success/80`; `bg-green-500/10 text-green-700` → `bg-success/10 text-success`
- [x] `src/modules/dashboard/ui/components/projects/project-card.tsx` (satır 70) — `border-green-500 text-green-600 bg-green-500/10` → `border-success text-success bg-success/10`

---

### 1.5 — Profile Modülü — `indigo-*` / `green-*` → Semantik

- [x] `src/modules/profile/ui/components/profile/overview-tab.tsx` (satır 135–140) — `border-indigo-500/20`, `bg-indigo-500/5`, `bg-indigo-500/10`, `text-indigo-400`, `text-indigo-400/80` → `border-primary/20`, `bg-primary/5`, `bg-primary/10`, `text-primary`, `text-primary/80`
- [x] `src/modules/profile/ui/components/profile/profile-sidebar.tsx` (satır 49) — `bg-green-500/10 text-green-600 border-green-200` → `bg-success/10 text-success border-success/20`
- [x] `src/modules/profile/ui/components/questions/mail-sidebar.tsx` (satır 64) — `bg-blue-500` (okunmamış gösterge) → `bg-primary`

---

### 1.6 — Auth Modülü — Semantik Düzeltmeler

- [x] `src/modules/auth/ui/components/auth-button.tsx` (satır 120) — `text-red-600 focus:text-red-600 focus:bg-red-50` → `text-destructive focus:text-destructive focus:bg-destructive/10`
- [x] `src/modules/auth/ui/components/profile-photo-modal.tsx` (satır 227) — `bg-destructive text-white` → `bg-destructive text-destructive-foreground` (`text-white` yerine semantik)

---

> **Tamamlama Notu:** Her madde düzeltildikçe `[ ]` → `[x]` olarak işaretlenecektir.

---

## Phase 3: Kod Mimarisi ve Clean Code

> **Kapsam Dışı:** `node_modules`, `.next`, `src/components/ui`

---

### 3.1 — Tekrarlanan Utility Fonksiyonları `lib/utils.ts`'e Taşı

- [x] `src/lib/utils.ts` — `getInitials(name, fallback?)` ve `getDeptLabel(value, departments[])` fonksiyonları eklenir.
- [x] `src/modules/dashboard/ui/components/profiles/profile-card.tsx` — inline `getInitials` + `getDeptLabel` kaldırılır, `@/lib/utils`'den import edilir.
- [x] `src/modules/dashboard/ui/components/academics/academician-details-dialog.tsx` — inline `getInitials` kaldırılır.
- [x] `src/modules/auth/ui/components/auth-button.tsx` — inline `getInitials` kaldırılır.
- [x] `src/modules/dashboard/ui/components/projects/application-card.tsx` — inline `getInitials` kaldırılır.
- [x] `src/modules/dashboard/ui/components/profiles/profile-details-dialog.tsx` — inline `getInitials` + `getDeptLabel` kaldırılır.
- [x] `src/modules/dashboard/ui/components/projects/create-project-dialog.tsx` — inline `getDeptLabel` kaldırılır.
- [x] `src/modules/profile/ui/components/profile/overview-tab.tsx` — `BadgesCard` içindeki inline `getInitials` ve `formatDate` kaldırılır; `@/lib/utils`'den import edilir.

---

### 3.2 — Birden Fazla Bileşen İçeren Dosya: `overview-tab.tsx` Parçalanacak

`overview-tab.tsx` tek dosyada `BadgesCard`, `StatsCards` ve `OverviewTab` olmak üzere 3 bileşen barındırıyor.

- [x] `src/modules/profile/ui/components/profile/badges-card.tsx` — `BadgesCard` bileşeni buraya taşınır.
- [x] `src/modules/profile/ui/components/profile/overview-tab.tsx` — `BadgesCard` import edilir, `StatsCards` paylaşımlı bileşenle değiştirilir.

---

### 3.3 — Tekrarlanan UI Deseni: `ProjectStatsCards` Ortak Bileşen

`profile-card.tsx` ve `overview-tab.tsx`'in `StatsCards` alt bileşeni birebir aynı iki istatistik kartı render ediyor.

- [x] `src/modules/dashboard/ui/components/shared/project-stats-cards.tsx` — `completedCount` ve `activeCount` prop alan ortak bileşen oluşturulur.
- [x] `src/modules/dashboard/ui/components/profiles/profile-card.tsx` — inline stat grid kaldırılır, `ProjectStatsCards` kullanılır.
- [x] `src/modules/profile/ui/components/profile/overview-tab.tsx` — `StatsCards` kaldırılır, `ProjectStatsCards` kullanılır.

---

### 3.4 — Tekrarlanan UI Deseni: `EmptyState` Ortak Bileşen

5 view dosyasında farklı görünümlerde aynı "sonuç bulunamadı" bloğu mevcut.

- [x] `src/modules/dashboard/ui/components/shared/empty-state.tsx` — `title`, `description?`, `icon?`, `action?` prop alan ortak bileşen oluşturulur.
- [x] `src/modules/dashboard/ui/views/dashboard-view.tsx` — inline empty state → `EmptyState`
- [x] `src/modules/dashboard/ui/views/projects-view.tsx` — inline empty state → `EmptyState`
- [x] `src/modules/dashboard/ui/views/academicians-view.tsx` — inline empty state → `EmptyState`
- [x] `src/modules/dashboard/ui/views/profiles-view.tsx` — inline empty state → `EmptyState`
- [x] `src/modules/dashboard/ui/views/academy-view.tsx` — iki ayrı inline empty state → `EmptyState`

---

### 3.5 — Tekrarlanan Bileşen: İki `ProjectsFilterBar` Birleştirilecek

`src/modules/dashboard/ui/components/dashboard/projects-filter-bar.tsx` ile `src/modules/dashboard/ui/components/projects/projects-filter-bar.tsx` neredeyse birebir aynı. Farklar: placeholder metni, buton etiketi ve giriş genişliği.

- [x] `src/modules/dashboard/ui/components/projects/projects-filter-bar.tsx` — `searchPlaceholder` ve `filterLabel` prop eklenerek genelleştirilir; `w-86` (geçersiz sınıf) → `w-full lg:w-96`; buton grubu responsive (`grid grid-cols-2 sm:flex`) hale getirilir.
- [x] `src/modules/dashboard/ui/components/dashboard/projects-filter-bar.tsx` — SİLİNDİ; dashboard-view `projects/projects-filter-bar`'ı import edecek şekilde güncellendi.

---

## Phase 2: Responsive Hataları

> **Hedef:** Tüm sayfa ve bileşenler Masaüstü (≥1024px), Tablet (768–1023px), Telefon (<768px) ekranlarında kusursuz çalışacak.
>
> **Tespit Edilen Örüntü:** Proje genel olarak masaüstü/tablet için iyi tasarlanmış ancak `sm:` (640px) breakpoint eksiklikleri ve sabit piksel/rem değerleri mobil görünümü bozuyor.

---

### 2.1 — Kritik: Form Grid'i Mobilde Tek Sütuna Düşmüyor

- [x] `src/modules/auth/ui/sections/basic-info-section.tsx` — `grid-cols-2` sabit ikilik sütun, mobilde alanlar yan yana sığmıyor. → `grid-cols-1 sm:grid-cols-2`

---

### 2.2 — Kritik: Chat / Mail Sidebar Sabit Genişliği

- [x] `src/modules/dashboard/ui/views/chats-view.tsx` — Sidebar `w-80 lg:w-96` tablet ekranlarda (768–900px) ana içerikle sıkışıyor. → `w-64 lg:w-80 xl:w-96`
- [x] `src/modules/academician/ui/views/academician-mails-view.tsx` — Aynı sorun, aynı düzeltme. → `w-64 lg:w-80 xl:w-96`

---

### 2.3 — Yüksek: Dialog Genişlikleri Mobilde Taşıyor

- [x] `src/modules/dashboard/ui/components/projects/create-project-dialog.tsx` — `max-w-2xl` dar ekranlarda kenarlara dayanan dialog. → `w-[95vw] sm:max-w-lg md:max-w-2xl`
- [x] `src/modules/dashboard/ui/components/projects/project-edit-dialog.tsx` — Aynı sorun. → `w-[95vw] sm:max-w-lg md:max-w-2xl`

---

### 2.4 — Yüksek: Grid Sütun Breakpoint Eksiklikleri

- [x] `src/modules/dashboard/ui/views/academicians-view.tsx` — `minmax(400px,1fr)` tablet ekranlarda tek sütun kalıyor, çok boş alan. → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]`
- [x] `src/modules/dashboard/ui/views/profiles-view.tsx` — `md:` breakpointine kadar tek sütun, `sm:` arası boşta. → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]`
- [x] `src/modules/dashboard/ui/views/academy-view.tsx` — İki gridde de `sm:` breakpoint eksik, ayrıca `max-w-100` geçersiz Tailwind sınıfı. → Grid'lere `sm:grid-cols-2` eklendi; `max-w-100` → `max-w-sm`

---

### 2.5 — Yüksek: Auth Görünümleri Mobilde Kenarlara Yaslanıyor

- [x] `src/modules/auth/ui/views/sign-up-view.tsx` — `max-w-4xl` kart tüm ekranlarda sabit genişlik, mobilde yatay padding yok. → `w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-4xl`
- [x] `src/modules/auth/ui/views/sign-in-view.tsx` — `max-w-sm` mobilde ekran kenarlarına çok yakın. → `w-[92vw] sm:max-w-sm`

---

### 2.6 — Orta: Gelişmiş Arama Paneli Flex Yönü

- [x] `src/modules/dashboard/ui/components/dashboard/advanced-search-panel.tsx` — `md:flex-row` atlaması, 640–767px arası dikey kalıyor ve sıkışık görünüyor. → `sm:flex-row`; `min-w-30` geçersiz sınıf → `min-w-[6rem] sm:min-w-[7.5rem]`

---

### 2.7 — Orta: CV Builder Min-Genişlik Sorunu

- [x] `src/modules/dashboard/ui/components/projects/create-project-dialog.tsx` ve `project-edit-dialog.tsx` — Input içi `min-w-30` geçersiz sınıf → `min-w-[6rem] sm:min-w-[7.5rem]` (not: sorun cv-builder'da değil dialog'lardaydı)
