# Synapse — Tasarım Sistemi Dokümantasyonu

Bu doküman, **Synapse** uygulamasının görsel tasarım dilini, bileşen kullanım kalıplarını ve route bazlı sayfa yapısını başka bir projede yeniden üretilebilecek düzeyde ayrıntılı olarak açıklar. Yeni bir Claude Code oturumuna bu dosya verildiğinde, aynı (veya çok benzer) görsel dili başka bir uygulamada kurabilmesi hedeflenmiştir.

> Kaynak proje stack'i: Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (`style: "new-york"`, `baseColor: "neutral"`) + Radix UI primitives + Convex (backend) + Zustand/React Query + Bun. Bu dokümanı başka bir stack'e uygularken önemli olan **tasarım tokenleri, bileşen varyantları ve layout kalıplarıdır** — backend/stack detayları değil.

---

## 1. Kurulum & Araç Zinciri

```bash
bun add tailwindcss@4 tw-animate-css class-variance-authority clsx tailwind-merge
bun add @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-checkbox \
  @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-popover \
  @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slot @radix-ui/react-tabs
bun add lucide-react sonner cmdk input-otp framer-motion next-themes
```

`components.json` (shadcn CLI config):
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" }
}
```

Font: `Inter` (next/font/google), tüm `<body>` bu fontu kullanır. `<html lang="tr" className="dark">` — **uygulama sabit dark mode'da çalışır**, light tema fiilen kullanılmaz (variant tanımlı ama toggle yok).

---

## 2. Renk Sistemi (Design Tokens)

Tema **OKLCH renk uzayında, tek koyu (dark) tema** olarak tanımlanır. `--primary` = violet-600 eşdeğeri. Tüm renkler `globals.css` içinde `:root` altında CSS custom property olarak tanımlanır, Tailwind'e `@theme inline` ile semantik class isimleriyle bağlanır (`bg-primary`, `text-muted-foreground` vb.).

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
}

:root {
  --radius: 0.625rem;

  --background: oklch(0.129 0.042 264.695);        /* Slate 950 */
  --foreground: oklch(0.929 0.013 255.508);         /* Slate 200 */

  --card: oklch(0.208 0.042 265.755);               /* Slate 900 */
  --card-foreground: oklch(0.985 0 0);

  --popover: oklch(0.129 0.042 264.695);
  --popover-foreground: oklch(0.985 0 0);

  --primary: oklch(0.558 0.288 291.135);            /* Violet 600 */
  --primary-foreground: oklch(0.985 0 0);

  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.985 0 0);

  --muted: oklch(0.208 0.042 265.755);
  --muted-foreground: oklch(0.637 0.036 261.346);

  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.985 0 0);

  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.985 0 0);

  --border: oklch(0.279 0.041 260.031);             /* Slate 800 */
  --input: oklch(0.279 0.041 260.031);
  --ring: oklch(0.558 0.288 291.135);

  --chart-1: oklch(0.558 0.288 291.135);
  --chart-2: oklch(0.705 0.169 217.200);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  --sidebar: oklch(0.129 0.042 264.695);
  --sidebar-foreground: oklch(0.929 0.013 255.508);
  --sidebar-primary: oklch(0.558 0.288 291.135);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.208 0.042 265.755);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.279 0.041 260.031);
  --sidebar-ring: oklch(0.558 0.288 291.135);

  --success: oklch(0.627 0.194 145.000);            /* Green-500 eşdeğeri */
  --success-foreground: oklch(0.985 0 0);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground selection:bg-violet-500/30 selection:text-violet-200 antialiased; }
}

@keyframes accordion-down { from { height: 0; } to { height: var(--radix-accordion-content-height); } }
@keyframes accordion-up   { from { height: var(--radix-accordion-content-height); } to { height: 0; } }

@layer utilities {
  .animate-accordion-down { animation: accordion-down 0.2s ease-out; }
  .animate-accordion-up   { animation: accordion-up   0.2s ease-out; }
  .animate-marquee { animation: marquee 15s linear infinite; min-width: 100%; }
}

@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
```

