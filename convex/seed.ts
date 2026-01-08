import { internalMutation } from "./_generated/server";

const departmentsData = [
    // Mühendislik Fakültesi
    { label: "Bilgisayar Mühendisliği" },
    { label: "Yazılım Mühendisliği" },
    { label: "Elektrik-Elektronik Mühendisliği" },
    { label: "Endüstri Mühendisliği" },
    { label: "İnşaat Mühendisliği" },
    { label: "Makine Mühendisliği" },
    // Tıp Fakültesi
    { label: "Tıp" },
    // Hukuk Fakültesi
    { label: "Hukuk" },
    // İşletme Fakültesi
    { label: "İşletme" },
    { label: "Ekonomi" },
    // Fen-Edebiyat Fakültesi
    { label: "Psikoloji" },
    { label: "Sosyoloji" },
    { label: "Matematik" },
    // Veterinerlik Fakültesi
    { label: "Veteriner Hekimliği" },
    // Diğer
    { label: "Diğer" },
];

export const seedDepartments = internalMutation({
    handler: async (ctx) => {
        // Tablonun boş olup olmadığını kontrol et
        const anyDepartment = await ctx.db.query("departments").first();

        if (anyDepartment) {
            console.log("Departmanlar tablosu zaten dolu. Seed işlemi atlandı.");
            return;
        }

        console.log("Departmanlar tablosu dolduruluyor...");

        // Verileri ekle
        for (const dept of departmentsData) {
            await ctx.db.insert("departments", {
                label: dept.label,
            });
        }

        console.log(`${departmentsData.length} departman eklendi.`);
    },
});


