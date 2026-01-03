// convex/academics.ts
// ("use node" BURADA OLMAMALI)

import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

// --- INTERNAL QUERIES ---
// Bu sorgular veritabanına eriştiği için Default Runtime'da çalışmalıdır.

// 1. Akademisyenin E-postasını ID ile bul
export const getAcademicianPrivateInfo = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// 2. Proje İsmini ID ile bul
export const getProjectPublicInfo = internalQuery({
    args: { projectId: v.optional(v.id("projects")) },
    handler: async (ctx, args) => {
        if (!args.projectId) return null;
        return await ctx.db.get(args.projectId);
    },
});