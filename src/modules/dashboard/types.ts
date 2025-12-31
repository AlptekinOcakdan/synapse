// types.ts

import {Competition, Experience} from "@/modules/auth/types";

export interface Department {
    value: string;
    label: string;
}

// Pozisyon/Rol Arayüzü
export interface ProjectPosition {
    id: string;
    department: string; // Department.value ile eşleşecek
    skills: string[];   // Örn: ["React", "Node.js", "SolidWorks"]
    description?: string; // Opsiyonel: "Frontend geliştirmesi yapacak"
}

export interface Project {
    id: number;
    title: string;
    owner: string;
    summary: string;
    participantsNeeded: number;
    platform: string;
    competition: string;
    date: string;
    positions: ProjectPosition[];
}

export interface UserProfile {
    id: number;
    name: string;
    title: string;
    department: string;
    avatar: string;
    skills: string[];
    projectCount: number;
    top3Count: number;
    isAvailable?: boolean;
    // --- YENİ ALANLAR ---
    bio?: string;
    experiences?: Experience[];
    competitions?: Competition[];
}

// --- SABİTLER ---
export const DEPARTMENTS: Department[] = [
    {value: "bilgisayar-muh", label: "Bilgisayar Mühendisliği"},
    {value: "yazilim-muh", label: "Yazılım Mühendisliği"},
    {value: "elektrik-elektronik", label: "Elektrik Elektronik Müh."},
    {value: "endustri-muh", label: "Endüstri Mühendisliği"},
    {value: "makine-muh", label: "Makine Mühendisliği"},
];

export const MOCK_PROFILES: UserProfile[] = [
    {
        id: 1,
        name: "Alptekin Ocakdan",
        title: "Full Stack Geliştirici",
        department: "bilgisayar-muh",
        avatar: "",
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
        id: 2,
        name: "Zeynep Kaya",
        title: "Veri Bilimcisi",
        department: "yazilim-muh",
        avatar: "", // Gerçekçi olması için boş bıraktım, UI'da baş harfler çıkacak
        skills: ["Python", "TensorFlow", "Pandas", "Veri Analizi", "Makine Öğrenmesi"],
        projectCount: 8,
        top3Count: 3,
        isAvailable: false,
        bio: "Veri bilimi alanında derinlemesine bilgi sahibi olup, büyük veri setlerinden anlamlı içgörüler çıkarma konusunda uzmanım. Makine öğrenimi modelleri geliştirme ve uygulama konusunda deneyimliyim.",
        experiences: [
            {
                institution: "Turkcell Teknoloji",
                duration: "6 Ay (Uzun Dönem Staj)",
                description: "Müşteri verileri üzerinde makine öğrenimi modelleri geliştirme ve churn analizi optimizasyonu.",
                order: 2
            },
            {
                institution: "Getir",
                duration: "2 Yıl",
                description: "Veri analisti olarak tedarik zinciri optimizasyonu için veri odaklı çözümler ürettim.",
                order: 1
            }
        ],
        competitions: [
            { name: "Datathon Türkiye 2023", rank: "İlk 10%" },
            { name: "Teknofest Yapay Zeka Yarışması", rank: "2.lik Ödülü" }
        ]
    },
    {
        id: 3,
        name: "Mehmet Demir",
        title: "Blokzincir Geliştiricisi",
        department: "endustri-muh",
        avatar: "",
        skills: ["Solidity", "Rust", "Akıllı Sözleşmeler", "Web3.js"],
        projectCount: 5,
        top3Count: 1,
        isAvailable: true,
        bio: "Blokzincir teknolojileri ve akıllı sözleşmeler konusunda uzmanım. Merkeziyetsiz uygulamalar (dApp) geliştirme ve blokzincir tabanlı finansal çözümler üretme konusunda deneyim sahibiyim.",
        experiences: [
            {
                institution: "BtcTurk",
                duration: "1 Yıl",
                description: "Kripto varlık işlem platformunda backend süreçlerine destek ve akıllı sözleşme denetimi.",
                order: 1
            },
            {
                institution: "Avalanche Türkiye Topluluğu",
                duration: "8 Ay",
                description: "Topluluk projelerinde açık kaynak dApp geliştirme süreçlerinde aktif rol aldım.",
                order: 2
            }
        ],
        competitions: [
            { name: "Solana İstanbul Hackathon", rank: "Finalist" },
            { name: "ETHGünü Hackathonu", rank: "3.lük Ödülü" }
        ]
    },
    {
        id: 4,
        name: "Ayşe Yılmaz",
        title: "Gömülü Sistemler Mühendisi",
        department: "elektrik-elektronik",
        avatar: "",
        skills: ["C", "C++", "Altium Designer", "STM32", "RTOS"],
        projectCount: 15,
        top3Count: 5,
        isAvailable: true,
        bio: "Gömülü sistemler ve mikrodenetleyiciler konusunda derinlemesine bilgi sahibiyim. Donanım ve yazılım entegrasyonu üzerine çalışmaktan ve otonom sistemler geliştirmekten keyif alıyorum.",
        experiences: [
            {
                institution: "STM Savunma Teknolojileri",
                duration: "1 Yıl",
                description: "Otonom drone sistemleri için gömülü yazılım geliştirme ve sensör füzyonu çalışmaları.",
                order: 1
            },
            {
                institution: "Baykar Teknoloji",
                duration: "2 Yıl",
                description: "Aviyonik sistemler üzerine Ar-Ge mühendisi olarak görev aldım.",
                order: 2
            }
        ],
        competitions: [
            { name: "Teknofest Savaşan İHA", rank: "1.lik Ödülü" },
            { name: "TÜBİTAK 2242 Proje Yarışması", rank: "İlk 5" }
        ]
    },
    {
        id: 5,
        name: "Caner Erkin",
        title: "Mekanik Tasarım Mühendisi",
        department: "makine-muh",
        avatar: "",
        skills: ["SolidWorks", "Ansys", "AutoCAD", "Termodinamik"],
        projectCount: 7,
        top3Count: 0,
        isAvailable: false,
        bio: "Mekanik tasarım ve analiz konularında uzmanım. Yenilikçi mühendislik çözümleri geliştirme, 3D modelleme ve yapısal analiz konularında deneyim sahibiyim.",
        experiences: [
            {
                institution: "TUSAŞ (TAI)",
                duration: "2 Yıl",
                description: "Havacılık yapısal parçalarının mekanik tasarımı ve sonlu elemanlar analizi (FEA).",
                order: 1
            },
            {
                institution: "Ford Otosan",
                duration: "1 Yıl",
                description: "Motor parçalarının termal analizleri ve üretim süreçlerinin iyileştirilmesi.",
                order: 2
            }
        ],
        competitions: [
            { name: "Teknofest Robotaksi Binek Otonom", rank: "2.lik Ödülü" },
            { name: "FNSS MİLDEN Tasarım Yarışması", rank: "Mansiyon Ödülü" }
        ]
    },
];

