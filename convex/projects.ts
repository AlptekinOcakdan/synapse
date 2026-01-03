import {v} from "convex/values";
import {query, mutation} from "./_generated/server";
import {Doc, Id} from "./_generated/dataModel";
import {SimpleUser} from "@/modules/dashboard/types";
import {paginationOptsValidator} from "convex/server";

// --- TİP TANIMLAMALARI (Senin verdiğin interface'ler ile uyumlu) ---
// Not: Bu tipleri normalde common/types.ts'den import edersin,
// ama burada bağımsız çalışması için referans alıyoruz.

type ProjectStatus = "ongoing" | "completed" | "recruiting" | "cancelled";

// --- YARDIMCI FONKSİYONLAR (MAPPING) ---

// Kullanıcı silinmişse veya bulunamazsa dönecek varsayılan obje
const DELETED_USER: SimpleUser = {
    id: "deleted" as Id<"users">, // Tip uyumluluğu için 'any' kullanıyoruz, bu obje özel bir durumdur.
    name: "Silinmiş Kullanıcı",
    avatar: "",
    department: "",
    title: "",
    city: null,
};

// --- QUERYLER ---
export const getProjects = query({
    // Backend artık pagination ayarlarını argüman olarak bekliyor
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        // 1. paginate() kullanarak veriyi parça parça çekiyoruz
        const result = await ctx.db
            .query("projects")
            .order("desc")
            .paginate(args.paginationOpts);

        // 2. Sadece o an çekilen sayfadaki (result.page) verileri map'liyoruz
        const pageWithDetails = await Promise.all(
            result.page.map(async (p) => {
                const owner = await ctx.db.get(p.ownerId);

                return {
                    id: p._id,
                    title: p.title,
                    summary: p.summary,
                    date: p.date,
                    status: p.status as ProjectStatus,
                    platform: p.platform,
                    competition: p.competition || "",
                    participantsNeeded: p.participantsNeeded,
                    needsAdvisor: p.needsAdvisor,
                    positions: p.positions,
                    participants: [] as SimpleUser[],
                    advisor: undefined,
                    owner: owner ? {
                        id: p.ownerId,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "",
                        city: owner.city,
                    } : DELETED_USER,
                };
            })
        );

        // 3. Pagination yapısını bozmadan page kısmını güncelleyip dönüyoruz
        return {
            ...result,
            page: pageWithDetails
        };
    },
});

export const getProject = query({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.id);
        if (!project) return null;

        const owner = await ctx.db.get(project.ownerId);
        if (!owner) return null;

        // Katılımcıları Çek
        const memberRelations = await ctx.db
            .query("projectMembers")
            .withIndex("by_project", (q) => q.eq("projectId", project._id))
            .collect();

        const participants = await Promise.all(
            memberRelations.map(async (rel) => {
                const user = await ctx.db.get(rel.userId);
                if (!user) return DELETED_USER; // Silinmiş kullanıcıları işle
                // mapToSimpleUser yerine ID'yi doğrudan atıyoruz
                return {
                    id: rel.userId,
                    name: `${user.firstName} ${user.lastName}`,
                    avatar: user.avatar || "",
                    department: user.department || "",
                    title: user.title || "",
                    city: user.city || null
                };
            })
        );

        // Danışman Bilgisi (Varsa)
        let advisorData = undefined;
        if (project.advisorId) {
            const advUser = await ctx.db.get(project.advisorId);
            if (advUser) {
                // Basitçe Academician tipine uygun hale getiriyoruz
                // Detaylı veri gerekirse burada hesaplanabilir
                advisorData = {
                    id: advUser._id,
                    name: `${advUser.firstName} ${advUser.lastName}`,
                    title: advUser.title || "Akademisyen",
                    department: advUser.department || "",
                    avatar: advUser.avatar || "",
                    email: advUser.email || "",
                    office: advUser.academicData?.office,
                    researchInterests: advUser.academicData?.researchInterests || [],
                    publicationsCount: advUser.academicData?.publicationsCount || 0,
                    citationCount: advUser.academicData?.citationCount || 0,
                    mentoredProjects: 0, // Ekstra sorgu gerekir, şimdilik 0
                    isAvailableForMentorship: advUser.academicData?.isAvailableForMentorship || false
                };
            }
        }

        return {
            id: project._id,
            title: project.title,
            summary: project.summary,
            status: project.status as "ongoing" | "completed" | "recruiting" | "cancelled",
            date: project.date,
            participantsNeeded: project.participantsNeeded,

            owner: {
                id: project.ownerId,
                name: `${owner.firstName} ${owner.lastName}`,
                avatar: owner.avatar || "",
                department: owner.department || "",
                title: owner.title || "Öğrenci",
                city: owner.city,
            },

            platform: project.platform || "Genel",
            competition: project.competition || "",
            needsAdvisor: project.needsAdvisor ?? false,
            positions: project.positions || [],
            participants: participants,
            advisor: advisorData
        };
    },
});

