import { v } from "convex/values";
import {query, mutation, internalMutation} from "./_generated/server";
import {internal} from "@/convex/_generated/api";

// --- QUERIES ---

export const getMailThreads = query({
    // Custom Auth kullandığın için userId'yi parametre alıyoruz
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // 1. Kullanıcının dahil olduğu (Gönderen veya Alan) tüm threadleri çek
        const threads = await ctx.db
            .query("mailThreads")
            .filter((q) =>
                q.or(
                    q.eq(q.field("initiatorId"), args.userId),
                    q.eq(q.field("recipientId"), args.userId)
                )
            )
            .collect();

        // 2. Detayları doldur (Join İşlemleri)
        const threadsWithDetails = await Promise.all(
            threads.map(async (thread) => {
                // Karşı tarafı belirle
                const otherUserId = thread.initiatorId === args.userId
                    ? thread.recipientId
                    : thread.initiatorId;

                const otherUser = await ctx.db.get(otherUserId);

                // İlgili proje varsa ismini çek
                let projectName = undefined;
                if (thread.relatedProjectId) {
                    const project = await ctx.db.get(thread.relatedProjectId);
                    if (project) projectName = project.title;
                }

                // Son mesajı çek (Önizleme için)
                const lastMessage = await ctx.db
                    .query("mailMessages")
                    .withIndex("by_thread", (q) => q.eq("threadId", thread._id))
                    .order("desc") // En son atılanı al
                    .first();

                // Okunmamış kontrolü: Son mesajı ben atmadıysam ve okunmadıysa
                const isUnread = lastMessage
                    ? (lastMessage.senderId !== args.userId && !lastMessage.isRead)
                    : false;

                // Silinmiş kullanıcı kontrolü
                const academicianName = otherUser
                    ? `${otherUser.firstName} ${otherUser.lastName}`
                    : "Silinmiş Kullanıcı";

                return {
                    id: thread._id,
                    // Frontend'deki 'academician' yapısına uyacak şekilde paketliyoruz
                    academician: {
                        id: otherUserId,
                        name: academicianName,
                        title: otherUser?.title || "",
                        avatar: otherUser?.avatar || "",
                        department: otherUser?.department || "",
                    },
                    subject: thread.subject,
                    relatedProject: projectName,
                    relatedProjectId: thread.relatedProjectId, // EKLENDİ
                    lastMessageDate: new Date(thread.lastMessageDate).toLocaleDateString("tr-TR"),
                    isUnread: isUnread,
                    // Frontend 'messages' dizisi bekliyor, önizleme için son mesajı koyuyoruz
                    messages: lastMessage ? [{
                        id: lastMessage._id,
                        senderId: String(lastMessage.senderId),
                        content: lastMessage.content,
                        timestamp: lastMessage.timestamp,
                        isRead: lastMessage.isRead
                    }] : []
                };
            })
        );

        // Tarihe göre sırala (Yeniden eskiye)
        return threadsWithDetails.sort((a, b) =>
            // lastMessageDate string olduğu için Date objesine çevirip karşılaştırıyoruz
            // Not: Şemada lastMessageDate ISO String olduğu varsayılmıştır.
            new Date(b.messages[0]?.timestamp || 0).getTime() - new Date(a.messages[0]?.timestamp || 0).getTime()
        );
    },
});

export const getMessages = query({
    args: { threadId: v.id("mailThreads") },
    handler: async (ctx, args) => {
        const msgs = await ctx.db
            .query("mailMessages")
            .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
            .collect();

        // Eskiden yeniye sıralama (UI'da yukarıdan aşağı akış için)
        // Eğer timestamp ISO string ise string karşılaştırması genelde çalışır ama
        // güvenli olmak için Date'e çevirip sort edebiliriz.
        msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return msgs.map((m) => ({
            id: m._id,
            senderId: String(m.senderId),
            content: m.content,
            timestamp: m.timestamp,
            isRead: m.isRead,
        }));
    },
});

