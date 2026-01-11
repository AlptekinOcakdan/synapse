import {v} from "convex/values";
import {query, mutation} from "./_generated/server";
import {Doc, Id} from "./_generated/dataModel";
import {SimpleUser} from "@/modules/dashboard/types";
import {paginationOptsValidator} from "convex/server";

type ProjectStatus = "ongoing" | "completed" | "recruiting" | "cancelled";

const DELETED_USER: SimpleUser = {
    id: "deleted" as Id<"users">,
    name: "Silinmiş Kullanıcı",
    avatar: "",
    department: "",
    title: "",
    city: null,
    role: "Bilinmiyor",
};

export const getProjects = query({
    args: {
        paginationOpts: paginationOptsValidator,
        userId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query("projects")
            .order("desc")
            .paginate(args.paginationOpts);

        // Aktif kullanıcının projelerini (sahibi olduğu veya üyesi olduğu) liste dışı bırak.
        // Not: paginate sonrası filtre olduğu için sayfa boyu küçülebilir; UI tarafı zaten loadMore ile ilerliyor.
        const currentUserId = args.userId;

        const filteredPage = currentUserId
            ? await (async () => {
                const out: Doc<"projects">[] = [];
                for (const p of result.page) {
                    if (p.ownerId === currentUserId) continue;
                    const membership = await ctx.db
                        .query("projectMembers")
                        .withIndex("by_project_user", (q) => q.eq("projectId", p._id).eq("userId", currentUserId))
                        .unique();
                    if (membership) continue;
                    out.push(p);
                }
                return out;
            })()
            : result.page;

        const pageWithDetails = await Promise.all(
            filteredPage.map(async (p) => {
                const owner = await ctx.db.get(p.ownerId);

                const memberRelations = await ctx.db
                    .query("projectMembers")
                    .withIndex("by_project", (q) => q.eq("projectId", p._id))
                    .collect();

                const ownerMember = memberRelations.find(m => m.userId === p.ownerId);

                const participants = await Promise.all(
                    memberRelations.map(async (rel) => {
                        const u = await ctx.db.get(rel.userId);
                        if (!u) return DELETED_USER;
                        return {
                            id: u._id,
                            name: `${u.firstName} ${u.lastName}`,
                            avatar: u.avatar || "",
                            department: u.department || "",
                            title: u.title || "",
                            city: u.city,
                            role: rel.role || "Üye",
                        } as SimpleUser;
                    })
                );

                // Advisor: öncelik project.advisorId, yoksa projedeki ilk akademisyen üye.
                let advisorUserId: Id<"users"> | undefined = p.advisorId;
                if (!advisorUserId) {
                    for (const rel of memberRelations) {
                        const u = await ctx.db.get(rel.userId);
                        if (u?.role === "academician") {
                            advisorUserId = u._id;
                            break;
                        }
                    }
                }

                let advisorData = undefined;
                if (advisorUserId) {
                    const advUser = await ctx.db.get(advisorUserId);
                    if (advUser) {
                        const mentoredCount = (await ctx.db
                            .query("projects")
                            .withIndex("by_advisor", (q) => q.eq("advisorId", advisorUserId))
                            .collect()).length;

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
                    participants,
                    advisor: advisorData,
                    owner: owner ? {
                        id: p.ownerId,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "",
                        city: owner.city,
                        role: ownerMember?.role || "Takım Lideri",
                    } : DELETED_USER,
                };
            })
        );

        return {
            ...result,
            // filtered page’i dönüyoruz
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

        const memberRelations = await ctx.db
            .query("projectMembers")
            .withIndex("by_project", (q) => q.eq("projectId", project._id))
            .collect();

        const ownerMember = memberRelations.find(m => m.userId === project.ownerId);

        const participants = await Promise.all(
            memberRelations.map(async (rel) => {
                const user = await ctx.db.get(rel.userId);
                if (!user) return DELETED_USER;
                return {
                    id: rel.userId,
                    name: `${user.firstName} ${user.lastName}`,
                    avatar: user.avatar || "",
                    department: user.department || "",
                    title: user.title || "",
                    city: user.city || null,
                    role: rel.role
                };
            })
        );

        let advisorData = undefined;
        if (project.advisorId) {
            const advUser = await ctx.db.get(project.advisorId);
            if (advUser) {
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
                    mentoredProjects: 0,
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
                role: ownerMember?.role || "Takım Lideri",
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
    args: {userId: v.id("users")},
    handler: async (ctx,args) => {

        const user = await ctx.db.get(args.userId);

        if (!user) return [];

        const ownedProjects = await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
            .collect();

        const memberships = await ctx.db
            .query("projectMembers")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const memberProjectDocs = await Promise.all(
            memberships.map((m) => ctx.db.get(m.projectId))
        );

        const allRawProjects = [...ownedProjects, ...memberProjectDocs].filter(
            (p): p is Doc<"projects"> => p !== null
        );

        const uniqueProjectsMap = new Map<string, Doc<"projects">>();

        allRawProjects.forEach((p) => {
            if (p) uniqueProjectsMap.set(p._id, p);
        });

        const uniqueProjects = Array.from(uniqueProjectsMap.values());

        return await Promise.all(
            uniqueProjects.map(async (p: Doc<"projects">) => {

                const owner: Doc<"users"> | null = await ctx.db.get(p.ownerId);

                const memberRelations = await ctx.db
                    .query("projectMembers")
                    .withIndex("by_project", (q) => q.eq("projectId", p._id))
                    .collect();

                const ownerMember = memberRelations.find(m => m.userId === p.ownerId);

                const participants = await Promise.all(
                    memberRelations.map(async (rel) => {
                        const u = await ctx.db.get(rel.userId);
                        if (!u) return DELETED_USER;
                        return {
                            id: u._id,
                            name: `${u.firstName} ${u.lastName}`,
                            avatar: u.avatar || "",
                            department: u.department || "",
                            title: u.title || "",
                            city: u.city,
                            role: rel.role || "Üye",
                        } as SimpleUser;
                    })
                );

                // Advisor: öncelik project.advisorId, yoksa projedeki ilk akademisyen üye.
                let advisorUserId: Id<"users"> | undefined = p.advisorId;
                if (!advisorUserId) {
                    const academicianRel = await (async () => {
                        for (const rel of memberRelations) {
                            const u = await ctx.db.get(rel.userId);
                            if (u?.role === "academician") return { rel, u };
                        }
                        return null;
                    })();
                    advisorUserId = academicianRel?.u?._id;
                }

                let advisorData = undefined;
                if (advisorUserId) {
                    const advUser = await ctx.db.get(advisorUserId);
                    if (advUser) {
                        const mentoredCount = (await ctx.db
                            .query("projects")
                            .withIndex("by_advisor", (q) => q.eq("advisorId", advisorUserId))
                            .collect()).length;

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
                    participants,
                    advisor: advisorData,
                    owner: owner ? {
                        id: owner._id,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "",
                        city: owner.city,
                        role: ownerMember?.role || "Takım Lideri",
                    } : DELETED_USER,
                };
            })
        );
    },
});

export const getCompetitions = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db.query("projects").collect();

        const uniqueCompetitions = new Set<string>();

        projects.forEach((p) => {
            if (p.competition) {
                uniqueCompetitions.add(p.competition);
            }
        });

        return Array.from(uniqueCompetitions).sort();
    },
});

export const createProject = mutation({
    args: {
        userId: v.id("users"),
        title: v.string(),
        summary: v.string(),
        competition: v.string(),
        status: v.union(v.literal("recruiting"), v.literal("ongoing"), v.literal("completed"), v.literal("cancelled")),
        positions: v.array(
            v.object({
                id: v.string(),
                department: v.string(),
                count: v.number(),
                skills: v.array(v.string()),
            })
        ),
        advisorId: v.optional(v.id("users")),
        needsAdvisor: v.boolean(),
        platform: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("Kullanıcı bulunamadı.");

        let advisorIdToSet: Id<"users"> | undefined = undefined;
        if (args.advisorId) {
            const advUser = await ctx.db.get(args.advisorId);
            if (advUser) {
                advisorIdToSet = args.advisorId;
            }
        }

        const allSkills = new Set<string>();
        const allDepartments = new Set<string>();

        args.positions.forEach((pos) => {
            allDepartments.add(pos.department);
            pos.skills.forEach((skill) => allSkills.add(skill));
        });

        const projectId = await ctx.db.insert("projects", {
            title: args.title,
            summary: args.summary,
            date: new Date().toISOString(),
            ownerId: user._id,
            advisorId: advisorIdToSet,
            status: args.status,
            platform: args.platform || "",
            competition: args.competition || undefined,
            participantsNeeded: args.positions.reduce((acc, curr) => acc + curr.count, 0),
            needsAdvisor: args.needsAdvisor,

            searchSkills: Array.from(allSkills),
            searchDepartments: Array.from(allDepartments),

            positions: args.positions.map(p => ({
                ...p,
                filled: 0,
                description: ""
            })),
        });

        await ctx.db.insert("projectMembers", {
            projectId: projectId,
            userId: user._id,
            role: "Takım Lideri",
            joinedAt: new Date().toISOString(),
        });

        return projectId;
    },
});

export const updateProject = mutation({
    args: {
        userId: v.id("users"),
        projectId: v.id("projects"),
        title: v.string(),
        summary: v.string(),
        competition: v.string(),
        status: v.union(v.literal("recruiting"), v.literal("ongoing"), v.literal("completed"), v.literal("cancelled")),
        needsAdvisor: v.boolean(),
        positions: v.optional(v.array(
            v.object({
                id: v.string(),
                department: v.string(),
                count: v.number(),
                filled: v.number(),
                skills: v.array(v.string()),
                description: v.optional(v.string())
            })
        )),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("Kullanıcı bulunamadı.");
        }

        const project = await ctx.db.get(args.projectId);
        if (!project) {
            throw new Error("Proje bulunamadı.");
        }

        if (project.ownerId !== user._id) {
            throw new Error("Yetkilendirme hatası: Bu projeyi sadece sahibi düzenleyebilir.");
        }

        // `userId` ve `projectId` tablo alanı değil; patch'e gönderilmemeli.
        const { userId: _userId, projectId: _projectId, ...updates } = args;

        // Pozisyonlar güncelleniyorsa, ilgili arama alanlarını da güncelle
        if (updates.positions) {
            const allSkills = new Set<string>();
            const allDepartments = new Set<string>();
            let totalNeeded = 0;

            updates.positions.forEach((pos) => {
                allDepartments.add(pos.department);
                pos.skills.forEach((skill) => allSkills.add(skill));
                totalNeeded += pos.count;
            });

            (updates as Partial<Doc<"projects">>).searchSkills = Array.from(allSkills);
            (updates as Partial<Doc<"projects">>).searchDepartments = Array.from(allDepartments);
            (updates as Partial<Doc<"projects">>).participantsNeeded = totalNeeded;
        }


        await ctx.db.patch(args.projectId, updates);

        return { success: true };
    },
});


export const getProjectsByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const memberships = await ctx.db
            .query("projectMembers")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const projectsWithDetails = await Promise.all(
            memberships.map(async (member) => {
                const project = await ctx.db.get(member.projectId);
                if (!project) return null;

                const owner = await ctx.db.get(project.ownerId);
                if (!owner) return null;

                const allMembers = await ctx.db
                    .query("projectMembers")
                    .withIndex("by_project", (q) => q.eq("projectId", project._id))
                    .collect();

                const ownerMember = allMembers.find(m => m.userId === project.ownerId);

                const participants = await Promise.all(
                    allMembers.map(async (m) => {
                        const u = await ctx.db.get(m.userId);
                        if (!u) return null;
                        return {
                            id: u._id,
                            name: u ? `${u.firstName} ${u.lastName}` : "Silinmiş Kullanıcı",
                            avatar: u?.avatar || "",
                            department: u?.department || "",
                            title: u?.title || "Öğrenci",
                            city: u.city,
                            role: m.role || "Üye",
                        };
                    })
                ).then(p => p.filter((u): u is SimpleUser => u !== null));

                let advisorData = undefined;
                if (project.advisorId) {
                    const advUser = await ctx.db.get(project.advisorId);
                    if (advUser) {
                        const mentoredCount = (await ctx.db
                            .query("projects")
                            .withIndex("by_advisor", (q) => q.eq("advisorId", project.advisorId))
                            .collect()).length;

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

                const positions = project.positions || [];

                return {
                    id: project._id,
                    title: project.title,
                    summary: project.summary,

                    status: project.status as ProjectStatus,

                    platform: project.platform || "Web/Mobile",
                    competition: project.competition || "",
                    date: project.date,
                    participantsNeeded: project.participantsNeeded,

                    owner: {
                        id: project.ownerId,
                        name: `${owner.firstName} ${owner.lastName}`,
                        avatar: owner.avatar || "",
                        department: owner.department || "",
                        title: owner.title || "Öğrenci",
                        city: owner.city,
                        role: ownerMember?.role || "Takım Lideri",
                    },

                    positions: positions,
                    participants: participants,
                    needsAdvisor: project.needsAdvisor ?? false,

                    advisor: advisorData
                };
            })
        );

        return projectsWithDetails
            .filter((p) => p !== null)
            .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());
    },
});