// --- MOCK PROJELER ---
export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        title: "Otonom İHA İle Yangın Tespiti ve Müdahale Sistemi",
        owner: "Alptekin Ocakdan",
        summary: "Orman yangınlarını erken tespit edip otonom olarak müdahale edebilen bir İHA sistemi geliştiriyoruz.",
        participantsNeeded: 2,
        platform: "Teknofest",
        competition: "Savaşan İHA Yarışması",
        date: "2024-01-15",
        positions: [
            {
                id: "p1-1",
                department: "yazilim-muh",
                skills: ["Python", "OpenCV", "AI"],
                description: "Görüntü işleme algoritmaları üzerine çalışacak."
            },
            {
                id: "p1-2",
                department: "makine-muh",
                skills: ["SolidWorks", "Aerodinamik"],
                description: "İHA gövde tasarımı ve montajı."
            }
        ]
    },
    {
        id: 2,
        title: "Engelsiz Yaşam İçin Görüntü İşleme Destekli Gözlük",
        owner: "Ayşe Yılmaz",
        summary: "Görme engelli bireyler için nesne tanıma ve sesli asistan özellikli akıllı gözlük projesi.",
        participantsNeeded: 1,
        platform: "TÜBİTAK",
        competition: "2209-A Araştırma Projeleri",
        date: "2023-12-20",
        positions: [
            {
                id: "p2-1",
                department: "elektrik-elektronik",
                skills: ["Embedded Systems", "C++", "PCB Tasarım"],
                description: "Gözlük donanımı ve gömülü yazılım."
            }
        ]
    },
    {
        id: 3,
        title: "Blokzincir Tabanlı Tedarik Zinciri Yönetimi",
        owner: "Mehmet Demir",
        summary: "Gıda güvenliğini sağlamak amacıyla tarladan sofraya izlenebilirlik sağlayan dApp.",
        participantsNeeded: 3,
        platform: "Hackathon",
        competition: "Solana Global Hackathon",
        date: "2024-02-01",
        positions: [
            {
                id: "p3-1",
                department: "bilgisayar-muh",
                skills: ["Solidity", "Rust", "Smart Contracts"],
            },
            {
                id: "p3-2",
                department: "bilgisayar-muh",
                skills: ["React", "Web3.js"],
            },
            {
                id: "p3-3",
                department: "endustri-muh",
                skills: ["Lojistik", "Süreç Yönetimi"],
            }
        ]
    },
    {
        id: 4,
        title: "Yapay Zeka Destekli Tarımsal Verimlilik Analizi",
        owner: "Zeynep Kaya",
        summary: "Uydu görüntüleri ve sensör verileriyle tarlalardaki verimliliği artıran AI modeli.",
        participantsNeeded: 2,
        platform: "Teknofest",
        competition: "Tarım Teknolojileri Yarışması",
        date: "2023-11-10",
        positions: [
            {
                id: "p4-1",
                department: "yazilim-muh",
                skills: ["Python", "TensorFlow", "Data Analysis"],
            },
            {
                id: "p4-2",
                department: "elektrik-elektronik",
                skills: ["IoT", "Arduino", "Sensörler"],
            }
        ]
    },
    {
        id: 5,
        title: "Elektrikli Araçlar İçin Yüksek Verimli Batarya Yönetim Sistemi (BMS)",
        owner: "Caner Erkin",
        summary: "Li-ion bataryaların ömrünü uzatan ve güvenliğini artıran yerli BMS tasarımı.",
        participantsNeeded: 4,
        platform: "Teknofest",
        competition: "Efficiency Challenge",
        date: "2024-01-05",
        positions: [
            {
                id: "p5-1",
                department: "elektrik-elektronik",
                skills: ["Circuit Design", "Matlab", "Simulink"],
            },
            {
                id: "p5-2",
                department: "elektrik-elektronik",
                skills: ["PCB", "Altium"],
            },
            {
                id: "p5-3",
                department: "makine-muh",
                skills: ["Termal Analiz", "Ansys"],
            },
            {
                id: "p5-4",
                department: "yazilim-muh",
                skills: ["C", "Embedded Linux"],
            }
        ]
    },
];