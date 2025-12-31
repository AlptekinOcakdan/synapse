

// --- SABİTLER ---
import {Department, Project, SimpleUser, UserProfile} from "@/modules/dashboard/types";

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