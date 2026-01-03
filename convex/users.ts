import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {paginationOptsValidator} from "convex/server";
import {Academician, UserProfile} from "@/modules/dashboard/types";

export const getProfiles = query({
    args: {
        paginationOpts: paginationOptsValidator,
        searchQuery: v.string(),
        departments: v.array(v.string()),
        skills: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        let results;

        // 1. ARAMA VE SAYFALAMA
        if (args.searchQuery) {
            results = await ctx.db
                .query("users")
                .withSearchIndex("search_name", (q) =>
                    q.search("firstName", args.searchQuery)
                )
                .paginate(args.paginationOpts);
        } else {
            results = await ctx.db
                .query("users")
                .order("desc")
                .paginate(args.paginationOpts);
        }

        // 2. DETAYLARI DOLDUR (MAPPING)
        const profilesWithStats = await Promise.all(
            results.page.map(async (user): Promise<UserProfile | null> => {

                // --- FİLTRELEME MANTIĞI ---

                // A) İsim/Unvan Araması (Search Index yetmezse diye JS kontrolü)
                if (args.searchQuery) {
                    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                    const title = (user.title || "").toLowerCase();
                    const query = args.searchQuery.toLowerCase();

                    // Eğer search index bulduysa sorun yok, ama bulamadıysa ve biz soyisimde arıyorsak:
                    // (Not: Basitlik için sadece firstName index kullandık, burası ekstra güvenlik)
                    if (!fullName.includes(query) && !title.includes(query)) {
                        // return null;
                    }
                }

                // B) Departman Filtresi
                if (args.departments.length > 0) {
                    if (!user.department || !args.departments.includes(user.department)) return null;
                }

                // C) Yetenek Filtresi
                if (args.skills.length > 0) {
                    const userSkills = (user.skills || []).map(s => s.toLowerCase());
                    const hasSkill = args.skills.some(searchSkill =>
                        userSkills.some(us => us.includes(searchSkill.toLowerCase()))
                    );
                    if (!hasSkill) return null;
                }

                // --- İSTATİSTİK HESAPLAMA ---
                const memberships = await ctx.db
                    .query("projectMembers")
                    .withIndex("by_user", q => q.eq("userId", user._id))
                    .collect();

                const projectCount = memberships.length;
                // Şimdilik aktif proje mantığı basit tutuldu
                const top3Count = Math.floor(projectCount / 2);

                // --- OBJE OLUŞTURMA (Strict Typing) ---
                return {
                    // SimpleUser Alanları
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    avatar: user.avatar || "", // string istediği için fallback
                    department: user.department || "",
                    title: user.title || "",
                    city: user.city || null,

                    // UserProfile Alanları
                    email: user.email,
                    bio: user.bio || "",
                    skills: user.skills || [],
                    isAvailable: user.isAvailable ?? false,
                    projectCount: projectCount,
                    top3Count: top3Count,

                    // Nested Objeler (Typesafe Mapping)
                    socialLinks: user.socialLinks ? {
                        github: user.socialLinks.github,
                        linkedin: user.socialLinks.linkedin,
                        twitter: user.socialLinks.twitter,
                        personalWebsite: user.socialLinks.personalWebsite
                    } : undefined,

                    experiences: (user.experiences || []).map(exp => ({
                        institution: exp.institution,
                        duration: exp.duration,
                        description: exp.description,
                        role: exp.role,
                        order: exp.order
                    })),

                    competitions: (user.competitions || []).map(comp => ({
                        name: comp.name,
                        rank: comp.rank,
                        date: comp.date
                    })),

                    certificates: user.certificates || []
                };
            })
        );

        // Null (filtrelenen) değerleri temizle ve tipini doğrula
        const filteredPage = profilesWithStats.filter((p): p is UserProfile => p !== null);

        return {
            ...results,
            page: filteredPage
        };
    },
});

export const getDepartments = query({
    args: {},
    handler: async (ctx) => {
        // 1. Fetch all users (or just necessary fields to save bandwidth)
        const users = await ctx.db.query("users").collect();

        // 2. Extract unique departments using a Set
        const uniqueDepartments = new Set<string>();
        users.forEach((u) => {
            if (u.department) {
                uniqueDepartments.add(u.department);
            }
        });

        // 3. Format for the frontend { value, label }
        // We use the department name as the value too, to ensure database matching works easily
        return Array.from(uniqueDepartments).sort().map((dept) => ({
            value: dept,
            label: dept
        }));
    },
});

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();
    },
});

