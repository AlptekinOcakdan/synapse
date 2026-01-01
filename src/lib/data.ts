// --- SABİTLER ---
import {Academician, ChatSession, Department, Project, SimpleUser, UserProfile} from "@/modules/dashboard/types";
import {MailThread} from "@/modules/profile/types";

export const DEPARTMENTS: Department[] = [
    { value: "bilgisayar-muh", label: "Bilgisayar Mühendisliği" },
    { value: "yazilim-muh", label: "Yazılım Mühendisliği" },
    { value: "elektrik-elektronik", label: "Elektrik Elektronik Müh." },
    { value: "endustri-muh", label: "Endüstri Mühendisliği" },
    { value: "makine-muh", label: "Makine Mühendisliği" },
];

// --- 1. MOCK KULLANICILAR (Referans için) ---
// Projelerde 'owner' ve 'participant' olarak kullanılacaklar.
const USERS: Record<string, SimpleUser> = {
    alptekin: {
        id: 1,
        name: "Alptekin Ocakdan",
        avatar: "",
        department: "bilgisayar-muh",
        title: "Full Stack Geliştirici"
    },
    zeynep: {
        id: 2,
        name: "Zeynep Kaya",
        avatar: "https://i.pravatar.cc/150?u=zeynep",
        department: "yazilim-muh",
        title: "Veri Bilimcisi"
    },
    mehmet: {
        id: 3,
        name: "Mehmet Demir",
        avatar: "",
        department: "endustri-muh",
        title: "Blokzincir Geliştiricisi"
    },
    ayse: {
        id: 4,
        name: "Ayşe Yılmaz",
        avatar: "",
        department: "elektrik-elektronik",
        title: "Gömülü Sistemler Mühendisi"
    },
    caner: {
        id: 5,
        name: "Caner Erkin",
        avatar: "",
        department: "makine-muh",
        title: "Mekanik Tasarım Mühendisi"
    },
    ali: {
        id: 101,
        name: "Ali Veli",
        avatar: "",
        department: "makine-muh",
        title: "Junior Makine Müh."
    }
};

// --- 2. PROFİLLER (Detaylı Görünüm) ---
export const MOCK_PROFILES: UserProfile[] = [
    {
        ...USERS.alptekin,
        skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker", "TypeScript"],
        projectCount: 12,
        top3Count: 4,
        isAvailable: true,
        bio: "Yazılım geliştirmeye olan tutkum, karmaşık problemleri çözme isteğimle birleşiyor. Özellikle modern web teknolojileri ve ölçeklenebilir sistem mimarileri üzerine çalışmaktan keyif alıyorum.",
        experiences: [
            {
                institution: "Aselsan",
                duration: "3 Ay (Yaz Stajı)",
                description: "Savunma sanayi projelerinde C++ ile gömülü yazılım geliştirme süreçlerine katkıda bulundum.",
                order: 2
            },
            {
                institution: "Sakarya Teknokent",
                duration: "1 Yıl",
                description: "Start-up ortamında Full Stack geliştirici olarak görev aldım. React ve Node.js kullanarak çeşitli web uygulamaları geliştirdim.",
                order: 1
            }
        ],
        competitions: [
            { name: "Teknofest 2023 - Eğitim Teknolojileri", rank: "Finalist" },
            { name: "Tübitak 2209-A", rank: "Kabul" }
        ]
    },
    {
        ...USERS.zeynep,
        skills: ["Python", "TensorFlow", "Pandas", "Veri Analizi", "Makine Öğrenmesi"],
        projectCount: 8,
        top3Count: 3,
        isAvailable: false,
        bio: "Veri bilimi alanında derinlemesine bilgi sahibi olup, büyük veri setlerinden anlamlı içgörüler çıkarma konusunda uzmanım.",
        experiences: [
            {
                institution: "Turkcell Teknoloji",
                duration: "6 Ay",
                description: "Müşteri verileri üzerinde makine öğrenimi modelleri geliştirme.",
                order: 1
            }
        ],
        competitions: [
            { name: "Datathon Türkiye 2023", rank: "İlk 10%" }
        ]
    },
    {
        ...USERS.mehmet,
        skills: ["Solidity", "Rust", "Akıllı Sözleşmeler", "Web3.js"],
        projectCount: 5,
        top3Count: 1,
        isAvailable: true,
        bio: "Blokzincir teknolojileri ve akıllı sözleşmeler konusunda uzmanım.",
        experiences: [],
        competitions: []
    },
    {
        ...USERS.ayse,
        skills: ["C", "C++", "Altium Designer", "STM32", "RTOS"],
        projectCount: 15,
        top3Count: 5,
        isAvailable: true,
        bio: "Gömülü sistemler ve mikrodenetleyiciler konusunda derinlemesine bilgi sahibiyim.",
        experiences: [],
        competitions: []
    },
    {
        ...USERS.caner,
        skills: ["SolidWorks", "Ansys", "AutoCAD", "Termodinamik"],
        projectCount: 7,
        top3Count: 0,
        isAvailable: false,
        bio: "Mekanik tasarım ve analiz konularında uzmanım.",
        experiences: [],
        competitions: []
    },
];

