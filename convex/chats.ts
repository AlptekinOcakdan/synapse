import { v } from "convex/values";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

// --- HELPERS ---

// Helper to get the current user with strict typing
async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users"> | null> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email!))
        .first();
}

// --- QUERIES ---

// 1. List Conversations (Sorted Newest -> Oldest)
export const listConversations = query({
    args: {},
    handler: async (ctx) => {
        const currentUser = await getCurrentUser(ctx);
        if (!currentUser) return [];

        // Fetch all conversations.
        // Optimization Note: Ideally, we should have an index like `by_participant`
        // that stores { userId, lastMessageTime } to sort at DB level.
        // For now, we collect and filter in memory as per schema limits.
        const conversations = await ctx.db
            .query("conversations")
            .collect();

        // Filter: Only conversations where I am a participant
        const myConversations = conversations.filter(c =>
            c.participantIds.includes(currentUser._id)
        );

        // Populate details
        const formattedConversations = await Promise.all(
            myConversations.map(async (conv) => {
                let name = conv.name;
                let avatar = conv.avatar;

                // Direct Chat Logic: Get the other person's details
                if (conv.type === "direct") {
                    const otherUserId = conv.participantIds.find((id) => id !== currentUser._id);
                    if (otherUserId) {
                        const otherUser = await ctx.db.get(otherUserId);
                        if (otherUser) {
                            name = `${otherUser.firstName} ${otherUser.lastName}`;
                            avatar = otherUser.avatar;
                        }
                    }
                }

                // Last Message Details
                let lastMessageContent = "";
                let unreadCount = 0;

                if (conv.lastMessageId) {
                    const lastMsg = await ctx.db.get(conv.lastMessageId);
                    if (lastMsg) {
                        lastMessageContent = lastMsg.content;
                        // Unread logic: If I haven't read it
                        if (!lastMsg.isReadBy.includes(currentUser._id)) {
                            unreadCount = 1;
                        }
                    }
                }

                return {
                    id: conv._id,
                    type: conv.type,
                    name: name || "Bilinmeyen Sohbet",
                    avatar: avatar || "",
                    lastMessage: lastMessageContent,
                    lastMessageTime: conv.lastMessageTime, // Keep as number for sorting
                    lastMessageTimeFormatted: new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unreadCount: unreadCount,
                    participantIds: conv.participantIds,
                };
            })
        );

        // SORTING: Newest (highest timestamp) first
        return formattedConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    },
});

// 2. Get Messages (Cursor Based Pagination)
// Used for "Load More" when scrolling up.
export const getMessages = query({
    args: {
        conversationId: v.id("conversations"),
        paginationOpts: paginationOptsValidator // Use standard pagination args
    },
    handler: async (ctx, args) => {
        // We order 'desc' (newest first) to get the most recent messages first for the initial load.
        // The UI will then reverse this array to show them [Oldest ... Newest] (Bottom to Top).
        const results = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .order("desc")
            .paginate(args.paginationOpts);

        // Map details (Sender info)
        const pageWithDetails = await Promise.all(
            results.page.map(async (msg) => {
                const sender = await ctx.db.get(msg.senderId);
                return {
                    id: msg._id,
                    senderId: msg.senderId,
                    content: msg.content,
                    timestamp: new Date(msg.createdAt).toISOString(),
                    senderName: sender ? `${sender.firstName} ${sender.lastName}` : "Bilinmeyen",
                    senderAvatar: sender?.avatar || "",
                    isRead: true
                };
            })
        );

        // Note: The UI must reverse `pageWithDetails` to display correctly (Top: Old, Bottom: New)
        return {
            ...results,
            page: pageWithDetails
        };
    },
});

// 3. Get Single Chat Details (Header)
export const getChat = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const currentUser = await getCurrentUser(ctx);
        if (!currentUser) return null;

        const conv = await ctx.db.get(args.conversationId);
        if (!conv) return null;

        let name = conv.name;
        let avatar = conv.avatar;

        if (conv.type === "direct") {
            const otherUserId = conv.participantIds.find((id) => id !== currentUser._id);
            if (otherUserId) {
                const otherUser = await ctx.db.get(otherUserId);
                if (otherUser) {
                    name = `${otherUser.firstName} ${otherUser.lastName}`;
                    avatar = otherUser.avatar;
                }
            }
        }

        // Detailed participants for Group Info
        const participants = await Promise.all(
            conv.participantIds.map(async (id) => {
                const u = await ctx.db.get(id);
                return {
                    id: u?._id,
                    name: u ? `${u.firstName} ${u.lastName}` : "Silinmiş",
                    avatar: u?.avatar || ""
                };
            })
        );

        return {
            id: conv._id,
            type: conv.type,
            name: name || "Sohbet",
            avatar: avatar || "",
            participants: participants
        };
    }
});

// --- MUTATIONS ---

// 4. Send Message
export const sendMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUser = await getCurrentUser(ctx);
        if (!currentUser) throw new Error("Giriş yapmalısınız.");

        // Insert message
        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            senderId: currentUser._id,
            content: args.content,
            format: "text",
            isReadBy: [currentUser._id],
            createdAt: Date.now(),
        });

        // Update conversation last message
        await ctx.db.patch(args.conversationId, {
            lastMessageId: messageId,
            lastMessageTime: Date.now(),
        });
    },
});