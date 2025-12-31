"use client";

import { ArrowRight, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "../../types";
import { ProjectDetailsDialog } from "./project-details-dialog";
import { ApplyProjectDialog } from "./apply-project-dialog";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <Card className="hover:border-primary/50 transition-colors group">
            <CardContent className="p-4 sm:p-6 w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-between items-start lg:items-center">

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
                                <span className="truncate">{project.owner}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                                <Trophy className="w-3.5 h-3.5" />
                                Aranan: {project.participantsNeeded}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row items-start gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                        {/* Detaylar Modalı */}
                        <ProjectDetailsDialog project={project}>
                            <Button variant="outline" className="w-fit">
                                Detaylar
                            </Button>
                        </ProjectDetailsDialog>

                        {/* Başvuru Modalı */}
                        <ApplyProjectDialog project={project}>
                            <Button className="w-fit">
                                {/* Mobilde Arrow ikonunu gizleyerek butonun çok uzamasını engelliyoruz */}
                                Başvur <ArrowRight className="w-4 h-4 ml-2 hidden sm:inline-block" />
                            </Button>
                        </ApplyProjectDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};