// --- 3. GENEL PROJELER (Project Interface Uyumlu) ---
// Ana Sayfadaki liste
export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        title: "Otonom İHA İle Yangın Tespiti ve Müdahale Sistemi",
        owner: USERS.alptekin, // Obje Referansı
        summary: "Orman yangınlarını erken tespit edip otonom olarak müdahale edebilen bir İHA sistemi geliştiriyoruz.",
        platform: "Teknofest",
        competition: "Savaşan İHA Yarışması",
        date: "2024-01-15",
        status: "recruiting",
        participantsNeeded: 2,
        participants: [], // Henüz kimse yok
        positions: [
            {
                id: "p1-1",
                department: "yazilim-muh",
                count: 1,
                filled: 0,
                skills: ["Python", "OpenCV", "AI"],
                description: "Görüntü işleme algoritmaları üzerine çalışacak."
            },
            {
                id: "p1-2",
                department: "makine-muh",
                count: 1,
                filled: 0,
                skills: ["SolidWorks", "Aerodinamik"],
                description: "İHA gövde tasarımı ve montajı."
            }
        ]
    },
    {
        id: 2,
        title: "Engelsiz Yaşam İçin Görüntü İşleme Destekli Gözlük",
        owner: USERS.ayse,
        summary: "Görme engelli bireyler için nesne tanıma ve sesli asistan özellikli akıllı gözlük projesi.",
        platform: "TÜBİTAK",
        competition: "2209-A Araştırma Projeleri",
        date: "2023-12-20",
        status: "recruiting",
        participantsNeeded: 1,
        participants: [],
        positions: [
            {
                id: "p2-1",
                department: "elektrik-elektronik",
                count: 1,
                filled: 0,
                skills: ["Embedded Systems", "C++", "PCB Tasarım"],
                description: "Gözlük donanımı ve gömülü yazılım."
            }
        ]
    },
    {
        id: 3,
        title: "Blokzincir Tabanlı Tedarik Zinciri Yönetimi",
        owner: USERS.mehmet,
        summary: "Gıda güvenliğini sağlamak amacıyla tarladan sofraya izlenebilirlik sağlayan dApp.",
        platform: "Hackathon",
        competition: "Solana Global Hackathon",
        date: "2024-02-01",
        status: "recruiting",
        participantsNeeded: 3,
        participants: [USERS.caner], // Örnek: Caner katılmış olsun
        positions: [
            {
                id: "p3-1",
                department: "bilgisayar-muh",
                count: 2,
                filled: 0,
                skills: ["Solidity", "Rust", "Smart Contracts"],
            },
            {
                id: "p3-2",
                department: "endustri-muh",
                count: 1,
                filled: 1, // Biri dolmuş (Caner)
                skills: ["Lojistik", "Süreç Yönetimi"],
            }
        ]
    },
    {
        id: 4,
        title: "Yapay Zeka Destekli Tarımsal Verimlilik Analizi",
        owner: USERS.zeynep,
        summary: "Uydu görüntüleri ve sensör verileriyle tarlalardaki verimliliği artıran AI modeli.",
        platform: "Teknofest",
        competition: "Tarım Teknolojileri Yarışması",
        date: "2023-11-10",
        status: "recruiting",
        participantsNeeded: 2,
        participants: [],
        positions: [
            {
                id: "p4-1",
                department: "yazilim-muh",
                count: 1,
                filled: 0,
                skills: ["Python", "TensorFlow", "Data Analysis"],
            },
            {
                id: "p4-2",
                department: "elektrik-elektronik",
                count: 1,
                filled: 0,
                skills: ["IoT", "Arduino", "Sensörler"],
            }
        ]
    },
    {
        id: 5,
        title: "Elektrikli Araçlar İçin Yüksek Verimli BMS",
        owner: USERS.caner,
        summary: "Li-ion bataryaların ömrünü uzatan ve güvenliğini artıran yerli BMS tasarımı.",
        platform: "Teknofest",
        competition: "Efficiency Challenge",
        date: "2024-01-05",
        status: "ongoing",
        participantsNeeded: 4,
        participants: [],
        positions: [
            {
                id: "p5-1",
                department: "elektrik-elektronik",
                count: 2,
                filled: 0,
                skills: ["Circuit Design", "Matlab", "Simulink"],
            },
            {
                id: "p5-3",
                department: "makine-muh",
                count: 1,
                filled: 0,
                skills: ["Termal Analiz", "Ansys"],
            },
            {
                id: "p5-4",
                department: "yazilim-muh",
                count: 1,
                filled: 0,
                skills: ["C", "Embedded Linux"],
            }
        ]
    },
];

