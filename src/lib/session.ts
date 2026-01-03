import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(SECRET_KEY);

if (!SECRET_KEY) {
    throw new Error("Lütfen .env dosyasına SESSION_SECRET ekleyin.");
}

type SessionPayload = {
    userId: string;
    role: string;
    expiresAt: Date;
};

// 1. Session Şifrele (Encrypt)
export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // 7 gün geçerli
        .sign(key);
}

// 2. Session Çöz (Decrypt)
// 2. Session Çöz (Decrypt)
export async function decrypt(session: string | undefined = "") {
    // EKLEME: Eğer session boşsa veya yoksa direkt null dön, jwtVerify'ı yorma.
    if (!session) return null;

    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        // Hata logunu sadece geliştirme ortamında görmek istersen:
        console.error("Session decrypt error:", error);
        return null;
    }
}

// 3. Session Oluştur (Cookie'ye Yaz)
export async function createSession(userId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Gün
    const session = await encrypt({ userId, role, expiresAt });

    // DEĞİŞİKLİK BURADA: cookies() artık bir promise, await ekledik
    const cookieStore = await cookies();

    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

// 4. Session Sil (Çıkış Yap)
export async function deleteSession() {
    // DEĞİŞİKLİK BURADA: await cookies()
    (await cookies()).delete("session");
}

// 5. Session Kontrolü (Server Componentlerde Kullanım İçin)
export async function getSession() {
    // DEĞİŞİKLİK BURADA: await cookies()
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    const payload = await decrypt(session);

    if (!payload || !payload.expiresAt) return null;

    // Süre dolmuşsa null dön
    if (new Date(payload.expiresAt as string) < new Date()) {
        return null;
    }

    return payload as SessionPayload;
}