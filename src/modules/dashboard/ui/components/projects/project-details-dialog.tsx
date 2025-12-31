"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Calendar,
    Trophy,
    Target,
    Layers,
    Briefcase,
    GraduationCap,
    Users,
    CheckCircle2,
    Clock
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "../../../types";
import { LayoutProps } from "@/lib/utils";
import {DEPARTMENTS} from "@/lib/data";

interface ProjectDetailsDialogProps extends LayoutProps {
    project: Project;
}

export const ProjectDetailsDialog = ({ project, children }: ProjectDetailsDialogProps) => {

    // Bölüm label'ını bulmak için yardımcı fonksiyon
    const getDeptLabel = (val: string) => {
        return DEPARTMENTS.find(d => d.value === val)?.label || val;
    };

    // İsim Baş Harfleri
    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[85dvh] h-auto flex flex-col p-0 gap-0 font-sans overflow-hidden">

                {/* --- HEADER --- */}
                <div className="relative bg-linear-to-r from-primary/10 via-primary/5 to-background p-6 pb-8 shrink-0">
                    <div className="space-y-4">
                        {/* Üst Rozetler */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={project.status === "completed" ? "default" : "secondary"} className="gap-1.5 pl-1.5 pr-2.5">
                                {project.status === "completed" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                    <Clock className="w-3.5 h-3.5" />
                                )}
                                {project.status === "completed" ? "Tamamlandı" : "Devam Ediyor"}
                            </Badge>
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                                {project.platform}
                            </Badge>
                        </div>

                        {/* Başlık ve Yarışma */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
                                {project.title}
                            </h2>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2 font-medium">
                                <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                                <span>{project.competition}</span>
                            </div>
                        </div>

                        {/* Proje Sahibi (Mini Profil) */}
                        <div className="flex items-center gap-3 pt-2">
                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                <AvatarImage src={project.owner.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {getInitials(project.owner.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold leading-none">{project.owner.name}</span>
                                <span className="text-xs text-muted-foreground mt-1">Proje Yöneticisi</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogHeader className="sr-only">
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>Proje detayları</DialogDescription>
                </DialogHeader>

                    <ScrollArea className="h-[calc(85dvh-24rem)] w-full">
                        <div className="p-6 space-y-8 pb-10">

                            {/* 1. ÖZET */}
                            <section className="space-y-3">
                                <h4 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                    <Layers className="w-5 h-5 text-primary" /> Proje Özeti
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {project.summary}
                                </p>
                            </section>

                            <Separator />

                            {/* 2. GENEL BİLGİLER (GRID) */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Başlangıç Tarihi</p>
                                        <p className="text-sm text-muted-foreground">{project.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                                        <Target className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Hedef Yarışma</p>
                                        <p className="text-sm text-muted-foreground">{project.competition}</p>
                                    </div>
                                </div>
                            </section>

                            {/* 3. PROJE EKİBİ (Participants) */}
                            {project.participants.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                            <Users className="w-5 h-5 text-primary" /> Proje Ekibi
                                        </h4>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                            {project.participants.length} Kişi
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {project.participants.map((user) => (
                                            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{getDeptLabel(user.department)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 4. AÇIK POZİSYONLAR (Positions) */}
                            {project.positions.length > 0 && (
                                <section className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                        <Briefcase className="w-5 h-5 text-primary" /> Ekip İhtiyaçları
                                    </h4>

                                    <div className="grid gap-3">
                                        {project.positions.map((pos) => (
                                            <div key={pos.id} className="border rounded-xl p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                            <GraduationCap className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="font-semibold text-sm sm:text-base">
                                                            {getDeptLabel(pos.department)}
                                                        </span>
                                                    </div>

                                                    <Badge variant={pos.filled >= pos.count ? "secondary" : "outline"} className="w-fit">
                                                        {pos.filled} / {pos.count} Dolu
                                                    </Badge>
                                                </div>

                                                {pos.description && (
                                                    <p className="text-sm text-muted-foreground mb-3 pl-10">
                                                        {pos.description}
                                                    </p>
                                                )}

                                                {/* Yetenekler */}
                                                {pos.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pl-0 sm:pl-10">
                                                        {pos.skills.map((skill) => (
                                                            <Badge key={skill} variant="secondary" className="text-xs font-normal">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                        </div>
                    </ScrollArea>

                {/* --- FOOTER --- */}
                <div className="p-4 border-t bg-background shrink-0 flex justify-end rounded-b-lg">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Kapat
                        </Button>
                    </DialogClose>
                </div>

            </DialogContent>
        </Dialog>
    );
};