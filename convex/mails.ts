import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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
        senderId: v.id("users"), // Custom auth olduğu için ID'yi client gönderiyor
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // 1. Mesajı Kaydet
        await ctx.db.insert("mailMessages", {
            threadId: args.threadId,
            senderId: args.senderId,
            content: args.content,
            isRead: false,
            timestamp: now,
        });

        // 2. Thread'i Güncelle (Son mesaj tarihi)
        await ctx.db.patch(args.threadId, {
            lastMessageDate: now,
            status: "active" // Eğer arşivdeyse tekrar aktif et
        });
    },
});