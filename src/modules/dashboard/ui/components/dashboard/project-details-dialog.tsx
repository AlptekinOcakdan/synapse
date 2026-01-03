"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription, // Eklenmeli
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trophy, User, Target, Layers, Briefcase, GraduationCap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "../../../types"; // Yolunuzu kontrol edin
import {ReactNode} from "react"; // Yolunuzu kontrol edin
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProjectDetailsDialogProps {
    project: Project;
    children?: ReactNode; // Artık opsiyonel
    open?: boolean;             // Dışarıdan kontrol için
    onOpenChange?: (open: boolean) => void; // Dışarıdan kontrol için
}

export const ProjectDetailsDialog = ({
                                         project,
                                         children,
                                         open,
                                         onOpenChange
                                     }: ProjectDetailsDialogProps) => {
    const departments = useQuery(api.users.getDepartments);

    const getDeptLabel = (val: string) => {
        return (departments || []).find(d => d.value === val)?.label || val;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Eğer children (buton) varsa Trigger render et, yoksa etme (URL modu) */}
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}

            <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="w-fit">
                            {project.platform}
                        </Badge>
                        <Badge variant="outline" className="w-fit">
                            {project.competition}
                        </Badge>
                    </div>
                    <DialogTitle className="text-2xl leading-tight">{project.title}</DialogTitle>
                    {/* DialogDescription erişilebilirlik için gereklidir, gizli de olsa ekleyin */}
                    <DialogDescription className="hidden">
                        {project.summary}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-full max-h-[60vh] px-6">
                    <div className="space-y-6 pb-6">
                        {/* ... İçerik aynı kalacak ... */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-foreground/80 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Proje Özeti
                            </h4>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {project.summary}
                            </p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                <User className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Proje Sahibi</p>
                                    <p className="text-sm text-muted-foreground">{project.owner.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                <Trophy className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Toplam Aranan</p>
                                    <p className="text-sm text-muted-foreground">{project.participantsNeeded} Kişi</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                <Target className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Yarışma</p>
                                    <p className="text-sm text-muted-foreground">{project.competition}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Tarih</p>
                                    <p className="text-sm text-muted-foreground">{project.date}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-foreground/80 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Açık Pozisyonlar ve Gereksinimler
                            </h4>

                            <div className="grid gap-3">
                                {project.positions.map((pos) => (
                                    <div key={pos.id} className="border rounded-md p-3 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <GraduationCap className="w-4 h-4 text-primary" />
                                            <span className="font-medium text-sm">
                                                {getDeptLabel(pos.department)}
                                            </span>
                                        </div>

                                        {pos.description && (
                                            <p className="text-xs text-muted-foreground mb-3 pl-6">
                                                {pos.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-1.5 pl-6">
                                            {pos.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};