// --- 4. BENİM PROJELERİM (Dashboard İçin) ---
// Kullanıcının sahibi olduğu projeler
export const MOCK_MY_PROJECTS: Project[] = [
    {
        id: 10, // ID çakışmasın diye 10 verdim
        title: "Otonom İHA İle Yangın Tespiti (Benim Projem)",
        owner: USERS.alptekin,
        summary: "Orman yangınlarını erken tespit edip otonom olarak müdahale edebilen bir İHA sistemi.",
        platform: "Teknofest",
        competition: "Savaşan İHA Yarışması",
        status: "ongoing",
        date: "2024-01-15",
        participantsNeeded: 2,
        participants: [USERS.ali, USERS.ayse], // Ali ve Ayşe katılmış
        positions: [
            {
                id: "mp1-1",
                department: "makine-muh",
                count: 1,
                filled: 1, // Dolu
                skills: ["SolidWorks", "Aerodinamik"]
            },
            {
                id: "mp1-2",
                department: "yazilim-muh",
                count: 1,
                filled: 1, // Dolu
                skills: ["ROS", "Python"]
            }
        ]
    },
    {
        id: 11,
        title: "Blokzincir Tabanlı Lojistik",
        owner: USERS.zeynep,
        summary: "Tedarik zincirinde şeffaflık sağlayan Solana tabanlı dApp.",
        platform: "Hackathon",
        competition: "Solana Global Hackathon",
        status: "completed",
        date: "2023-11-20",
        participantsNeeded: 0,
        participants: [USERS.alptekin],
        positions: [
            {
                id: "mp2-1",
                department: "endustri-muh",
                count: 1,
                filled: 1,
                skills: ["Supply Chain", "Analiz"]
            }
        ]
    },
    {
        id: 12,
        title: "Blokzincir Tabanlı Lojistik",
        owner: USERS.zeynep,
        summary: "Tedarik zincirinde şeffaflık sağlayan Solana tabanlı dApp.",
        platform: "Hackathon",
        competition: "Solana Global Hackathon",
        status: "completed",
        date: "2023-11-20",
        participantsNeeded: 0,
        participants: [USERS.alptekin],
        positions: [
            {
                id: "mp2-1",
                department: "endustri-muh",
                count: 1,
                filled: 1,
                skills: ["Supply Chain", "Analiz"]
            }
        ]
    },
    {
        id: 13,
        title: "Blokzincir Tabanlı Lojistik",
        owner: USERS.zeynep,
        summary: "Tedarik zincirinde şeffaflık sağlayan Solana tabanlı dApp.",
        platform: "Hackathon",
        competition: "Solana Global Hackathon",
        status: "completed",
        date: "2023-11-20",
        participantsNeeded: 0,
        participants: [USERS.alptekin],
        positions: [
            {
                id: "mp2-1",
                department: "endustri-muh",
                count: 1,
                filled: 1,
                skills: ["Supply Chain", "Analiz"]
            }
        ]
    },
    {
        id: 14,
        title: "Blokzincir Tabanlı Lojistik",
        owner: USERS.zeynep,
        summary: "Tedarik zincirinde şeffaflık sağlayan Solana tabanlı dApp.",
        platform: "Hackathon",
        competition: "Solana Global Hackathon",
        status: "completed",
        date: "2023-11-20",
        participantsNeeded: 0,
        participants: [USERS.alptekin],
        positions: [
            {
                id: "mp2-1",
                department: "endustri-muh",
                count: 1,
                filled: 1,
                skills: ["Supply Chain", "Analiz"]
            }
        ]
    }
];

