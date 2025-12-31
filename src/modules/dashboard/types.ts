// types.ts

export interface Department {
    value: string;
    label: string;
}

// Yeni: Pozisyon/Rol Arayüzü
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
    participantsNeeded: number; // positions.length'e eşit olabilir veya sanal bir alan
    platform: string;
    competition: string;
    date: string;
    positions: ProjectPosition[]; // YENİ ALAN
}

// --- SABİTLER ---
export const DEPARTMENTS: Department[] = [
    {value: "bilgisayar-muh", label: "Bilgisayar Mühendisliği"},
    {value: "yazilim-muh", label: "Yazılım Mühendisliği"},
    {value: "elektrik-elektronik", label: "Elektrik Elektronik Müh."},
    {value: "endustri-muh", label: "Endüstri Mühendisliği"},
    {value: "makine-muh", label: "Makine Mühendisliği"},
];

// --- GÜNCELLENMİŞ MOCK VERİLER ---
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