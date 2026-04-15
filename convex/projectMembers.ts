import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateMemberRole = mutation({
    args: {
        projectId: v.id("projects"),
        memberId: v.id("users"),
        newRole: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.db.get(args.userId);

        if (!identity) {
            throw new Error("Kimlik doğrulama hatası.");
        }

        const project = await ctx.db.get(args.projectId);
        if (!project) {
            throw new Error("Proje bulunamadı.");
        }

        const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", identity.email!)).unique();
        if (!user || project.ownerId !== user._id) {
            throw new Error("Yetkilendirme hatası: Sadece proje sahibi rol değiştirebilir.");
        }

        const member = await ctx.db
            .query("projectMembers")
            .withIndex("by_project_user", q => q.eq("projectId", args.projectId).eq("userId", args.memberId))
            .unique();

        if (!member) {
            throw new Error("Üye bulunamadı.");
        }

        await ctx.db.patch(member._id, { role: args.newRole });
        return { success: true };
    },
});

export const removeMember = mutation({
    args: {
        projectId: v.id("projects"),
        memberId: v.id("users"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.db.get(args.userId);

        if (!identity) {
            throw new Error("Kimlik doğrulama hatası.");
        }

        const project = await ctx.db.get(args.projectId);
        if (!project) {
            throw new Error("Proje bulunamadı.");
        }

        const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", identity.email!)).unique();
        if (!user || (project.ownerId !== user._id && args.memberId !== user._id)) {
            throw new Error("Yetkilendirme hatası: Bu işlem için yetkiniz yok.");
        }

        if (project.ownerId === args.memberId) {
            throw new Error("Proje sahibi projeden ayrılamaz.");
        }

        const member = await ctx.db
            .query("projectMembers")
            .withIndex("by_project_user", q => q.eq("projectId", args.projectId).eq("userId", args.memberId))
            .unique();

        if (!member) {
            throw new Error("Üye bulunamadı.");
        }

        await ctx.db.delete(member._id);
        return { success: true };
    },
});

// 1. Approve Application
export const approveApplication = mutation({
    args: {
        applicationId: v.id("applications"),
    },
    handler: async (ctx, args) => {
        const application = await ctx.db.get(args.applicationId);
        if (!application) throw new Error("Başvuru bulunamadı.");
        if (application.status !== "pending") throw new Error("Bu başvuru zaten işleme alınmış.");

        const project = await ctx.db.get(application.projectId);
        if (!project) throw new Error("Proje bulunamadı.");

        const members = await ctx.db
            .query("projectMembers")
            .withIndex("by_project", (q) => q.eq("projectId", project._id))
            .collect();

        if (members.length >= project.participantsNeeded) {
            throw new Error("Proje zaten dolu.");
        }

        // 1. Update application status (schema: pending | accepted | rejected)
        await ctx.db.patch(application._id, { status: "accepted" });

        // 2. Add user to projectMembers
        await ctx.db.insert("projectMembers", {
            projectId: application.projectId,
            userId: application.userId,
            role: "member",
            joinedAt: new Date().toISOString(),
        });

        // 3. Create notification for the applicant
        await ctx.db.insert("notifications", {
            userId: application.userId,
            type: "application_approved",
            title: "Başvurun Onaylandı!",
            message: `Tebrikler! "${project.title}" projesine başvurunuz kabul edildi.`,
            relatedLink: `/dashboard/my-projects`,
            isRead: false,
            createdAt: new Date().toISOString(),
        });
    },
});
