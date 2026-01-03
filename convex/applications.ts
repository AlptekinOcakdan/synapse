import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const applyToProject = mutation({
    args: {
        projectId: v.id("projects"),
        motivation: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Kullanıcı Giriş Kontrolü
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Başvuru yapmak için giriş yapmalısınız.");
        }

        // Kullanıcıyı veritabanında bul (Email üzerinden)
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) throw new Error("Kullanıcı profili bulunamadı.");

        // 2. Mükerrer Başvuru Kontrolü
        const existingApplication = await ctx.db
            .query("applications")
            .withIndex("by_project_user", (q) =>
                q.eq("projectId", args.projectId).eq("userId", user._id)
            )
            .first();

        if (existingApplication) {
            throw new Error("Bu projeye zaten başvurdunuz.");
        }

        // 3. Başvuruyu Kaydet
        await ctx.db.insert("applications", {
            projectId: args.projectId,
            userId: user._id,
            motivation: args.motivation,
            status: "pending",
            appliedAt: new Date().toISOString(),
        });

        const project = await ctx.db.get(args.projectId);

        // Eğer proje silinmişse bildirim atamayız, güvenli çıkış.
        if (project) {
            await ctx.db.insert("notifications", {
                userId: project.ownerId, // Hata düzeldi: Direkt proje sahibinin ID'si
                type: "application_received",
                title: "Yeni Başvuru",
                // Proje adını da mesaja eklemek kullanıcı deneyimi için daha iyidir
                message: `${user.firstName} ${user.lastName}, "${project.title}" projenize başvurdu.`,
                relatedLink: `/dashboard?projectId=${args.projectId}`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        }

        return { success: true };
    },
});