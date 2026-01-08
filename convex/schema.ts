import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        tokenIdentifier: v.optional(v.string()),

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
            filterFields: ["department", "role", "title"]
        }),

    authCodes: defineTable({
        email: v.string(),
        code: v.string(),
        expiresAt: v.number(),
    })
        .index("by_email", ["email"]),

    projects: defineTable({
        title: v.string(),
        summary: v.string(),
        date: v.string(),

        ownerId: v.id("users"),
        advisorId: v.optional(v.id("users")),

        status: v.union(v.literal("recruiting"), v.literal("ongoing"), v.literal("completed"), v.literal("cancelled")),

        platform: v.string(),
        competition: v.optional(v.string()),
        participantsNeeded: v.number(),
        needsAdvisor: v.boolean(),

        searchSkills: v.array(v.string()),
        searchDepartments: v.array(v.string()),

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
        .index("by_date", ["date"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["status"]
        }),

    projectMembers: defineTable({
        projectId: v.id("projects"),
        userId: v.id("users"),
        role: v.string(),
        joinedAt: v.string(),
    })
        .index("by_project", ["projectId"])
        .index("by_user", ["userId"])
        .index("by_project_user", ["projectId", "userId"]),

    applications: defineTable({
        projectId: v.id("projects"),
        userId: v.id("users"),
        motivation: v.string(),
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
        appliedAt: v.string(),
        relatedPositionId: v.optional(v.string()),
    })
        .index("by_project_user", ["projectId", "userId"])
        .index("by_project", ["projectId"])
        .index("by_user", ["userId"]),

    notifications: defineTable({
        userId: v.id("users"),
        type: v.string(),
        title: v.string(),
        message: v.string(),
        relatedLink: v.string(),
        isRead: v.boolean(),
        createdAt: v.string(),
    })
        .index("by_user_unread", ["userId", "isRead"]),

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
        createdAt: v.number(),
    })
        .index("by_conversation", ["conversationId"]),

    mailThreads: defineTable({
        subject: v.string(),
        initiatorId: v.id("users"),
        recipientId: v.id("users"),
        relatedProjectId: v.optional(v.id("projects")),
        lastMessageDate: v.string(),
        lastMessageId: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("archived")),
    })
        .index("by_user_participation", ["initiatorId", "recipientId"]),

    mailMessages: defineTable({
        threadId: v.id("mailThreads"),
        senderId: v.id("users"),
        content: v.string(),
        source: v.optional(v.union(v.literal("platform"), v.literal("email"))),
        messageId: v.optional(v.string()),
        isRead: v.boolean(),
        timestamp: v.string(),
    })
        .index("by_thread", ["threadId"]),
    events: defineTable({
        title: v.string(),
        description: v.string(),
        date: v.number(),
        status: v.union(v.literal("live"), v.literal("upcoming"), v.literal("ended")),
        thumbnail: v.string(),
        platform: v.string(),
        url: v.string(),
        duration: v.string(),
        tags: v.array(v.string()),

        participants: v.array(v.object({
            name: v.string(),
            role: v.string(),
            avatar: v.string(),
            userId: v.optional(v.id("users"))
        }))
    })
        .index("by_status", ["status"])
        .index("by_date", ["date"]),

    eventSubscriptions: defineTable({
        eventId: v.id("events"),
        userId: v.id("users"),
    })
        .index("by_user", ["userId"])
        .index("by_event_user", ["eventId", "userId"]),

    departments: defineTable({
        label: v.string(),
    })
});