export interface Competition {
    name: string;
    rank: string;
}

export interface Experience {
    institution: string;
    duration: string;
    description: string;
    order: number;
}

export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    otp: string;

    // CV Bölümü
    department: string;
    bio: string;           // YENİ: Kendini anlatan yazı
    skills: string[];
    experiences: Experience[]; // GÜNCELLENDİ: Artık obje dizisi
    competitions: Competition[];
    certificates: string[];
    profileImage?: string | null;
}