### Kritik kural
**Asla hardcoded hex/rgb renk kullanma.** Her zaman semantik class: `bg-background`, `bg-card`, `bg-primary`, `text-muted-foreground`, `border-border`, `bg-secondary`, `text-destructive`, `bg-success`. İstisna: durum/etiket renklendirmede kontrollü şekilde Tailwind'in kendi paletinden (teal, orange, indigo, rose, blue) yarı saydam tonlar kullanılır (bkz. §4 Badge varyantları) — ama bunlar bile her zaman `/NN` opacity ile "soft" kullanılır, asla düz doygun renk değil.

---

## 3. Layout İskeletleri (Route Grupları)

Her ana bölüm (`dashboard`, `academician`, `admin`, `profile`) kendi `layout.tsx`'inde bir üst header + kaydırılabilir içerik alanından oluşan **CSS grid tabanlı** bir kabuk kullanır — `position: sticky` yerine `grid-rows-[Xrem_1fr]` tercih edilir:

```tsx
<main className="min-h-dvh grid grid-rows-[5rem_1fr]">
  <NavigationBar />
  <ScrollArea className="h-[calc(100dvh-5rem)] w-full">
    <div className="h-full w-full">{children}</div>
  </ScrollArea>
</main>
```

- Header satırı sabit yükseklik (`5rem` = 80px normal shell'ler için, admin'de `4rem` = 64px — admin daha "sade/küçük" görünür).
- İçerik, Radix `ScrollArea` (`src/components/ui/scroll-area.tsx`) içinde kayar; scrollbar thumb `bg-border rounded-full w-2.5`.
- **Admin istisna**: `ScrollArea` kullanmaz, düz `<div className="p-6">`; nav linki yoktur, sadece logo + "Yönetim Paneli" etiketi + kullanıcı menüsü. Admin panelinin kasıtlı olarak "tek amaçlı, sade" görünmesi isteniyor.
- **Public/landing** (`/`, `/about`) ayrı bir kalıp kullanır: grid yerine `fixed top-0 z-50` gerçek sabit navbar + `min-h-dvh` sayfa; header scroll'a göre saydamdan opak+blur'a geçer.
- **Auth sayfaları** (`/sign-in`, `/sign-up`) hiçbir ortak layout kullanmaz — tam ekran ortalanmış tek kart.

### Navigasyon çubuğu deseni (dashboard / academician / profile ortak)

```tsx
<header className="top-0 w-full border-b h-20">
  <nav className="h-full px-4 md:px-6 flex items-center justify-between">
    <SynapseLogo />
    <div className="hidden xl:flex items-center gap-1">
      {/* nav linkleri */}
    </div>
    <div className="h-6 w-px bg-border/60" /> {/* dikey ayraç */}
    <AuthButton />
    {/* xl altı: DropdownMenu (Menu ikonu) ile mobil menü — Sheet DEĞİL */}
  </nav>
</header>
```

- Dashboard header'ı ek olarak scroll-aware: `scrollY > 20` olunca `bg-background/80 backdrop-blur-md`, değilse düz `bg-background`. `transition-all duration-300`.
- Nav linkleri `Button variant="nav" asChild data-active={pathname===href}` — aktif stil **CVA `data-[active=true]` selector'ü ile**, JS class branching ile değil.
- Mobil menü: `DropdownMenu` + `Menu` (lucide) ikonlu ghost icon buton → `DropdownMenuContent align="end" className="w-48 mt-2"`, aktif öğe `font-bold text-primary`.
- **İstisna: Public landing'de mobil menü `Sheet` (`side="top"`)** kullanır — uygulama kabuğu (DropdownMenu) ile pazarlama sayfası (Sheet) arasındaki tek fark budur.
- `AuthButton`: giriş yapılmamışsa `LogIn` ikonlu `Button`; yükleniyorsa dönen `Loader2`; giriş yapılmışsa `Avatar` (`h-10 w-10 border border-border/50`, fallback = `bg-primary/10 text-primary` + baş harfler) → tıklayınca `DropdownMenu` (isim/email, rol bazlı linkler, `LogOut` kırmızı: `text-destructive focus:bg-destructive/10`).