export const sendMessage = mutation({
    args: {
        threadId: v.id("mailThreads"),
        senderId: v.id("users"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // 1. Thread kontrolü (Alıcıyı bulmak için gerekli)
        const thread = await ctx.db.get(args.threadId);
        if (!thread) throw new Error("Thread bulunamadı");

        // 2. Mesajı DB'ye Kaydet
        await ctx.db.insert("mailMessages", {
            threadId: args.threadId,
            senderId: args.senderId,
            content: args.content,
            isRead: false,
            timestamp: now,
        });

        // 3. Thread'i Güncelle
        await ctx.db.patch(args.threadId, {
            lastMessageDate: now,
            status: "active"
        });

        // --- ENTEGRASYON KISMI ---

        // Alıcı kim? (Eğer gönderen Initiator ise alıcı Recipient'tir, tersi de geçerli)
        const recipientId = thread.initiatorId === args.senderId
            ? thread.recipientId
            : thread.initiatorId;

        const recipientUser = await ctx.db.get(recipientId);

        // Eğer alıcı varsa ve e-postası kayıtlıysa bildirim gönder
        if (recipientUser && recipientUser.email) {

            const emailHtml = `
                <h3>Yeni Mesajınız Var</h3>
                <p>Synapse platformunda yeni bir mesaj aldınız.</p>
                <div style="background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
                    <p><strong>Mesaj:</strong> ${args.content.substring(0, 50)}${args.content.length > 50 ? '...' : ''}</p>
                </div>
                <br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages">Mesajı Görüntüle</a>
            `;

            // DİKKAT: Mutation içinden Action çağırmak için `ctx.scheduler` kullanılır.
            // Bu işlem asenkron olur ve mutation hızını yavaşlatmaz.
            await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
                to: recipientUser.email,
                subject: "Synapse - Yeni Mesaj",
                html: emailHtml,
                threadId: args.threadId
            });
        }
    },
});

export const createThreadAndSendMessage = mutation({
    args: {
        initiatorId: v.id("users"), // Gönderen
        recipientId: v.id("users"), // Kime (Akademisyen vb.)
        subject: v.string(),
        content: v.string(),
        relatedProjectId: v.optional(v.id("projects"))
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // 1. Yeni Thread Oluştur
        const threadId = await ctx.db.insert("mailThreads", {
            initiatorId: args.initiatorId,
            recipientId: args.recipientId,
            subject: args.subject,
            relatedProjectId: args.relatedProjectId,
            lastMessageDate: now,
            status: "active"
        });

        // 2. Mesajı Kaydet
        await ctx.db.insert("mailMessages", {
            threadId: threadId,
            senderId: args.initiatorId,
            content: args.content,
            isRead: false,
            timestamp: now,
        });

        // 3. Bildirim Maili Gönder (Scheduler ile)
        const recipient = await ctx.db.get(args.recipientId);
        const sender = await ctx.db.get(args.initiatorId);

        if (recipient?.email) {
            await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
                to: recipient.email,
                subject: `[Synapse] Yeni Konu: ${args.subject}`,
                html: `<p>Sayın ${recipient.lastName},</p>
                       <p>${sender?.firstName} size yeni bir konu hakkında yazdı:</p>
                       <blockquote>${args.content}</blockquote>`
            });
        }

        return threadId;
    }
});

export const saveIncomingEmailMessage = internalMutation({
    args: {
        threadId: v.string(), // String gelir, ID'ye çevireceğiz
        senderEmail: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Thread ID geçerli mi kontrol et
        // Gelen string ID'yi Convex ID'sine çeviriyoruz
        const validThreadId = ctx.db.normalizeId("mailThreads", args.threadId);

        if (!validThreadId) {
            throw new Error("Geçersiz Thread ID");
        }

        const thread = await ctx.db.get(validThreadId);
        if (!thread) throw new Error("Thread bulunamadı");

        // 2. Gönderen kim? (Email'den bulmaya çalışıyoruz)
        // Maili atan kişinin sistemdeki user ID'sini bulalım
        // Genellikle "Ad Soyad <email@domain.com>" formatında gelebilir, parse etmek gerekebilir.
        // Basitçe email içinde arama yapalım:
        const senderUser = await ctx.db
            .query("users")
            .filter(q => q.eq(q.field("email"), args.senderEmail)) // Tam eşleşme varsayıyoruz
            .first();

        // Eğer kullanıcı sistemde yoksa ne yapacağız?
        // Şimdilik sadece mesajı kaydedelim, senderId null olamazsa bir "System" kullanıcısı veya thread sahibi atanabilir.
        // Burada senderUser varsa onun ID'sini, yoksa thread.recipientId'yi (tahmini) kullanıyoruz.
        const senderId = senderUser ? senderUser._id : thread.recipientId;

        // 3. Mesajı Kaydet
        await ctx.db.insert("mailMessages", {
            threadId: validThreadId,
            senderId: senderId,
            content: args.content, // Mail içeriği (HTML temizlenmiş olmalı)
            isRead: false,
            timestamp: new Date().toISOString(),
        });

        // 4. Thread'i Güncelle
        await ctx.db.patch(validThreadId, {
            lastMessageDate: new Date().toISOString(),
            status: "active"
        });
    }
});