export const getMyProjects = query({
    args: {},
    handler: async (ctx) => {
        // 1. Kimlik Doğrulama
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) return [];

        // 2. Sahibi Olduğu Projeler (Owned)
        const ownedProjects = await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
            .collect();

        // 3. Katılımcı Olduğu Projeler (Participating)
        const memberships = await ctx.db
            .query("projectMembers")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Üye olunan projelerin detaylarını çek
        const memberProjectDocs = await Promise.all(
            memberships.map((m) => ctx.db.get(m.projectId))
        );

        // 4. Listeleri Birleştir ve Null Değerleri Temizle
        // Type Predicate (p is Doc<"projects">) kullanarak TS'i bilgilendiriyoruz
        const allRawProjects = [...ownedProjects, ...memberProjectDocs].filter(
            (p): p is Doc<"projects"> => p !== null
        );

        // Tekrar eden projeleri engelle
        // MAP TİPİNİ AÇIKÇA BELİRTİYORUZ: <string, Doc<"projects">>
        const uniqueProjectsMap = new Map<string, Doc<"projects">>();

        allRawProjects.forEach((p) => {
            if (p) uniqueProjectsMap.set(p._id, p);
        });

        const uniqueProjects = Array.from(uniqueProjectsMap.values());

        // 5. Frontend Formatına Dönüştür
        return await Promise.all(
            // p'nin Doc<"projects"> olduğunu açıkça belirtiyoruz
            uniqueProjects.map(async (p: Doc<"projects">) => {

                // owner değişkeninin Doc<"users"> veya null olduğunu belirtiyoruz
                const owner: Doc<"users"> | null = await ctx.db.get(p.ownerId);

                return {
                    id: p._id,
                    title: p.title,
                    summary: p.summary,
                    date: p.date,
                    status: p.status as ProjectStatus,
                    platform: p.platform,
                    competition: p.competition || "",
                    participantsNeeded: p.participantsNeeded,
                    needsAdvisor: p.needsAdvisor,
                    positions: p.positions,
                    participants: [],
                    advisor: undefined,
                    // Artık TS owner'ın User, p'nin Project olduğunu kesin olarak biliyor
                    owner: owner ? {
                        id: p.ownerId,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "",
                        city: owner.city,
                    } : DELETED_USER,
                };
            })
        );
    },
});

export const getCompetitions = query({
    args: {},
    handler: async (ctx) => {
        // 1. Fetch all projects (we only need the competition field really,
        // but convex doesn't support field selection in query yet, so we collect)
        const projects = await ctx.db.query("projects").collect();

        // 2. Extract unique competition names
        const uniqueCompetitions = new Set<string>();

        projects.forEach((p) => {
            if (p.competition) {
                uniqueCompetitions.add(p.competition);
            }
        });

        // 3. Return sorted array
        return Array.from(uniqueCompetitions).sort();
    },
});

export const createProject = mutation({
    args: {
        title: v.string(),
        summary: v.string(),
        competition: v.string(), // Frontend boş string gönderiyorsa v.string() kalsın, optional ise v.optional()
        status: v.string(), // "recruiting" vs.
        positions: v.array(
            v.object({
                id: v.string(), // Frontend'den gelen UUID
                department: v.string(),
                count: v.number(), // Sayı tipinde olmalı
                skills: v.array(v.string()), // Pozisyon özelindeki yetenekler
            })
        ),
    },
    handler: async (ctx, args) => {
        // 1. Kimlik Doğrulama
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Proje oluşturmak için giriş yapmalısınız.");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) throw new Error("Kullanıcı bulunamadı.");

        // 2. Arama Alanlarını (Search Fields) Otomatik Oluştur
        // Tüm pozisyonlardaki yetenekleri ve departmanları tek bir listede topluyoruz
        const allSkills = new Set<string>();
        const allDepartments = new Set<string>();

        args.positions.forEach((pos) => {
            allDepartments.add(pos.department);
            pos.skills.forEach((skill) => allSkills.add(skill));
        });

        // 3. Projeyi Kaydet
        const projectId = await ctx.db.insert("projects", {
            title: args.title,
            summary: args.summary,
            date: new Date().toISOString(),
            ownerId: user._id,
            advisorId: undefined, // Başlangıçta danışman yok
            status: args.status,
            platform: "Web/Mobile", // Varsayılan veya formdan eklenebilir
            competition: args.competition || undefined,
            participantsNeeded: args.positions.reduce((acc, curr) => acc + curr.count, 0), // Toplam ihtiyaç
            needsAdvisor: true, // Varsayılan

            // Hesaplanan arama alanları
            searchSkills: Array.from(allSkills),
            searchDepartments: Array.from(allDepartments),

            // Pozisyonlar (Veri temizliği: filled 0 olarak başlatılır)
            positions: args.positions.map(p => ({
                ...p,
                filled: 0,
                description: "" // Frontend'de yoksa boş
            })),
        });

        // 4. Proje Sahibini Üye Olarak Ekle (Lider)
        await ctx.db.insert("projectMembers", {
            projectId: projectId,
            userId: user._id,
            role: "Takım Lideri",
            joinedAt: new Date().toISOString(),
        });

        return projectId;
    },
});

