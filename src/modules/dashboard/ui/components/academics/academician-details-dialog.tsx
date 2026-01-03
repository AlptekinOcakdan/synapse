"use client";

import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    BookOpen,
    Users,
    Mail,
    GraduationCap,
    CheckCircle2,
    XCircle,
    Quote,
    Lightbulb,
    ExternalLink
} from "lucide-react";
import { Academician } from "@/modules/dashboard/types";
// İletişim Dialog'unu ekledik
import { AcademicianContactDialog } from "./academician-contact-dialog";

interface AcademicianDetailsDialogProps {
    academician: Academician;
    children: ReactNode;
}

export const AcademicianDetailsDialog = ({ academician, children }: AcademicianDetailsDialogProps) => {

    // Veritabanından gelen bölüm ismini kullanıyoruz
    const deptLabel = academician.department || "Bölüm Belirtilmemiş";

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

            <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl">

                {/* --- ACCESSIBILITY --- */}
                <DialogHeader className="sr-only">
                    <DialogTitle>{academician.name} Profili</DialogTitle>
                    <DialogDescription>
                        {academician.title} ünvanlı akademisyenin detaylı bilgileri.
                    </DialogDescription>
                </DialogHeader>

                {/* --- HEADER BANNER --- */}
                <div className="relative bg-linear-to-r from-primary/20 via-primary/10 to-background h-32 w-full shrink-0">
                    <div className="absolute top-4 right-4">
                        {academician.isAvailableForMentorship ? (
                            <Badge className="bg-green-500/90 hover:bg-green-600 text-white border-none gap-1.5 py-1.5 px-3">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mentörlüğe Açık
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-background/80 backdrop-blur-sm">
                                <XCircle className="w-3.5 h-3.5 text-muted-foreground" /> Meşgul
                            </Badge>
                        )}
                    </div>
                </div>

                {/* --- PROFILE INFO HEADER --- */}
                <div className="px-8 pb-6 -mt-12 flex flex-col items-start gap-4 shrink-0">
                    <Avatar className="h-28 w-28 border-[5px] border-background shadow-xl">
                        <AvatarImage src={academician.avatar} alt={academician.name} />
                        <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                            {getInitials(academician.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">{academician.name}</h2>
                        <p className="text-lg text-primary font-medium">{academician.title}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <GraduationCap className="w-4 h-4" />
                            <span>{deptLabel}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* --- SCROLLABLE CONTENT --- */}
                <ScrollArea className="flex-1 p-0 w-full">
                    <div className="px-8 py-6 space-y-8">

                        {/* --- STATS GRID --- */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/50 text-center space-y-1 hover:bg-muted/50 transition-colors">
                                <BookOpen className="w-5 h-5 text-primary mb-1" />
                                <span className="text-2xl font-bold">{academician.publicationsCount}</span>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Yayın</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/50 text-center space-y-1 hover:bg-muted/50 transition-colors">
                                <Quote className="w-5 h-5 text-indigo-500 mb-1" />
                                <span className="text-2xl font-bold">{academician.citationCount}</span>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Atıf</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 border border-border/50 text-center space-y-1 hover:bg-muted/50 transition-colors">
                                <Users className="w-5 h-5 text-green-600 mb-1" />
                                <span className="text-2xl font-bold">{academician.mentoredProjects}</span>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Proje</span>
                            </div>
                        </div>

                        {/* --- RESEARCH INTERESTS --- */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-primary" /> Çalışma ve Uzmanlık Alanları
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {academician.researchInterests.length > 0 ? (
                                    academician.researchInterests.map((interest) => (
                                        <Badge key={interest} variant="secondary" className="px-3 py-1 text-sm font-normal border-border/50">
                                            {interest}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">Belirtilmemiş</span>
                                )}
                            </div>
                        </div>

                        {/* Ofis Bilgisi (Varsa) */}
                        {academician.office && (
                            <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                                <span className="font-semibold text-foreground">Ofis:</span> {academician.office}
                            </div>
                        )}

                    </div>
                </ScrollArea>

                {/* --- FOOTER ACTION --- */}
                <div className="p-4 border-t bg-muted/20 flex gap-3 justify-end shrink-0">

                    {/* Google Akademik Araması */}
                    <Button variant="outline" asChild>
                        <a
                            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(academician.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Akademik Profil <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>

                    {/* İletişim Dialog'unu Tetikleme */}
                    <AcademicianContactDialog academician={academician}>
                        <Button disabled={!academician.isAvailableForMentorship}>
                            <Mail className="w-4 h-4 mr-2" />
                            {academician.isAvailableForMentorship ? "İletişime Geç" : "Meşgul"}
                        </Button>
                    </AcademicianContactDialog>

                </div>
            </DialogContent>
        </Dialog>
    );
};