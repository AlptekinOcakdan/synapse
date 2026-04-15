import { query } from "./_generated/server";

export const getImprovementReport = query({
    handler: async (ctx) => {
        const students = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "student"))
            .collect();

        // Yalnızca en az bir gelişim alanı olan öğrenciler dahil
        const relevant = students.filter(
            (u) => u.improvementAreas && u.improvementAreas.length > 0
        );

        // (üniversite, bölüm) çiftlerine göre grupla
        const groupMap = new Map<
            string,
            {
                university: string;
                department: string;
                studentCount: number;
                areaCounts: Map<string, number>;
            }
        >();

        for (const user of relevant) {
            const university = (user.university || "").trim() || "Belirtilmemiş";
            const department = (user.department || "").trim() || "Belirtilmemiş";
            const key = `${university}|||${department}`;

            if (!groupMap.has(key)) {
                groupMap.set(key, {
                    university,
                    department,
                    studentCount: 0,
                    areaCounts: new Map(),
                });
            }

            const group = groupMap.get(key)!;
            group.studentCount++;

            for (const area of user.improvementAreas!) {
                const trimmed = area.trim();
                if (!trimmed) continue;
                group.areaCounts.set(trimmed, (group.areaCounts.get(trimmed) ?? 0) + 1);
            }
        }

        const result = Array.from(groupMap.values())
            .map((g) => ({
                university: g.university,
                department: g.department,
                studentCount: g.studentCount,
                areas: Array.from(g.areaCounts.entries())
                    .map(([area, count]) => ({ area, count }))
                    .sort((a, b) => b.count - a.count),
            }))
            .sort(
                (a, b) =>
                    a.university.localeCompare(b.university, "tr") ||
                    a.department.localeCompare(b.department, "tr")
            );

        // Özet istatistikler
        const totalStudents = relevant.length;
        const totalEntries = result.reduce((s, g) => s + g.areas.reduce((n, a) => n + a.count, 0), 0);

        const globalAreaCounts = new Map<string, number>();
        for (const g of result) {
            for (const { area, count } of g.areas) {
                globalAreaCounts.set(area, (globalAreaCounts.get(area) ?? 0) + count);
            }
        }

        const topAreas = Array.from(globalAreaCounts.entries())
            .map(([area, count]) => ({ area, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return { groups: result, totalStudents, totalEntries, topAreas };
    },
});