### Logo (`SynapseLogo`, her header'da ortak)

```tsx
<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
  <Image src="/logo.png" width={120} height={120} className="w-auto h-20 object-contain" alt="Synapse" />
  <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-violet-200 to-violet-400 tracking-tight">
    SYNAPSE
  </span>
</Link>
```

---

## 4. Temel UI Bileşenleri (shadcn/ui primitives — `src/components/ui/`)

Standart shadcn "new-york" varyasyonları + **proje özelinde genişletilmiş `button` ve `badge` varyantları**:

### `button.tsx` — CVA varyantları
```tsx
variant: {
  default:     "rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5", // "Aramıza Katıl" — glow + kalkma efekti
  destructive: "bg-destructive text-white hover:bg-destructive/90 ...",
  outline:     "border border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10 backdrop-blur-sm", // glassmorphic
  secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost:       "text-sm font-medium text-white bg-white/5 border border-white/10 rounded-full hover:bg-accent transition-all",
  link:        "text-primary underline-offset-4 hover:underline",
  nav:         "bg-secondary/50 text-muted-foreground hover:bg-primary/50 hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-foreground data-[active=true]:shadow-sm rounded-full", // özel: nav pill
},
size: { default: "h-10 px-5", sm: "h-9 px-3", lg: "h-12 px-8 text-base", icon: "size-10", "icon-sm": "size-8", "icon-lg": "size-12" }
```
Base: `rounded-md text-sm font-medium transition-all duration-300 cursor-pointer`, ikonlar otomatik `size-4`. **`data-variant`/`data-size` attribute'ları root elemente yazılır** (debug/stil hedefleme için).

### `badge.tsx` — CVA varyantları (varsayılan shadcn setinin ötesinde genişletilmiş)
```tsx
variant: {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-white",
  outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
  turquoise: "bg-secondary border-teal-400/50 text-teal-500 dark:border-teal-400/30 dark:text-teal-400",
  orange: "bg-secondary border-orange-400/50 text-orange-500 dark:border-orange-400/30 dark:text-orange-400",
  indigo: "bg-secondary border-indigo-400/50 text-indigo-500 dark:border-indigo-400/30 dark:text-indigo-400",
  turquiseLight: "bg-blue-100/50 border-blue-200 text-blue-600 dark:bg-blue-900/50 dark:border-blue-500 dark:text-blue-300",
}
```
Şekil: `rounded-full border px-2 py-0.5 text-xs font-medium`. **Desen**: her yeni "kategori" renk grubu için (yetenek etiketi, alan etiketi vb.) `bg-secondary` + renkli `border-COLOR-400/50` + `text-COLOR-500` üçlüsünü tekrarla — bu, hardcoded renk yasağını ihlal etmeden çeşitlilik sağlar.

### `card.tsx`
```tsx
Card:        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
CardHeader:  "grid auto-rows-min grid-rows-[auto_auto] gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
CardTitle:   "leading-none font-semibold"
CardDescription: "text-muted-foreground text-sm"
CardContent: "px-6"
CardFooter:  "flex items-center px-6 [.border-t]:pt-6"
```

### Diğer primitive'ler (aynen shadcn "new-york" varsayılanı, özelleştirme yok)
`accordion`, `avatar`, `checkbox`, `command` (cmdk), `context-menu`, `dialog`, `dropdown-menu`, `hover-card`, `input`, `input-otp`, `label`, `pagination`, `popover`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `table`, `tabs`, `textarea`.

### `sonner.tsx` (Toast)
`next-themes` ile senkron, her toast tipi için lucide ikon (`CircleCheckIcon`, `InfoIcon`, `TriangleAlertIcon`, `OctagonXIcon`, dönen `Loader2Icon`). CSS var override: `--normal-bg: var(--popover)`, `--normal-text: var(--popover-foreground)`, `--normal-border: var(--border)`. Kök layout'ta bir kez `<Toaster />` mount edilir.

