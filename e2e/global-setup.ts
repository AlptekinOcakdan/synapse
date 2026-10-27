import { chromium, FullConfig } from "@playwright/test";
import { SignJWT } from "jose";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const AUTH_FILE = "e2e/.auth/user.json";

async function globalSetup(_config: FullConfig) {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET .env.local dosyasında bulunamadı.");

    // Auth dizinini oluştur
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

    const key = new TextEncoder().encode(secret);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const token = await new SignJWT({
        userId: "test_overflow_user",
        role: "student",
        expiresAt: expiresAt.toISOString(),
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);

    const browser = await chromium.launch();
    const context = await browser.newContext({ baseURL: "http://localhost:3000" });
    const page = await context.newPage();

    await page.goto("/");
    await context.addCookies([
        {
            name: "session",
            value: token,
            domain: "localhost",
            path: "/",
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            expires: Math.floor(expiresAt.getTime() / 1000),
        },
    ]);

    await context.storageState({ path: AUTH_FILE });
    await browser.close();
}

export default globalSetup;
