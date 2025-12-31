"use client";

import { Edit, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectEditDialog } from "./project-edit-dialog";
// YENİ: Detay Dialog'u ekledik
import { ProjectDetailsDialog } from "./project-details-dialog";
import { Project } from "../../../types";

interface ProjectCardProps {
    project: Project;
    currentUserId: number; // YENİ: Sahiplik kontrolü için gerekli
}

export const ProjectCard = ({ project, currentUserId }: ProjectCardProps) => {

    // Projenin sahibi ben miyim kontrolü
    // Not: project.owner bir obje olduğu için id'sine bakıyoruz
    const isOwner = project.owner.id === currentUserId;

    return (
        <Card className="hover:border-primary/50 transition-colors group w-full max-w-full overflow-hidden">
            <CardContent className="p-0"> {/* Padding'i içeriye aldık layout kontrolü için */}
                <div className="flex flex-col lg:flex-row">

                    {/* --- TIKLANABİLİR DETAY ALANI (Sol Taraf) --- */}
                    {/* Bu alanı Dialog Trigger olarak kullanıyoruz */}
                    <ProjectDetailsDialog project={project}>
                        <div className="flex-1 p-4 sm:p-6 cursor-pointer hover:bg-muted/5 transition-colors space-y-3 min-w-0 text-left">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <Badge variant={project.status === "completed" ? "default" : "secondary"} className="text-xs font-normal">
                                    {project.status === "completed" ? "Tamamlandı" : "Devam Ediyor"}
                                </Badge>
                                <span className="text-xs text-muted-foreground truncate">
                                    • {project.competition}
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold truncate leading-tight w-full group-hover:text-primary transition-colors" title={project.title}>
                                {project.title}
                            </h3>

                            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 sm:gap-4">
                                <span className="flex items-center gap-1.5 min-w-fit">
                                    <Users className="w-4 h-4 shrink-0" />
                                    <span className="truncate">
                                        {project.participants.length} / {project.participantsNeeded + project.participants.length} Katılımcı
                                    </span>
                                </span>
                                {/* Sahip bilgisini de ekleyebiliriz */}
                                {!isOwner && (
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-37.5">
                                        Sahibi: {project.owner.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </ProjectDetailsDialog>

                    {/* --- AKSİYON BUTONLARI (Sağ Taraf) --- */}
                    {/* Burası detay dialog'undan bağımsız çalışır */}
                    <div className="flex flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 shrink-0 pr-4">

                        {/* Grup Sohbeti Butonu */}
                        <Button variant="secondary" className="flex-1 w-full lg:w-auto text-xs sm:text-sm h-9">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Sohbet
                        </Button>

                        {/* Düzenle Butonu - Sadece Sahibi Görebilir */}
                        {isOwner && (
                            <ProjectEditDialog project={project}>
                                <Button variant="outline" className="flex-1 w-full lg:w-auto text-xs sm:text-sm h-9">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Düzenle
                                </Button>
                            </ProjectEditDialog>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};