// --- 1. SABİTLER VE ENUMLAR ---

import {Competition, Experience} from "@/modules/auth/types";

export interface Department {
    value: string;
    label: string;
}

// Proje Durumu için standart tip
export type ProjectStatus = "ongoing" | "completed" | "recruiting" | "cancelled";

// --- 3. KULLANICI (USER) YAPILARI ---

// En temel kullanıcı verisi (Kartlarda, katılımcı listelerinde görünür)
export interface SimpleUser {
    id: number;
    name: string;
    avatar: string;
    department: string; // Department.value ile eşleşir
    title: string;     // Örn: "Full Stack Developer"
}

// Detaylı Profil (Profil sayfasında ve Modalda görünür)
// SimpleUser'dan miras alır, üzerine detay ekler.
export interface UserProfile extends SimpleUser {
    bio: string;
    skills: string[];
    projectCount: number;
    top3Count: number;
    isAvailable: boolean;
    experiences: Experience[];
    competitions: Competition[];
    certificates?: string[];
}

// --- 4. PROJE (PROJECT) YAPILARI ---

// Projedeki Açık veya Kapalı Pozisyon Tanımı
export interface ProjectPosition {
    id: string;         // UUID
    department: string; // Department.value (örn: "bilgisayar-muh")
    count: number;      // Bu pozisyon için toplam aranan kişi sayısı (Örn: 2)
    filled: number;     // Şu an dolan kontenjan (Örn: 1)
    skills: string[];   // Bu pozisyon için beklenen yetenekler
    description?: string; // Opsiyonel açıklama
}

// Ana Proje Arayüzü (Hem Dashboard hem Anasayfa için TEK TİP)
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
    competition: string; // Platform bilgisi genelde yarışmadan çıkarılabilir veya ayrı sorulabilir
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
    timestamp: string; // ISO string
}

export interface ChatSession {
    id: string;
    type: "direct" | "group";
    name: string; // Grup adı veya Kişi adı
    avatar?: string; // Grup resmi veya kişi avatarı
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    participants: ChatUser[]; // Katılımcı listesi
    messages: Message[]; // Sohbet geçmişi
}

export interface Academician {
    id: string;
    name: string;
    title: string; // Örn: Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi
    department: string; // "computer-engineering" gibi slug veya direkt isim
    avatar: string;
    email: string;
    office?: string;

    // Akademik Veriler
    researchInterests: string[]; // İlgi alanları / Uzmanlıklar
    publicationsCount: number;   // Yayın sayısı (Opsiyonel görsel şov için)
    citationCount: number;       // Atıf sayısı
    mentoredProjects: number;    // Yönettiği/Mentör olduğu proje sayısı

    // Durum
    isAvailableForMentorship: boolean; // Proje mentörlüğü kabul ediyor mu?
}