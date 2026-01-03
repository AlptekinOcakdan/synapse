import { query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    // Departmanları veritabanından çek ve etiketine göre sırala
    const departments = await ctx.db.query("departments").collect();
    return departments.sort((a, b) => a.label.localeCompare(b.label));
  },
});

