import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {ProjectStatus, SimpleUser} from "@/modules/dashboard/types";

// --- QUERY: DANIŞMAN ARAYAN PROJELERİ GETİR ---
export const getAdvisorSeekingProjects = query({
    args: {
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // 1. Projeleri Filtrele
        let projects = await ctx.db
            .query("projects")
            .filter((q) =>
                q.and(
                    q.eq(q.field("needsAdvisor"), true),
                    q.eq(q.field("advisorId"), undefined)
                )
            )
            .collect();

        // 2. Arama (Basit filtreleme)
        if (args.search) {
            const searchLower = args.search.toLowerCase();
            projects = projects.filter((p) =>
                p.title.toLowerCase().includes(searchLower)
            );
        }

        // 3. Detayları Doldur (Owner + Participants)
        const projectsWithDetails = await Promise.all(
            projects.map(async (p) => {
                const owner = await ctx.db.get(p.ownerId);
                if (!owner) return null;

                // --- KATILIMCILARI ÇEKME KISMI (DÜZELTİLDİ) ---

                // A. Önce ara tablodan (projectMembers) bu proje ID'sine ait kayıtları bul
                const memberRelations = await ctx.db
                    .query("projectMembers")
                    .withIndex("by_project", (q) => q.eq("projectId", p._id))
                    .collect();

                // B. Sonra bu kayıtların içindeki userId'leri kullanarak Users tablosundan detayları çek
                const participants = await Promise.all(
                    memberRelations.map(async (rel) => {
                        const user = await ctx.db.get(rel.userId);
                        // Kullanıcı silinmişse null gelebilir, güvenli obje oluşturuyoruz
                        return {
                            id: rel.userId,
                            name: user ? `${user.firstName} ${user.lastName}` : "Silinmiş Kullanıcı",
                            avatar: user?.avatar || "",
                            department: user?.department || "",
                            title: user?.title || "Öğrenci",
                            city: user?.city || null,
                        } as SimpleUser;
                    })
                );

                // ------------------------------------------------

                return {
                    id: p._id,
                    title: p.title,
                    summary: p.summary,
                    status: p.status as ProjectStatus,
                    date: p.date,
                    participantsNeeded: p.participantsNeeded,

                    // Frontend'de bazen sadece sayı lazım oluyor
                    participantCount: participants.length,

                    owner: {
                        id: owner._id,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "Öğrenci",
                        city: owner.city,
                    },

                    platform: p.platform || "Genel",
                    competition: p.competition || "",
                    needsAdvisor: true,
                    positions: p.positions || [],

                    // ARTIK BOŞ ARRAY DEĞİL, GERÇEK VERİ DÖNÜYORUZ:
                    participants: participants,

                    advisor: undefined
                };
            })
        );

        return projectsWithDetails.filter((p) => p !== null);
    },
});

// --- MUTATION: DANIŞMANLIK BAŞVURUSU YAP ---
export const applyForMentorship = mutation({
    args: {
        projectId: v.id("projects"),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Kimlik Kontrolü
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Giriş yapmalısınız.");

        const academician = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!academician || academician.role !== "academician") {
            throw new Error("Sadece akademisyenler mentörlük teklifi yapabilir.");
        }

        // 2. Projeyi Bul
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Proje bulunamadı.");
        if (project.advisorId) throw new Error("Bu projenin zaten bir danışmanı var.");

        // 3. İletişim Başlat (Mail Thread Oluştur)
        // Akademisyen -> Öğrenci arasında proje konulu bir mail başlatıyoruz.
        const threadId = await ctx.db.insert("mailThreads", {
            subject: `[Mentörlük Teklifi] ${project.title}`,
            initiatorId: academician._id,
            recipientId: project.ownerId,
            relatedProjectId: project._id,
            lastMessageDate: new Date().toISOString(),
            status: "active",
        });

        // 4. Mesajı Kaydet
        await ctx.db.insert("mailMessages", {
            threadId: threadId,
            senderId: academician._id,
            content: args.message || "Merhaba, projenize akademik danışmanlık yapmak isterim.",
            isRead: false,
            timestamp: new Date().toISOString(),
        });

        // 5. Bildirim Gönder (Öğrenciye)
        await ctx.db.insert("notifications", {
            userId: project.ownerId,
            type: "mentorship_offer",
            title: "Yeni Mentörlük Teklifi",
            message: `${academician.title} ${academician.firstName} ${academician.lastName} projenize danışman olmak istiyor.`,
            relatedLink: `/dashboard/mails?mailId=${threadId}`, // Direkt mesaja yönlendir
            isRead: false,
            createdAt: new Date().toISOString(),
        });

        return { success: true };
    },
});