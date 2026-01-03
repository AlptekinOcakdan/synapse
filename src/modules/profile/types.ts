import {Id} from "@/convex/_generated/dataModel";

export interface MailMessage {
    id: Id<"mailMessages"> | string;
    senderId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface MailThread {
    id: Id<"mailThreads">; // String yerine Convex ID kullanmak daha güvenli
    academician: {
        id: Id<"users">;
        name: string;
        title: string;
        avatar: string;
        department: string;
    };
    subject: string;
    relatedProject?: string;
    relatedProjectId?: Id<"projects">;
    lastMessageDate: string;
    isUnread: boolean;
    messages: MailMessage[];
}