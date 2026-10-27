import { test, expect, Page } from "@playwright/test";

// ─── Yardımcı Fonksiyonlar ──────────────────────────────────────────────────

/** Sayfada yatay kaydırma (horizontal scroll) olup olmadığını kontrol eder. */
async function hasHorizontalScroll(page: Page): Promise<boolean> {
    return page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
}

/**
 * Sayfadaki tüm Radix ScrollArea viewport'larında yatay taşma var mı kontrol eder.
 */
async function getScrollAreaOverflows(
    page: Page
): Promise<{ index: number; scrollWidth: number; clientWidth: number }[]> {
    return page.evaluate(() => {
        const viewports = Array.from(
            document.querySelectorAll("[data-radix-scroll-area-viewport]")
        );
        return viewports
            .map((el, i) => ({
                index: i,
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
            }))
            .filter((item) => item.scrollWidth > item.clientWidth);
    });
}

/** Sayfa yüklenip ağ aktivitesi duruncaya kadar bekler. */
async function waitForPageReady(page: Page, timeout = 10000) {
    await page.waitForLoadState("networkidle", { timeout }).catch(() => {});
}

// ─── Public Sayfalar ────────────────────────────────────────────────────────

test.describe("Public Sayfalar — Yatay Taşma Kontrolü", () => {
    const publicRoutes = [
        { name: "Ana Sayfa", path: "/" },
        { name: "Hakkında", path: "/about" },
        { name: "Giriş Yap", path: "/sign-in" },
        { name: "Kayıt Ol", path: "/sign-up" },
    ];

    for (const route of publicRoutes) {
        test(`${route.name} (${route.path}) — yatay kaydırma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            expect(
                await hasHorizontalScroll(page),
                `${route.name}: yatay kaydırma tespit edildi`
            ).toBe(false);
        });

        test(`${route.name} (${route.path}) — ScrollArea yatay taşma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            const overflows = await getScrollAreaOverflows(page);
            expect(
                overflows,
                `${route.name}: ${overflows.length} ScrollArea yatay taşıyor — ${JSON.stringify(overflows)}`
            ).toHaveLength(0);
        });
    }
});

// ─── Authenticated Sayfalar ─────────────────────────────────────────────────

test.describe("Dashboard Sayfaları — Yatay Taşma Kontrolü", () => {
    const dashboardRoutes = [
        { name: "Dashboard Ana", path: "/dashboard" },
        { name: "Dashboard Profiller", path: "/dashboard/profiles" },
        { name: "Dashboard Akademisyenler", path: "/dashboard/academics" },
        { name: "Dashboard Academy", path: "/dashboard/academy" },
        { name: "Dashboard Projelerim", path: "/dashboard/my-projects" },
        { name: "Dashboard Sohbetler", path: "/dashboard/chats" },
    ];

    for (const route of dashboardRoutes) {
        test(`${route.name} — yatay kaydırma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            expect(
                await hasHorizontalScroll(page),
                `${route.name} (${page.url()}): yatay kaydırma tespit edildi`
            ).toBe(false);
        });

        test(`${route.name} — ScrollArea yatay taşma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            const overflows = await getScrollAreaOverflows(page);
            expect(
                overflows,
                `${route.name}: ${overflows.length} ScrollArea yatay taşıyor — ${JSON.stringify(overflows)}`
            ).toHaveLength(0);
        });
    }
});

test.describe("Profil Sayfaları — Yatay Taşma Kontrolü", () => {
    const profileRoutes = [
        { name: "Profil", path: "/profile" },
        { name: "Profil Sorular", path: "/profile/questions" },
    ];

    for (const route of profileRoutes) {
        test(`${route.name} — yatay kaydırma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            expect(
                await hasHorizontalScroll(page),
                `${route.name}: yatay kaydırma tespit edildi`
            ).toBe(false);
        });

        test(`${route.name} — ScrollArea yatay taşma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            const overflows = await getScrollAreaOverflows(page);
            expect(
                overflows,
                `${route.name}: ${overflows.length} ScrollArea yatay taşıyor`
            ).toHaveLength(0);
        });
    }
});

test.describe("Akademisyen Sayfaları — Yatay Taşma Kontrolü", () => {
    const academicianRoutes = [
        { name: "Akademisyen Paneli", path: "/academician" },
        { name: "Akademisyen Sorular", path: "/academician/questions" },
        { name: "Akademisyen Projeleri", path: "/academician/my-projects" },
        { name: "Akademisyen Rozetler", path: "/academician/badges" },
    ];

    for (const route of academicianRoutes) {
        test(`${route.name} — yatay kaydırma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            expect(
                await hasHorizontalScroll(page),
                `${route.name}: yatay kaydırma tespit edildi`
            ).toBe(false);
        });

        test(`${route.name} — ScrollArea yatay taşma yok`, async ({ page }) => {
            await page.goto(route.path);
            await waitForPageReady(page);

            const overflows = await getScrollAreaOverflows(page);
            expect(
                overflows,
                `${route.name}: ${overflows.length} ScrollArea yatay taşıyor`
            ).toHaveLength(0);
        });
    }
});
