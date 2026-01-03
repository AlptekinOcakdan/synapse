import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/incoming-mail-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        // 1. Provider'dan gelen JSON'u oku (Örn: Resend/SendGrid formatı)
        const body = await request.json();

        // 2. Mail içeriğini ve Konuyu ayrıştır
        const subject = body.subject; // "Re: Proje Başvurusu [Ref: thread_123]"
        const from = body.from;
        const content = body.text;

        // 3. Thread ID'yi bul (Regex ile)
        const threadIdMatch = subject.match(/Ref:\s*(\w+)/);

        if (threadIdMatch) {
            const threadId = threadIdMatch[1];

            // 4. Mesajı veritabanına kaydet (Internal Mutation çağır)
            await ctx.runMutation(internal.chat.saveIncomingMessage, {
                threadId: threadId,
                senderEmail: from,
                content: content
            });
        }

        return new Response(null, { status: 200 });
    }),
});

export default http;