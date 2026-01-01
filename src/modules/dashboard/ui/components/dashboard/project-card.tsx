// modules/dashboard/components/dashboard/project-card.tsx
"use client";

import { ArrowRight, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "../../../types";
import { ApplyProjectDialog } from "./apply-project-dialog";
// useRouter ve usePathname, useSearchParams ekleyin
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleOpenDetails = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("projectId", String(project.id));

        // Modal açılırken sayfanın kaymasını (scroll jump) engellemek için { scroll: false }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Card className="hover:border-primary/50 transition-colors group">
            <CardContent className="p-4 sm:p-6 w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between items-start lg:items-center">

                    {/* ... Sol taraf (İçerik) aynı kalıyor ... */}
                    <div className="space-y-3 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-normal group-hover:border-primary/30 transition-colors">
                                {project.platform}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                                • {project.competition}
                            </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold pr-0 lg:pr-4 w-full">
                            {project.title}
                        </h3>

                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 sm:gap-4">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span className="truncate">{project.owner.name}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                                <Trophy className="w-3.5 h-3.5" />
                                Aranan: {project.participantsNeeded}
                            </span>
                        </div>
                    </div>


                    <div className="flex flex-row items-start gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                        {/* Eski kullanım: <ProjectDetailsDialog ...> <Button>... </ProjectDetailsDialog>
                            Yeni kullanım: Sadece Button ve onClick eventi.
                        */}
                        <Button variant="outline" className="w-fit" onClick={handleOpenDetails}>
                            Detaylar
                        </Button>

                        {/* Başvuru Modalı aynı kalabilir veya onu da URL'e taşıyabilirsiniz */}
                        <ApplyProjectDialog project={project}>
                            <Button className="w-fit">
                                Başvur <ArrowRight className="w-4 h-4 ml-2 hidden sm:inline-block" />
                            </Button>
                        </ApplyProjectDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};