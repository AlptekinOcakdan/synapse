import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateMemberRole = mutation({
    args: {
        projectId: v.id("projects"),
        memberId: v.id("users"),
        newRole: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Yetkilendirme hatası: Giriş yapmalısınız.");
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
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Yetkilendirme hatası: Giriş yapmalısınız.");
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

