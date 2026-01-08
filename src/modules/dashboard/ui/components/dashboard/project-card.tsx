// modules/dashboard/components/dashboard/project-card.tsx
"use client";

import {ArrowRight,  Users, UserSearch} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "../../../types";
import { ApplyProjectDialog } from "./apply-project-dialog";
// useRouter ve usePathname, useSearchParams ekleyin
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";

interface ProjectCardProps {
    project: Project;
    userId: Id<"users">;
}

export const ProjectCard = ({ project, userId }: ProjectCardProps) => {
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
        <Card className="transition-colors group border-l-4 border-l-indigo-500 hover:shadow-md">
            <CardContent className="p-4 sm:p-6 w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between items-start lg:items-center">

                    {/* ... Sol taraf (İçerik) aynı kalıyor ... */}
                    <div className="space-y-3 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="indigo" className="text-xs font-normal group-hover:border-primary/30 transition-colors">
                                {project.competition}
                            </Badge>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold pr-0 lg:pr-4 w-full">
                            {project.title}
                        </h3>

                        {project.positions && project.positions.flatMap(p => p.skills).length > 0 && (
                            <div className="relative w-full overflow-hidden h-6">
                                <div className="absolute inset-0 flex flex-nowrap gap-2 items-center">
                                    {project.positions.flatMap(p => p.skills).map((skill, index) => (
                                        <Badge key={index} variant="turquoise" className="text-xs font-normal whitespace-nowrap">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-card to-transparent" />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 sm:gap-4">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span className="truncate">{project.owner.name}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                                <UserSearch className="w-3.5 h-3.5" />
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
                        <ApplyProjectDialog project={project} userId={userId}>
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