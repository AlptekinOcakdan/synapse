import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix"; // YENİ: Svix paketini import ettik

const http = httpRouter();

http.route({
    path: "/incoming-email",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        // 1. Gelen İsteğin Ham Metnini Al (Doğrulama için JSON parse edilmeden önceki hali lazım)
        const payloadString = await request.text();

        // 2. Header'ları Al
        const headerPayload = request.headers;
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        // 3. Secret'ı Kontrol Et
        const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
            console.error("Webhook Secret tanımlanmamış!");
            return new Response("Server Configuration Error", { status: 500 });
        }

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response("Error: Missing svix headers", { status: 400 });
        }

        // 4. Doğrulama (Verify) İşlemi
        let body: Record<string, unknown>;
        try {
            const wh = new Webhook(WEBHOOK_SECRET);
            // Eğer imza tutmazsa burası hata fırlatır ve catch bloğuna düşeriz
            body = wh.verify(payloadString, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as Record<string, unknown>;
        } catch (err) {
            console.error("Webhook imzası doğrulanamadı (Fake Request):", err);
            return new Response("Error: Invalid signature", { status: 400 });
        }

        // --- BURADAN SONRASI GÜVENLİ BÖLGE ---

        // Resend Payload yapısına göre verileri çek
        // Not: body değişkeni artık güvenli JSON objesidir.
        const toAddress = ((body.to as string[]) ?? [])[0] || (body.recipient as string);
        const fromAddress = body.from as string;
        const subject = body.subject as string;
        const textContent = (body.text || body.html) as string;

        // 5. Thread ID Ayıklama
        const match = toAddress?.match(/reply\+(.*?)@/);

        if (!match || !match[1]) {
            console.error("Thread ID bulunamadı:", toAddress);
            // Resend'e hata dönmemek için 200 dönüyoruz ama işlemi yapmıyoruz (Loop olmasın diye)
            return new Response("Thread ID missing", { status: 200 });
        }

        const threadId = match[1];

        // 6. Kaydetme İşlemi
        try {
            await ctx.runMutation(internal.messages.saveIncomingEmailMessage, {
                threadId: threadId,
                senderEmail: fromAddress,
                content: textContent,
            });

            return new Response("OK", { status: 200 });
        } catch (error) {
            console.error("Mesaj kaydedilemedi:", error);
            return new Response("Internal Error", { status: 500 });
        }
    }),
});

export default http;