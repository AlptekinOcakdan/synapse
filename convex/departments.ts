import { query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const departments = await ctx.db.query("departments").collect();
    return departments
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(d => ({ value: d._id, label: d.label }));
  },
});