export const CURRENT_USER_ID = 1; // Alptekin (Giriş yapan kullanıcı)

export const MOCK_CHATS: ChatSession[] = [
    {
        id: "c1",
        type: "direct",
        name: "Zeynep Kaya",
        avatar: "https://i.pravatar.cc/150?u=zeynep",
        lastMessage: "Yarınki toplantı saat kaçta?",
        lastMessageTime: "10:30",
        unreadCount: 2,
        participants: [
            { id: 1, name: "Alptekin Ocakdan", avatar: "", status: "online" },
            { id: 2, name: "Zeynep Kaya", avatar: "https://i.pravatar.cc/150?u=zeynep", status: "online" }
        ],
        messages: [
            { id: "m1", senderId: 2, content: "Selam Alptekin, nasılsın?", timestamp: "2024-01-01T10:00:00" },
            { id: "m2", senderId: 1, content: "İyiyim Zeynep, sen nasılsın?", timestamp: "2024-01-01T10:05:00" },
            { id: "m3", senderId: 2, content: "Yarınki toplantı saat kaçta?", timestamp: "2024-01-01T10:30:00" },
        ]
    },
    {
        id: "c2",
        type: "group",
        name: "Otonom İHA Ekibi",
        avatar: "", // Grup ikon (boşsa baş harfler)
        lastMessage: "Raporları sisteme yükledim.",
        lastMessageTime: "Dün",
        unreadCount: 0,
        participants: [
            { id: 1, name: "Alptekin Ocakdan", avatar: "", status: "online" },
            { id: 3, name: "Mehmet Demir", avatar: "", status: "offline" },
            { id: 5, name: "Caner Erkin", avatar: "", status: "online" }
        ],
        messages: [
            { id: "m10", senderId: 3, content: "Arkadaşlar motor sürücüleri geldi mi?", timestamp: "2024-01-01T09:00:00" },
            { id: "m11", senderId: 5, content: "Evet, laboratuvara bıraktım.", timestamp: "2024-01-01T09:15:00" },
            { id: "m12", senderId: 1, content: "Harika, akşam test edelim.", timestamp: "2024-01-01T09:20:00" },
            { id: "m13", senderId: 5, content: "Raporları sisteme yükledim.", timestamp: "2024-01-01T18:00:00" },
        ]
    }
];

export const MOCK_ACADEMICIANS: Academician[] = [
    {
        id: "ac-1",
        name: "Prof. Dr. Ahmet Yılmaz",
        title: "Prof. Dr.",
        department: "computer-engineering",
        avatar: "https://i.pravatar.cc/150?u=ac1",
        email: "ayilmaz@uni.edu.tr",
        office: "M-304",
        researchInterests: ["Yapay Zeka", "Derin Öğrenme", "Doğal Dil İşleme", "Doğal Dil İşsaleme", "Doğal Dil İşlemdse"],
        publicationsCount: 45,
        citationCount: 1250,
        mentoredProjects: 12,
        isAvailableForMentorship: true,
    },
    {
        id: "ac-2",
        name: "Doç. Dr. Ayşe Kaya",
        title: "Doç. Dr.",
        department: "software-engineering",
        avatar: "https://i.pravatar.cc/150?u=ac2",
        email: "akaya@uni.edu.tr",
        office: "M-201",
        researchInterests: ["Yazılım Mimarisi", "Mikroservisler", "Cloud Computing"],
        publicationsCount: 28,
        citationCount: 640,
        mentoredProjects: 5,
        isAvailableForMentorship: false, // Şu an dolu
    },
    {
        id: "ac-3",
        name: "Dr. Öğr. Üyesi Mehmet Demir",
        title: "Dr. Öğr. Üyesi",
        department: "electrical-engineering",
        avatar: "https://i.pravatar.cc/150?u=ac3",
        email: "mdemir@uni.edu.tr",
        office: "E-105",
        researchInterests: ["Gömülü Sistemler", "IoT", "Sinyal İşleme"],
        publicationsCount: 15,
        citationCount: 300,
        mentoredProjects: 8,
        isAvailableForMentorship: true,
    },
    {
        id: "ac-4",
        name: "Arş. Gör. Zeynep Çelik",
        title: "Arş. Gör.",
        department: "computer-engineering",
        avatar: "https://i.pravatar.cc/150?u=ac4",
        email: "zcelik@uni.edu.tr",
        office: "M-308",
        researchInterests: ["Bilgisayarlı Görme", "Görüntü İşleme"],
        publicationsCount: 5,
        citationCount: 45,
        mentoredProjects: 2,
        isAvailableForMentorship: true,
    }
];

