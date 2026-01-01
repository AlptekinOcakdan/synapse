import {Competition, Experience} from "@/modules/auth/types";

export interface Department {
    value: string;
    label: string;
}

export type ProjectStatus = "ongoing" | "completed" | "recruiting" | "cancelled";

export interface SimpleUser {
    id: number;
    name: string;
    avatar: string;
    department: string;
    title: string;
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    personalWebsite?: string;
}

export interface UserProfile extends SimpleUser {
    email?: string;
    bio: string;
    socialLinks?: SocialLinks;
    skills: string[];
    projectCount: number;
    top3Count: number;
    isAvailable: boolean;
    experiences: Experience[];
    competitions: Competition[];
    certificates?: string[];
}

export interface ProjectPosition {
    id: string;
    department: string;
    count: number;
    filled: number;
    skills: string[];
    description?: string;
}

export interface Project {
    id: number;
    title: string;
    summary: string;
    owner: SimpleUser;
    date: string;
    status: ProjectStatus;
    platform: string;
    competition: string;
    participantsNeeded: number;
    positions: ProjectPosition[];
    participants: SimpleUser[];
}

export interface ProjectFormData {
    title: string;
    competition: string;
    platform?: string;
    summary: string;
    status: ProjectStatus;
    positions: {
        id: string;
        department: string;
        count: number;
        skills: string[];
    }[];
}

export interface ChatUser {
    id: number;
    name: string;
    avatar: string;
    status: "online" | "offline";
}

export interface Message {
    id: string;
    senderId: number;
    content: string;
    timestamp: string;
}

export interface ChatSession {
    id: string;
    type: "direct" | "group";
    name: string;
    avatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    participants: ChatUser[];
    messages: Message[];
}

export interface Academician {
    id: string;
    name: string;
    title: string;
    department: string;
    avatar: string;
    email: string;
    office?: string;
    researchInterests: string[];
    publicationsCount: number;
    citationCount: number;
    mentoredProjects: number;
    isAvailableForMentorship: boolean;
}