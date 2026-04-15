"use client";

import { Edit, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectEditDialog } from "./project-edit-dialog";
import { ProjectDetailsDialog } from "./project-details-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {useQuery} from "convex/react";
import {Project} from "@/modules/dashboard/types";

interface ProjectCardProps{
    project: Project,
    userId: Id<"users">,
}

export const ProjectCard = ({ project, userId }: ProjectCardProps) => {

    // 1. Oturum açmış kullanıcıyı çek
    const currentUser = useQuery(api.users.viewer, { userId: userId });

    // 2. Sahiplik Kontrolü
    // currentUser yüklenene kadar (undefined) false döner.
    // currentUser._id bir Convex ID nesnesidir, project.owner.id string'dir.
    // Karşılaştırma için ikisini de string'e çevirmek en güvenlisidir.
    const isOwner = currentUser
        ? String(currentUser._id) === project.owner.id
        : false;

    // Katılımcı mıyım kontrolü (Opsiyonel: Eğer kartta "Katıldın" rozeti göstermek istersen)
    const isParticipant = currentUser
        ? project.participants.some(p => p.id === String(currentUser._id))
        : false;

    // Yeni: owner ile advisor aynı mı?
    const isOwnerAlsoAdvisor = !!project.advisor && project.owner.id === project.advisor.id;


    // Koşula göre kullanılacak sınıflar (normal: indigo/varsayılan, çakışma: rose/bordo)
    const cardBorderClass = isOwnerAlsoAdvisor ? "border-l-4 border-l-rose-700" : "hover:border-primary/50";
    const statusBadgeClass = isOwnerAlsoAdvisor
        ? "text-rose-700 border-rose-200 bg-rose-500/10 text-xs font-normal"
        : "text-xs font-normal";
    const ownerBadgeClass = isOwnerAlsoAdvisor
        ? "text-rose-900 bg-rose-50 px-2 py-0.5 rounded-full truncate max-w-37.5"
        : "text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-37.5";
    const actionBtnPrimaryClass = "";
    const editBtnClass = "";

    return (
        <Card className={`group transition-all duration-300 overflow-hidden ${cardBorderClass}`}>
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">

                    {/* --- TIKLANABİLİR DETAY ALANI --- */}
                    <ProjectDetailsDialog project={project}>
                        <div className="flex-1 p-4 sm:p-6 cursor-pointer hover:bg-muted/5 transition-colors space-y-3 min-w-0 text-left">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <Badge variant={project.status === "completed" ? "default" : "secondary"} className={statusBadgeClass}>
                                    {project.status === "completed" ? "Tamamlandı" : "Devam Ediyor"}
                                </Badge>
                                <span className="text-xs text-muted-foreground truncate">
                                    • {project.competition}
                                </span>
                                {/* Eğer katılımcıysa rozet göster */}
                                {isParticipant && !isOwner && (
                                    <Badge variant="outline" className="text-xs border-green-500 text-green-600 bg-green-500/10">
                                        Katılımcısın
                                    </Badge>
                                )}
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
                                {/* Sahibi ben değilsem ismini göster */}
                                {!isOwner && (
                                    <span className={ownerBadgeClass}>
                                        Sahibi: {project.owner.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </ProjectDetailsDialog>

                    {/* --- AKSİYON BUTONLARI --- */}
                    <div className="flex flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 shrink-0 px-4">

                        {/* Sohbet Butonu */}
                        <Button variant="secondary" className={`flex-1 w-full lg:w-auto text-xs sm:text-sm h-9 ${actionBtnPrimaryClass}`}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Sohbet
                        </Button>

                        {/* Düzenle Butonu - SADECE SAHİBİ GÖRÜR */}
                        {isOwner && (
                            <ProjectEditDialog project={project} userId={userId}>
                                <Button variant="outline" className={`flex-1 w-full lg:w-auto text-xs sm:text-sm h-9 ${editBtnClass}`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Düzenle
                                </Button>
                            </ProjectEditDialog>
                        )}

                        <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm" className={editBtnClass}>
                                    <Link href={`/dashboard/my-projects/${project.id}/applications`}>
                                        Başvurular
                                    </Link>
                                </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};