export const CURRENT_USER: UserProfile = {
    id: 1,
    name: "Alptekin Ocakdan",
    title: "Yazılım Mühendisi & Full Stack Geliştirici",
    department: "computer-engineering",
    email: "alptekin.ocakdan@example.com",
    bio: "Modern web teknolojileri ve ölçeklenebilir sistem mimarileri üzerine çalışan tutkulu bir geliştirici. Açık kaynak projelere katkı sağlamayı ve yeni teknolojileri deneyimlemeyi sever.",
    avatar: "https://i.pravatar.cc/150?u=alp",
    isAvailable: true,
    socialLinks: {
        github: "https://github.com/alptekinocakdan",
        linkedin: "https://linkedin.com/in/alptekinocakdan",
    },
    skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
    projectCount: 12,
    top3Count: 4, // Devam eden
    experiences: [
        {
            institution: "Tech Solutions Inc.",
            role: "Senior Frontend Developer",
            duration: "2023 - Günümüz",
            description: "Kurumsal dashboard uygulamalarının geliştirilmesi ve UI kütüphanesinin yönetimi.",
            order:1
        },
        {
            institution: "Sakarya Üniversitesi",
            role: "Araştırma Asistanı",
            duration: "2021 - 2023",
            description: "Büyük veri analizi ve yapay zeka projelerinde akademik çalışmalar.",
            order:2
        }
    ],
    competitions: [
        { name: "Teknofest 2024", rank: "Finalist", date: "2024" },
        { name: "Hackathon Turkey", rank: "1.lik Ödülü", date: "2023" }
    ]
};

export const MOCK_MAILS: MailThread[] = [
    {
        id: "m-1",
        academician: {
            id: "ac-1",
            name: "Prof. Dr. Ahmet Yılmaz",
            title: "Prof. Dr.",
            avatar: "https://i.pravatar.cc/150?u=ac1",
            department: "Bilgisayar Müh."
        },
        subject: "İHA Projesi Teknik Destek",
        // DİKKAT: Bu isim MOCK_PROJECTS[0].title ile aynı olmalı
        relatedProject: "Otonom İHA İle Yangın Tespiti ve Müdahale Sistemi",
        lastMessageDate: "10:30",
        isUnread: true,
        messages: [
            {
                id: "msg-1",
                senderId: "u1",
                content: "Hocam merhaba, İHA'nın görüntü işleme modülünde takıldığımız bir nokta var.",
                timestamp: "2025-12-01T09:00:00",
                isRead: true
            },
            {
                id: "msg-2",
                senderId: "ac-1",
                content: "Merhaba, yarın ofis saatimde gelirseniz algoritmaya birlikte bakabiliriz.",
                timestamp: "2025-12-01T10:30:00",
                isRead: false
            }
        ]
    },
    {
        id: "m-2",
        academician: {
            id: "ac-2",
            name: "Doç. Dr. Zeynep Kaya",
            title: "Doç. Dr.",
            avatar: "https://i.pravatar.cc/150?u=ac2",
            department: "Yazılım Müh."
        },
        subject: "Tarımsal Veri Seti Hakkında",
        // DİKKAT: Bu isim MOCK_PROJECTS[3].title ile aynı olmalı
        relatedProject: "Yapay Zeka Destekli Tarımsal Verimlilik Analizi",
        lastMessageDate: "Dün",
        isUnread: false,
        messages: [
            {
                id: "msg-3",
                senderId: "u1",
                content: "Hocam, projemiz için gerekli olan uydu verilerine nasıl erişebiliriz?",
                timestamp: "2025-11-30T14:00:00",
                isRead: true
            }
        ]
    },
    {
        id: "m-3",
        academician: {
            id: "ac-3",
            name: "Dr. Öğr. Üyesi Mehmet Demir",
            title: "Dr. Öğr. Üyesi",
            avatar: "https://i.pravatar.cc/150?u=ac3",
            department: "Elektrik-Elektronik Müh."
        },
        subject: "Genel Danışmanlık",
        relatedProject: undefined, // Proje ile ilgisi yok
        lastMessageDate: "2 gün önce",
        isUnread: false,
        messages: [
            {
                id: "msg-4",
                senderId: "u1",
                content: "Hocam merhaba, staj konusunda danışmak istemiştim.",
                timestamp: "2025-11-28T11:00:00",
                isRead: true
            }
        ]
    }
];