export const getAcademicians = query({
    args: {
        searchQuery: v.string(),
        department: v.string(), // "all" veya belirli bir bölüm
    },
    handler: async (ctx, args) => {
        // 1. Sadece Akademisyenleri Çek (Role göre index kullanıyoruz)
        const users = await ctx.db
            .query("users")
            .withIndex("by_role", (q) => q.eq("role", "academician"))
            .collect();

        // 2. Hafızada Filtreleme (Convex filtreleri karmaşık OR mantığı için JS tarafında daha esnektir)
        const filteredUsers = users.filter((user) => {
            // Bölüm Kontrolü
            if (args.department !== "all" && user.department !== args.department) {
                return false;
            }

            // Arama Kontrolü (İsim veya İlgi Alanı)
            if (args.searchQuery) {
                const query = args.searchQuery.toLowerCase();
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

                // Araştırma alanlarında arama (optional olduğu için güvenli erişim)
                const interestsMatch = user.academicData?.researchInterests?.some(
                    (tag) => tag.toLowerCase().includes(query)
                ) || false;

                return fullName.includes(query) || interestsMatch;
            }

            return true;
        });

        // 3. Frontend Formatına Dönüştür ve Proje Sayılarını Hesapla
        return await Promise.all(
            filteredUsers.map(async (user): Promise<Academician> => {
                // Danışmanlık yaptığı projeleri say
                // (advisorId'si bu kullanıcı olan projeler)
                const mentoredProjects = await ctx.db
                    .query("projects")
                    .withIndex("by_advisor", (q) => q.eq("advisorId", user._id))
                    .collect();

                return {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    title: user.title || "",
                    department: user.department || "",
                    avatar: user.avatar || "",
                    email: user.email || "",
                    office: user.academicData?.office,
                    researchInterests: user.academicData?.researchInterests || [],
                    publicationsCount: user.academicData?.publicationsCount || 0,
                    citationCount: user.academicData?.citationCount || 0,
                    mentoredProjects: mentoredProjects.length,
                    isAvailableForMentorship: user.academicData?.isAvailableForMentorship || false,
                };
            })
        );
    },
});

export const getViewerProfile = query({
    // ARTIK CONVEX KİMLİĞİ BİLMEDİĞİ İÇİN ID'Yİ BİZ GÖNDERİYORUZ
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // ctx.auth.getUserIdentity() ARTIK YOK!

        const user = await ctx.db.get(args.userId);

        if (!user) return null;

        // --- İstatistikleri Hesapla ---
        const memberships = await ctx.db
            .query("projectMembers")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const projectCount = memberships.length;
        const top3Count = 0; // Bu mantık daha sonra eklenecek

        return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar || "",
            title: user.title || "Ünvan Belirtilmemiş",
            department: user.department || "",
            city: user.city, // EKLENDİ
            bio: user.bio || "",
            skills: user.skills || [],
            socialLinks: {
                github: user.socialLinks?.github,
                linkedin: user.socialLinks?.linkedin,
                twitter: user.socialLinks?.twitter,
                personalWebsite: user.socialLinks?.personalWebsite,
            },
            experiences: user.experiences || [],
            competitions: user.competitions || [],
            isAvailable: user.isAvailable ?? false,
            email: user.email,
            role: user.role,
            projectCount: projectCount,
            top3Count: top3Count,
            certificates: user.certificates || [],
        } as UserProfile; // Frontend tipiyle uyumluluğu garantile
    },
});

export const updateProfile = mutation({
    args: {
        userId: v.id("users"), // Kimin güncelleneceği
        name: v.string(),
        title: v.string(),
        bio: v.string(),
        avatar: v.optional(v.string()),
        skills: v.array(v.string()),
        socialLinks: v.object({
            github: v.optional(v.string()),
            linkedin: v.optional(v.string()),
            twitter: v.optional(v.string()),
            personalWebsite: v.optional(v.string()),
        })
    },
    handler: async (ctx, args) => {
        // 1. ctx.auth KULLANILMIYOR (Custom Auth'ta token yok)
        // Bunun yerine direkt gönderilen ID'ye güveniyoruz.

        // 2. Kullanıcıyı ID ile Bul
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("Kullanıcı bulunamadı.");
        }

        // 3. İsim Ayrıştırma
        const nameParts = args.name.trim().split(" ");
        const lastName = nameParts.length > 1 ? nameParts.pop() : "";
        const firstName = nameParts.join(" ");

        // 4. Güncelleme
        await ctx.db.patch(user._id, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            title: args.title,
            bio: args.bio,
            skills: args.skills,
            avatar: args.avatar || user.avatar,
            socialLinks: args.socialLinks
        });

        return { success: true };
    },
});

export const updateOverview = mutation({
    args: {
        userId: v.id("users"), // Kimin güncelleneceği

        // Opsiyonel alanlar (Hepsini göndermek zorunda değiliz)
        bio: v.optional(v.string()),
        competitions: v.optional(v.array(
            v.object({
                name: v.string(),
                rank: v.string(),
                date: v.optional(v.string())
            })
        )),
    },
    handler: async (ctx, args) => {
        // 1. Kullanıcıyı doğrula (ID veritabanında var mı?)
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("Kullanıcı bulunamadı.");

        // 2. Güncelleme Objesi Hazırla
        const updates: any = {};

        // Eğer bio gönderildiyse güncelleme listesine ekle
        if (args.bio !== undefined) updates.bio = args.bio;

        // Eğer competitions gönderildiyse güncelleme listesine ekle
        if (args.competitions !== undefined) updates.competitions = args.competitions;

        // 3. Veritabanını Patch'le (Sadece değişen alanları yazar)
        await ctx.db.patch(args.userId, updates);
    },
});

export const updateExperiences = mutation({
    args: {
        userId: v.id("users"),
        experiences: v.array(
            v.object({
                role: v.string(), // Opsiyoneldi ama formda zorunlu, string yapıyoruz
                institution: v.string(),
                duration: v.string(),
                description: v.string(),
                order: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        // 1. Kullanıcıyı doğrula
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("Kullanıcı bulunamadı.");

        // 2. Deneyimleri güncelle (Patch)
        // Frontend'den gelen sıralanmış listeyi olduğu gibi kaydediyoruz.
        await ctx.db.patch(args.userId, {
            experiences: args.experiences,
        });
    },
});

export const getBasicUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        return {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: user.avatar || "",
            role: user.role
        };
    },
});