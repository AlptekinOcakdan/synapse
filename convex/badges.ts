import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const awardBadge = mutation({
    args: {
        issuerId: v.id("users"),
        recipientId: v.id("users"),
        title: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const issuer = await ctx.db.get(args.issuerId);
        if (!issuer || issuer.role !== "academician") {
            throw new Error("Yalnızca akademisyenler rozet verebilir.");
        }

        const recipient = await ctx.db.get(args.recipientId);
        if (!recipient) {
            throw new Error("Öğrenci bulunamadı.");
        }

        await ctx.db.insert("badges", {
            issuerId: args.issuerId,
            recipientId: args.recipientId,
            title: args.title,
            description: args.description,
            issuedAt: new Date().toISOString(),
        });

        await ctx.db.insert("notifications", {
            userId: args.recipientId,
            type: "badge_awarded",
            title: "Yeni Rozet Kazandınız!",
            message: `${issuer.title} ${issuer.firstName} ${issuer.lastName} size "${args.title}" rozetini verdi.`,
            relatedLink: "/profile",
            isRead: false,
            createdAt: new Date().toISOString(),
        });

        return { success: true };
    },
});

export const getBadgesForUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const badges = await ctx.db
            .query("badges")
            .withIndex("by_recipient", (q) => q.eq("recipientId", args.userId))
            .order("desc")
            .collect();

        return await Promise.all(
            badges.map(async (badge) => {
                const issuer = await ctx.db.get(badge.issuerId);
                return {
                    _id: badge._id,
                    title: badge.title,
                    description: badge.description,
                    issuedAt: badge.issuedAt,
                    issuer: issuer
                        ? {
                              name: `${issuer.firstName} ${issuer.lastName}`,
                              title: issuer.title || "",
                              avatar: issuer.avatar || "",
                          }
                        : { name: "Bilinmeyen Akademisyen", title: "", avatar: "" },
                };
            })
        );
    },
});

export const searchStudents = query({
    args: { searchQuery: v.string() },
    handler: async (ctx, args) => {
        const query = args.searchQuery.trim().toLowerCase();

        const allStudents = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "student"))
            .collect();

        const filtered = query
            ? allStudents.filter((u) => {
                  const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
                  return fullName.includes(query) || u.email.toLowerCase().includes(query);
              })
            : allStudents;

        return filtered.slice(0, 8).map((u) => ({
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            avatar: u.avatar || "",
            department: u.department || "",
            title: u.title || "",
        }));
    },
});
