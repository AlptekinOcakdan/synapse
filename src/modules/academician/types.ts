import {Id} from "@/convex/_generated/dataModel";

export interface StudentParticipant {
    id: string;
    name: string;
    avatar: string;
    department: string;
    grade: string; // Örn: "4. Sınıf"
}

export interface AcademicianMailThread {
    id: Id<"mailThreads">;
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
    messages: { // Sidebar önizlemesi için
        id: Id<"mailMessages">;
        senderId: string;
        content: string;
        timestamp: string;
        isRead: boolean;
    }[];
}