import { v } from "convex/values";
import {query, mutation,} from "./_generated/server";

// 1. Tüm Etkinlikleri Getir (Gruplanmış ve Sıralanmış)
export const getAcademyEvents = query({
    args: {userId: v.id("users")},
    handler: async (ctx,args) => {
        const currentUser = await ctx.db.get(args.userId);
        const allEvents = await ctx.db.query("events").collect();

        // Takip edilen etkinlikleri bul (Eğer kullanıcı giriş yaptıysa)
        const mySubscriptions = new Set();
        if (currentUser) {
            const subs = await ctx.db
                .query("eventSubscriptions")
                .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
                .collect();
            subs.forEach(s => mySubscriptions.add(s.eventId));
        }

        // Veriyi formatla ve isSubscribed bilgisini ekle
        const formattedEvents = allEvents.map(event => ({
            ...event,
            id: event._id,
            isSubscribed: mySubscriptions.has(event._id)
        }));

        // PLANLANANLAR: Live veya Upcoming
        const planned = formattedEvents
            .filter(e => e.status === "live" || e.status === "upcoming")
            .sort((a, b) => {
                // 1. Kriter: Live olanlar en üste
                if (a.status === "live" && b.status !== "live") return -1;
                if (a.status !== "live" && b.status === "live") return 1;
                // 2. Kriter: Tarihe göre ARTAN (En yakın tarih üstte)
                return a.date - b.date;
            });

        // TAMAMLANANLAR: Ended
        const completed = formattedEvents
            .filter(e => e.status === "ended")
            .sort((a, b) => {
                // Tarihe göre AZALAN (En yeni biten üstte)
                return b.date - a.date;
            });

        return {
            planned,
            completed
        };
    },
});

// 2. Etkinlik Takip Et / Takipten Çık (Toggle)
export const toggleSubscription = mutation({
    args: { eventId: v.id("events"), userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("Giriş yapmalısınız.");

        const existing = await ctx.db
            .query("eventSubscriptions")
            .withIndex("by_event_user", (q) => q.eq("eventId", args.eventId).eq("userId", user._id))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
            return false; // Takipten çıkıldı
        } else {
            await ctx.db.insert("eventSubscriptions", {
                eventId: args.eventId,
                userId: user._id
            });
            return true; // Takip edildi
        }
    }
});