export const seedEvents = internalMutation({
    handler: async (ctx) => {
        const anyEvent = await ctx.db.query("events").first();
        if (anyEvent) {
            console.log("Etkinlikler tablosu zaten dolu. Seed işlemi atlandı.");
            return;
        }

        console.log("Etkinlikler tablosu dolduruluyor...");

        const users = await ctx.db.query("users").collect();
        if (users.length === 0) {
            console.log("Katılımcı olarak eklenecek kullanıcı bulunamadı. Etkinlik seed işlemi atlandı.");
            return;
        }

        const now = new Date();
        const oneMonth = 30 * 24 * 60 * 60 * 1000;

        const eventsData = [
            // --- Tamamlanmış Etkinlikler (Ended) ---
            {
                title: "React ile Modern Web Geliştirme Atölyesi",
                description: "React'in temellerinden başlayarak, state yönetimi ve hooks gibi ileri düzey konulara kadar her şeyi kapsayan bir atölye.",
                date: new Date(now.getTime() - oneMonth * 2).getTime(),
                status: "ended" as const,
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&q=80",
                platform: "YouTube",
                url: "https://youtube.com",
                duration: "2 saat",
                tags: ["React", "Web Geliştirme", "Frontend"],
            },
            {
                title: "Proje Yönetiminde Agile Metodolojileri",
                description: "Scrum ve Kanban gibi çevik metodolojilerin proje başarısına etkilerini ve pratik uygulama yöntemlerini öğrenin.",
                date: new Date(now.getTime() - oneMonth * 1.5).getTime(),
                status: "ended" as const,
                thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1280&q=80",
                platform: "Zoom",
                url: "https://zoom.us",
                duration: "1 saat 30 dakika",
                tags: ["Agile", "Proje Yönetimi", "Scrum"],
            },
            {
                title: "Python ile Veri Bilimine Giriş",
                description: "Veri biliminin temellerini, Pandas ve NumPy kütüphanelerini kullanarak Python ile nasıl uygulayacağınızı keşfedin.",
                date: new Date(now.getTime() - oneMonth).getTime(),
                status: "ended" as const,
                thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1280&q=80",
                platform: "Google Meet",
                url: "https://meet.google.com",
                duration: "2 saat 15 dakika",
                tags: ["Python", "Veri Bilimi", "AI"],
            },
            {
                title: "UI/UX Tasarımının Temel Prensipleri",
                description: "Kullanıcı dostu ve estetik arayüzler tasarlamak için gereken temel UI/UX prensipleri üzerine bir başlangıç eğitimi.",
                date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).getTime(),
                status: "ended" as const,
                thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1280&q=80",
                platform: "YouTube",
                url: "https://youtube.com",
                duration: "1 saat",
                tags: ["UI/UX", "Tasarım", "Figma"],
            },
            {
                title: "Girişimcilik 101: Fikirden Ürüne",
                description: "Bir iş fikrini nasıl hayata geçireceğinizi, pazar araştırması ve MVP oluşturma süreçlerini anlatan ilham verici bir seminer.",
                date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime(),
                status: "ended" as const,
                thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1280&q=80",
                platform: "Zoom",
                url: "https://zoom.us",
                duration: "1 saat 45 dakika",
                tags: ["Girişimcilik", "Startup", "İş Geliştirme"],
            },
            // --- Planlanan Etkinlikler (Upcoming) ---
            {
                title: "Node.js ile Backend Geliştirme",
                description: "Node.js, Express ve MongoDB kullanarak sıfırdan bir REST API nasıl oluşturulur? Adım adım öğrenin.",
                date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).getTime(),
                status: "upcoming" as const,
                thumbnail: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1280&q=80",
                platform: "Google Meet",
                url: "https://meet.google.com",
                duration: "2 saat",
                tags: ["Node.js", "Backend", "API"],
            },
            {
                title: "Flutter ile Mobil Uygulama Geliştirme Kampı",
                description: "Tek bir kod tabanıyla hem iOS hem de Android için nasıl harika mobil uygulamalar geliştirebileceğinizi keşfedin.",
                date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).getTime(),
                status: "upcoming" as const,
                thumbnail: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1280&q=80",
                platform: "YouTube",
                url: "https://youtube.com",
                duration: "3 saat",
                tags: ["Flutter", "Mobil Geliştirme", "Dart"],
            },
            {
                title: "Teknofest Projeleri için Sunum Teknikleri",
                description: "Projenizi jüriye en etkili şekilde nasıl sunarsınız? Etkili sunum hazırlama ve sunma teknikleri üzerine bir eğitim.",
                date: new Date(now.getTime() + oneMonth).getTime(),
                status: "upcoming" as const,
                thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1280&q=80",
                platform: "Zoom",
                url: "https://zoom.us",
                duration: "1 saat 15 dakika",
                tags: ["Teknofest", "Sunum", "Yarışma"],
            },
            {
                title: "Derin Öğrenme ve Sinir Ağlarına Giriş",
                description: "Yapay zekanın en heyecan verici alanı olan derin öğrenmenin temellerini ve TensorFlow ile ilk modelinizi nasıl oluşturacağınızı öğrenin.",
                date: new Date(now.getTime() + oneMonth * 1.5).getTime(),
                status: "upcoming" as const,
                thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&q=80",
                platform: "Google Meet",
                url: "https://meet.google.com",
                duration: "2 saat 30 dakika",
                tags: ["AI", "Derin Öğrenme", "TensorFlow"],
            },
            {
                title: "Kariyer Paneli: Teknoloji Liderleriyle Söyleşi",
                description: "Sektörün önde gelen teknoloji liderlerinden kariyer tavsiyeleri alın, sorularınızı sorun ve ilham alın.",
                date: new Date(now.getTime() + oneMonth * 2).getTime(),
                status: "upcoming" as const,
                thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1280&q=80",
                platform: "YouTube",
                url: "https://youtube.com",
                duration: "1 saat 30 dakika",
                tags: ["Kariyer", "Söyleşi", "Teknoloji"],
            },
        ];

        for (const event of eventsData) {
            // 1 veya 2 rastgele katılımcı (konuşmacı) seç
            const numParticipants = Math.floor(Math.random() * 2) + 1;
            const eventParticipants = [];
            const usedIndices = new Set();

            for (let i = 0; i < numParticipants; i++) {
                let userIndex;
                do {
                    userIndex = Math.floor(Math.random() * users.length);
                } while (usedIndices.has(userIndex));
                usedIndices.add(userIndex);

                const user = users[userIndex];
                eventParticipants.push({
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role === "academician" ? "Akademisyen" : "Konuşmacı",
                    avatar: user.avatar || "",
                    userId: user._id,
                });
            }

            await ctx.db.insert("events", {
                ...event,
                participants: eventParticipants,
            });
        }

        console.log(`${eventsData.length} etkinlik eklendi.`);
    },
});