### `lib/utils.ts` yardımcıları
- `cn(...)` = `twMerge(clsx(inputs))` — standart shadcn kalıbı, her component'te class birleştirme için kullan.
- `getInitials(name)` — avatar fallback baş harfleri.
- `formatDate(value)` — `Intl.DateTimeFormat("tr-TR", {day:"numeric", month:"long", year:"numeric"})` → "9 Ocak 2026" formatı.
- `LayoutProps` tipi — her `layout.tsx` için `{ children: ReactNode }`.

---

## 5. Tekrarlayan Kompozit Kalıplar

Bu kalıplar tek bir bileşende değil, projede tekrar tekrar aynı şekilde kurulur — yeni projede de bunları **standart desen** olarak uygula:

1. **Kart listesi + filtre çubuğu**: Üstte `Input` (soldan `Search` ikonu) + sıralama `Button` + "Gelişmiş Arama" toggle → altta `AnimatePresence`(framer-motion) ile açılıp kapanan gelişmiş filtre paneli (`Popover`+`Command` çoklu seçim, `Badge` chip listesi + X ile kaldırma). Sonuç listesi `space-y-4` dikey liste ya da `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` responsive grid.
2. **Durum rozetleri**: proje durumu (`recruiting`/`ongoing`/`completed`) → yeşil/mavi/gri soft `outline` Badge; başvuru durumu (`pending`/`accepted`/`rejected`) → `success`/`destructive` Badge. Bu mantık merkezi bir yardımcıda değil, her domain'in kendi `*-status-badge.tsx` dosyasında tutulur.
3. **Boş durum (empty state)** — paylaşılan `EmptyState` bileşeni: kesikli kenarlık (`border-2 border-dashed rounded-xl`), `bg-muted/10`, ortalanmış dairesel ikon rozeti, başlık + açıklama, opsiyonel aksiyon (ör. "Filtreleri Temizle").
4. **İstatistik kutucukları**: `grid grid-cols-2 lg:grid-cols-4 gap-4`, her kutu `bg-linear-to-br from-muted/50` glassmorfik gradyan, köşede `blur-2xl` dekoratif ışık halkası, büyük `text-3xl font-black` sayı + küçük harfli uppercase etiket. Vurgu kutusu `primary` renk şemasına geçer.
5. **Sohbet/mesajlaşma ekranı** (3 ayrı yerde tekrarlanır: `dashboard/chats`, `academician/questions`, `profile/questions`): masaüstünde sabit genişlikte sol panel (`w-64 lg:w-80 xl:w-96`) + esnek sağ panel; mobilde sol panel `Sheet side="left"`'e döner. Kendi mesajın balonu sağa hizalı `bg-primary ... rounded-tr-none`, karşı taraf sola hizalı `bg-muted rounded-tl-none`.
6. **Avatar + kırpma akışı**: dosya seçilir → `react-easy-crop`'un `<Cropper aspect={1} showGrid />` bileşeni dairesel önizlemede açılır → `<input type="range" className="accent-primary">` zoom kontrolü → onayla → kırpılmış blob S3'e presigned URL ile yüklenir.
7. **Form doğrulama**: Proje genelinde **Zod şeması bulunamadı** — tüm formlar native HTML validasyonu (`required`, `type="email"`) + manuel koşullu kontrol (`if (!field.trim())`) + Convex'ten dönen hatanın `toast.error()` ile gösterilmesi şeklinde çalışıyor. (CLAUDE.md Zod kullanımını öngörse de mevcut kod bunu henüz uygulamıyor — yeni projede hangisini örnek alacağını netleştir.)
8. **Dekoratif arkaplan efekti** (landing + about sayfalarında): `fixed inset-0 z-0 pointer-events-none` içinde iki büyük bulanık "glow" top — `w-125 h-125 bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen`, biri `animate-pulse`.
9. **Gradyan başlık metni**: `bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60` (nötr) veya `from-primary to-cyan-400` / `from-primary to-indigo-500` (vurgulu) — sayfa başlıklarında sık kullanılır.
10. **Pill/rozet CTA butonları**: Landing sayfasında `rounded-full`, `shadow-lg shadow-primary/20`, hover'da `-translate-y-0.5` (hafif kalkma) — `Button variant="default"` zaten bunu base olarak taşıyor.