export const getProjectsByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // 1. Kullanıcının üye olduğu projeleri bul
        const memberships = await ctx.db
            .query("projectMembers")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        // 2. Detayları topla
        const projectsWithDetails = await Promise.all(
            memberships.map(async (member) => {
                const project = await ctx.db.get(member.projectId);
                if (!project) return null;

                const owner = await ctx.db.get(project.ownerId);
                if (!owner) return null;

                // --- KATILIMCILARIN HAZIRLANMASI (SimpleUser Uyumlu) ---
                const allMembers = await ctx.db
                    .query("projectMembers")
                    .withIndex("by_project", (q) => q.eq("projectId", project._id))
                    .collect();

                const participants = await Promise.all(
                    allMembers.map(async (m) => {
                        const u = await ctx.db.get(m.userId);
                        if (!u) return null; // Null dönebiliriz, sonra filter'da temizleriz
                        return {
                            id: u._id,
                            name: u ? `${u.firstName} ${u.lastName}` : "Silinmiş Kullanıcı",
                            avatar: u?.avatar || "",
                            department: u?.department || "",
                            title: u?.title || "Öğrenci",
                            city: u.city,
                        };
                    })
                ).then(p => p.filter((u): u is SimpleUser => u !== null)); // Null'ları temizle

                // --- DANIŞMANIN HAZIRLANMASI (Academician Uyumlu) ---
                let advisorData = undefined;
                if (project.advisorId) {
                    const advUser = await ctx.db.get(project.advisorId);
                    if (advUser) {
                        // Danışmanın yönettiği proje sayısını hesapla
                        const mentoredCount = (await ctx.db
                            .query("projects")
                            .withIndex("by_advisor", (q) => q.eq("advisorId", project.advisorId))
                            .collect()).length;

                        // Academician Interface'ine tam uyum sağla
                        advisorData = {
                            id: advUser._id,
                            name: `${advUser.firstName} ${advUser.lastName}`,
                            title: advUser.title || "Akademisyen",
                            department: advUser.department || "",
                            avatar: advUser.avatar || "",
                            email: advUser.email || "",
                            office: advUser.academicData?.office,
                            researchInterests: advUser.academicData?.researchInterests || [],
                            publicationsCount: advUser.academicData?.publicationsCount || 0,
                            citationCount: advUser.academicData?.citationCount || 0,
                            mentoredProjects: mentoredCount,
                            isAvailableForMentorship: advUser.academicData?.isAvailableForMentorship || false
                        };
                    }
                }

                // --- PROJE POZİSYONLARI (ProjectPosition Uyumlu) ---
                // Veritabanındaki yapının ProjectPosition ile birebir uyumlu olduğunu varsayıyoruz.
                // Değilse burada map işlemi gerekir.
                const positions = project.positions || [];

                return {
                    id: project._id,
                    title: project.title,
                    summary: project.summary,

                    // Status string gelir, Frontend tipi ile eşleşmesi için cast ediyoruz
                    status: project.status as ProjectStatus,

                    platform: project.platform || "Web/Mobile",
                    competition: project.competition || "",
                    date: project.date,
                    participantsNeeded: project.participantsNeeded,

                    // Owner (SimpleUser Uyumlu)
                    owner: {
                        id: owner._id,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "Öğrenci",
                        city: owner.city,
                    },

                    positions: positions,
                    participants: participants,
                    needsAdvisor: project.needsAdvisor ?? false,

                    // Advisor (Academician | undefined Uyumlu)
                    advisor: advisorData
                };
            })
        );

        return projectsWithDetails
            .filter((p) => p !== null)
            .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());
    },
});

