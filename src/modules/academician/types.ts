import {MailMessage} from "@/modules/profile/types";

export interface StudentParticipant {
    id: string;
    name: string;
    avatar: string;
    department: string;
    grade: string; // Örn: "4. Sınıf"
}

export interface AcademicianMailThread {
    id: string;
    student: StudentParticipant; // Karşı taraf artık öğrenci
    subject: string;
    relatedProject?: string; // İlgili proje başlığı
    lastMessageDate: string;
    isUnread: boolean;
    messages: MailMessage[]; // Mesaj yapısı aynı kalabilir
}