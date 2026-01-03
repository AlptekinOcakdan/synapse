"use client";

import { UserProfile } from "@/modules/dashboard/types";
import { ProjectCard } from "@/modules/dashboard/ui/components/projects/project-card";
import { Loader2 } from "lucide-react";

// --- CONVEX IMPORTS ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const ProjectsTab = ({ user }: { user: UserProfile }) => {

    // 1. Backend'den kullanıcının projelerini çek
    // user.id string olarak geliyor olabilir, Convex ID'ye cast ediyoruz.
    const userProjects = useQuery(api.projects.getProjectsByUser, {
        userId: user.id as Id<"users">
    });

    // 2. Yükleniyor Durumu
    if (userProjects === undefined) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {userProjects.length > 0 ? (
                userProjects.map((project) => (
                    // Not: ProjectCard artık currentUserId prop'una ihtiyaç duymuyor.
                    <ProjectCard
                        key={project.id}
                        project={project }
                    />
                ))
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                    <p>Bu kullanıcının henüz bir projesi bulunmuyor.</p>
                </div>
            )}
        </div>
    );
};