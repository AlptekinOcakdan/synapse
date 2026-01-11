import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const applyToProject = mutation({
    args: {
        projectId: v.id("projects"),
        motivation: v.string(),
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        // Kullanıcıyı veritabanında bul (Email üzerinden)
        const user = await ctx.db.get(args.userId);

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

// 1. Get Applications for a Project
export const getApplicationsForProject = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, args) => {
        const applications = await ctx.db
            .query("applications")
            .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
            .collect();

        const withUsers = await Promise.all(
            applications.map(async (app) => {
                const user = await ctx.db.get(app.userId);
                if (!user) return null;
                return {
                    ...app,
                    user,
                };
            })
        );

        return withUsers.filter((x): x is NonNullable<typeof x> => x !== null);
    },
});

// 2. Reject Application
export const rejectApplication = mutation({
    args: {
        applicationId: v.id("applications"),
    },
    handler: async (ctx, args) => {
        // TODO: Add auth check to ensure only project owner can reject
        await ctx.db.patch(args.applicationId, { status: "rejected" });
    },
});