---

## 6. Route Haritası — Sayfa Sayfa İçerik

### Genel (Public)
| Route | İçerik |
|---|---|
| `/` | Landing: `BackgroundEffects` + sabit navbar + `HeroSection` (rozet + `animate-ping` nokta, dev gradyanlı başlık, el çizimi SVG alt çizgi, CTA çifti, istatistik şeridi) + `FeaturesSection` (3 kart, hover'da renk geçişi) + `DashboardPreviewSection` (sahte tarayıcı çerçevesi içinde iskelet/placeholder önizleme) + `CTASection` (gradyan banner) + `Footer`. |
| `/about` | Aynı navbar/arkaplan; "biz kimiz" 2 kolonlu bölüm, 3 kart özellik grid'i, büyük vizyon CTA paneli. Kurumsal Türkçe metin. |

### Auth
| Route | İçerik |
|---|---|
| `/sign-in` | Ortalanmış tek kart (`max-w-sm`, `rounded-2xl shadow-2xl`), 2 adım: email → 6 haneli `InputOTP`. Aynı akış `SignInModal` olarak `Dialog` içinde de mevcut (landing navbar'dan tetiklenir). |
| `/sign-up` | Daha geniş kart (`max-w-4xl`), üstte ince animasyonlu ilerleme çubuğu, 3 adım: Temel Bilgiler → OTP → CV Builder (framer-motion `AnimatePresence` ile adım geçişleri). CV Builder'da: avatar yükleme, bölüm seçimi (`Popover`+`Command`), yetenek/gelişim alanı tag input'ları, özel switch, `Reorder.Group` ile sürükle-bırak deneyim listesi. |

### Dashboard (öğrenci) — `grid-rows-[5rem_1fr]` shell
| Route | İçerik |
|---|---|
| `/dashboard` | Tüm projeleri keşfet: arama + sıralama + gelişmiş filtre paneli, dikey `Card` listesi (`space-y-4`), sol kenarlıkla vurgulu (`border-l-4`) proje kartları, "Daha Fazla Göster" ile sayfalama, `?projectId=` ile detay `Dialog`. |
| `/dashboard/my-projects` | Sahip olunan/katılınan projeler; "+" ile `CreateProjectDialog` (çok alanlı form, tekrarlanabilir pozisyon bloğu builder'ı). |
| `/dashboard/my-projects/[projectId]/applications` | Proje sahibinin başvuruları incelemesi: `Skeleton` yükleme, başvuran kartı (avatar, yetenek rozetleri, onayla/reddet/mesaj aksiyonları, `toast.promise`). |
| `/dashboard/profiles` | Öğrenci yetenek dizini ("Yıldızlar Karması"): gradyan başlık, responsive grid, isim/bölüm/yetenek filtreleri, müsaitlik göstergeli avatar (yeşil nokta). |
| `/dashboard/chats` | Bireysel/Grup sekmeli mesajlaşma, `?chatId=` URL durumu, sağ tık `ContextMenu` ile mesaj detayı. |
| `/dashboard/academy` | Planlanan/Tamamlanan sekmeleri, webinar kartları (canlı rozeti `animate-pulse`, marquee kayan başlık, katılımcı avatar yığını + `HoverCard` taşma). |
| `/dashboard/academics` | Akademisyen/danışman dizini: isim + bölüm filtresi, kart içinde yayın/mentörlük istatistik mini-grid'i, iletişim/detay diyalogları. |

### Academician (akademisyen) — aynı shell, `h-20` navbar
| Route | İçerik |
|---|---|
| `/academician` | Danışman aranan öğrenci projeleri, kart grid'i, "Danışman Ol" → not `Textarea`'lı `Dialog`. |
| `/academician/my-projects` | Dashboard'daki `ProjectsView`'ın `isAdvisor=true` ile yeniden kullanımı. |
| `/academician/badges` | Öğrenci ara (framer-motion açılır sonuç paneli, Popover değil özel autocomplete) → rozet başlık/açıklama formu → verilen rozetler `Badge` listesi. |
| `/academician/questions` | Öğrencilerle posta kutusu tarzı mesajlaşma (Gelen/Giden `Tabs`), asimetrik balon renkleri, ek dosya/fotoğraf yükleme diyalogları. |

### Admin — daha sade shell, `h-16` navbar, nav linki yok
| Route | İçerik |
|---|---|
| `/admin` | Dashboard modülünün `ReportsView`'ını yeniden kullanır: öğrenci gelişim alanları raporu, 4'lü istatistik kutucuğu, Excel dışa aktarma, üniversite→bölüm `Accordion` içinde `Table`, yüzde çubukları düz `bg-secondary`/`bg-primary` ile elle çizilir (chart kütüphanesi yok). |

### Profile
| Route | İçerik |
|---|---|
| `/profile` | 12 kolon grid: sticky 4 kolon `ProfileSidebar` (avatar, iletişim linkleri, yetenek rozetleri) + 8 kolon `Tabs` içerik (Genel Bakış / Projelerim / Deneyim). Genel Bakış'ta satır içi düzenleme modu (Textarea/Input ↔ statik metin, Check/X onay). |
| `/profile/questions` | Aynı posta kutusu deseni, akademisyen tarafının öğrenci karşılığı. |

---

## 7. Animasyon Kütüphanesi Kullanımı

- **framer-motion**: yalnızca form sihirbazı adım geçişlerinde, tag input chip giriş/çıkışında, deneyim listesi sürükle-bırak (`Reorder.Group`/`Reorder.Item`) ve gelişmiş filtre panelinin yükseklik animasyonunda kullanılır. Layout kabuklarında **kullanılmaz**.
- **tw-animate-css** (`animate-in fade-in zoom-in duration-500`): landing hero rozetinde, dialog/dropdown açılışlarında (Radix'in kendi data-state geçişleriyle uyumlu).
- **Custom keyframes**: `animate-marquee` (kayan metin, sadece academy event kartı başlığında), `animate-accordion-down/up` (Radix accordion).
- Genel geçiş süresi standardı: `transition-all duration-300`.

---

## 8. Yeni Projede Uygulama Kontrol Listesi

1. `globals.css`'i §2'deki gibi kur — tüm renkleri OKLCH CSS custom property + `@theme inline` üzerinden semantik class'lara bağla. Marka rengini `--primary` üzerinden değiştir, gerisini oranlı kaydır.
2. shadcn CLI ile `style: new-york, baseColor: neutral` seçerek primitive'leri kur, sonra `button.tsx` ve `badge.tsx`'e proje-özel varyantları (`nav`, `turquoise`, `orange`, `indigo`, `turquiseLight`) ekle.
3. Her ana bölüm için `grid-rows-[5rem_1fr]` (veya ihtiyaca göre `4rem`) header+`ScrollArea` kabuğunu kur; nav linklerini `Button variant="nav" data-active` deseniyle yaz.
4. Ortak `SynapseLogo` benzeri marka bileşenini ve `AuthButton` benzeri kullanıcı menüsünü tek bir yerde tanımlayıp tüm header'larda paylaş.
5. Liste sayfaları için filtre-çubuğu + gelişmiş-filtre-paneli + kart-listesi/grid üçlüsünü standart kalıp olarak tekrarla (§5.1).
6. Mesajlaşma ekranları için sabit-genişlik-sidebar + esnek-alan + mobilde `Sheet` deseni kullan (§5.5).
7. Boş durumlar, istatistik kutucukları ve durum rozetleri için §5.2–5.4'teki paylaşılan bileşen kalıplarını kur.
8. Dekoratif arkaplan (blur glow) ve gradyan başlık metnini yalnızca pazarlama/landing yüzeylerinde kullan; uygulama içi (dashboard vb.) sayfalarda düz semantik renkleri tercih et.
