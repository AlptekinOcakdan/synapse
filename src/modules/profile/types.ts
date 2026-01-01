export interface MailMessage {
    id: string;
    senderId: string | number; // ID tipi projenize göre (string/number)
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface MailThread {
    id: string;
    academician: {
        id: string | number;
        name: string;
        title: string;
        avatar: string;
        department: string;
    };
    subject: string; // E-posta Konusu
    relatedProject?: string; // Hangi proje ile ilgili olduğu (Opsiyonel)
    lastMessageDate: string;
    isUnread: boolean;
    messages: MailMessage[];
}