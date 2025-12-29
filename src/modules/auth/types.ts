export interface Competition {
    name: string;
    rank: string;
}

export interface Experience {
    institution: string; // Kurum Adı
    duration: string;    // Süre (Örn: 6 Ay, 2022-2023)
    description: string; // Yaptığı işin özeti
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