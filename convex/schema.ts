import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    // 1. KULLANICILAR
    users: defineTable({
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        tokenIdentifier: v.optional(v.string()), // Auth provider ID

        avatar: v.optional(v.string()),
        bio: v.string(),
        department: v.string(),
        title: v.string(),
        city: v.union(v.string(), v.null()),
        role: v.union(v.literal("student"), v.literal("academician"), v.literal("admin")),

        skills: v.array(v.string()),
        socialLinks: v.object({
            github: v.optional(v.string()),
            linkedin: v.optional(v.string()),
            twitter: v.optional(v.string()),
            personalWebsite: v.optional(v.string()),
        }),

        experiences: v.array(
            v.object({
                institution: v.string(),
                duration: v.string(),
                description: v.string(),
                role: v.optional(v.string()),
                order: v.number(),
            })
        ),
        competitions: v.array(
            v.object({
                name: v.string(),
                rank: v.string(),
                date: v.optional(v.string()),
            })
        ),
        certificates: v.optional(v.array(v.string())),

        academicData: v.optional(v.object({
            office: v.optional(v.string()),
            researchInterests: v.array(v.string()),
            publicationsCount: v.number(),
            citationCount: v.number(),
            isAvailableForMentorship: v.boolean(),
        })),

        isAvailable: v.boolean(),
    })
        .index("by_email", ["email"])
        .index("by_role", ["role"])
        .searchIndex("search_name", {
            searchField: "firstName",
            filterFields: ["department", "role", "title"] // title filtreleme için opsiyonel
        }),

    authCodes: defineTable({
        email: v.string(),
        code: v.string(),
        expiresAt: v.number(),
    })
        .index("by_email", ["email"]),

    // 2. PROJELER (GÜNCELLENDİ)
    projects: defineTable({
        title: v.string(),
        summary: v.string(),
        date: v.string(), // ISO String (Creation date)

        ownerId: v.id("users"),
        advisorId: v.optional(v.id("users")),

        status: v.string(), // "ongoing", "completed", "recruiting", "cancelled"

        platform: v.string(), // "Web", "Mobile" vs.
        competition: v.optional(v.string()), // Değişiklik: CompetitionName yerine competition
        participantsNeeded: v.number(),
        needsAdvisor: v.boolean(),

        // --- ARAMA OPTİMİZASYONU İÇİN EKLENEN ALANLAR ---
        // Positions içindeki tüm skill'leri buraya da düz bir liste olarak ekliyoruz.
        // Böylece "React bilen proje ara" dediğimizde positions array'ini döngüye sokmadan bulabiliriz.
        searchSkills: v.array(v.string()),
        // Positions içindeki tüm departmanları buraya topluyoruz.
        searchDepartments: v.array(v.string()),

        // Pozisyonlar
        positions: v.array(
            v.object({
                id: v.string(),
                department: v.string(),
                count: v.number(),
                filled: v.number(),
                skills: v.array(v.string()),
                description: v.optional(v.string())
            })
        ),
    })
        .index("by_owner", ["ownerId"])
        .index("by_advisor", ["advisorId"])
        .index("by_status", ["status"])
        // Dashboard sıralaması için (En yeniler en üstte)
        .index("by_date", ["date"])
        // Full Text Search: Proje adına ve özetine göre arama yapmak için
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["status"]
        }),

    // 3. PROJE KATILIMCILARI
    projectMembers: defineTable({
        projectId: v.id("projects"),
        userId: v.id("users"),
        role: v.string(),
        joinedAt: v.string(),
    })
        .index("by_project", ["projectId"])
        .index("by_user", ["userId"]),

    // 4. BAŞVURULAR (APPLICATIONS)
    applications: defineTable({
        projectId: v.id("projects"),
        userId: v.id("users"),
        motivation: v.string(),
        // Status string olarak tutulabilir, union da olur ama string daha esnek olabilir.
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
        appliedAt: v.string(),
        // Eğer kabul edilirse hangi pozisyon için kabul edildiği
        relatedPositionId: v.optional(v.string()),
    })
        .index("by_project_user", ["projectId", "userId"])
        .index("by_project", ["projectId"]) // Proje sahipleri başvuruları listelerken
        .index("by_user", ["userId"]), // Kullanıcı "Başvurularım" sayfası için

    // 5. BİLDİRİMLER (YENİ EKLENDİ)
    // Başvuru yapıldığında, kabul edildiğinde veya mesaj geldiğinde bildirim göstermek için
    notifications: defineTable({
        userId: v.id("users"), // Bildirimi alacak kişi
        type: v.string(), // "application_received", "application_accepted", "new_message"
        title: v.string(),
        message: v.string(),
        relatedLink: v.string(), // "/dashboard?projectId=..." gibi
        isRead: v.boolean(),
        createdAt: v.string(),
    })
        .index("by_user_unread", ["userId", "isRead"]), // Okunmamış bildirim sayısı için

    // 6. CHAT
    conversations: defineTable({
        type: v.union(v.literal("direct"), v.literal("group")),
        name: v.optional(v.string()),
        avatar: v.optional(v.string()),
        participantIds: v.array(v.id("users")),
        lastMessageId: v.optional(v.id("messages")),
        lastMessageTime: v.number(),
    })
        .index("by_participant", ["participantIds"]),

    messages: defineTable({
        conversationId: v.id("conversations"),
        senderId: v.id("users"),
        content: v.string(),
        format: v.optional(v.string()),
        isReadBy: v.array(v.id("users")),
        createdAt: v.number(), // Timestamp sıralama için
    })
        .index("by_conversation", ["conversationId"]),

    // 7. RESMİ MAİLLEŞME
    mailThreads: defineTable({
        subject: v.string(),
        initiatorId: v.id("users"),
        recipientId: v.id("users"),
        relatedProjectId: v.optional(v.id("projects")),
        lastMessageDate: v.string(),
        status: v.union(v.literal("active"), v.literal("archived")),
    })
        .index("by_user_participation", ["initiatorId", "recipientId"]),

    // DÜZELTME: id referansı "mailThreads" olmalıydı (önceki kodda mail_threads idi)
    mailMessages: defineTable({
        threadId: v.id("mailThreads"),
        senderId: v.id("users"),
        content: v.string(),
        isRead: v.boolean(),
        timestamp: v.string(),
    })
        .index("by_thread", ["threadId"]),

    events: defineTable({
        title: v.string(),
        description: v.string(),
        date: v.number(), // Timestamp olarak saklamak sıralama için en iyisidir
        status: v.union(v.literal("live"), v.literal("upcoming"), v.literal("ended")),
        thumbnail: v.string(),
        platform: v.string(), // Youtube, Zoom, Discord vs.
        url: v.string(),
        duration: v.string(),
        tags: v.array(v.string()),

        // Katılımcıları embedded object olarak saklıyoruz (Hızlı okuma için)
        participants: v.array(v.object({
            name: v.string(),
            role: v.string(),
            avatar: v.string(),
            userId: v.optional(v.id("users")) // Eğer platform üyesi ise linkleyebiliriz
        }))
    })
        .index("by_status", ["status"])
        .index("by_date", ["date"]),

    // Kullanıcıların "Takip Et" (Zil ikonu) etkileşimi için
    eventSubscriptions: defineTable({
        eventId: v.id("events"),
        userId: v.id("users"),
    })
        .index("by_user", ["userId"])
        .index("by_event_user", ["eventId", "userId"]),

    departments: defineTable({
        label: v.string(), // e.g., "Bilgisayar Mühendisliği"
    })
});