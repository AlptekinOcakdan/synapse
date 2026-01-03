"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Mail, GraduationCap, CheckCircle2, XCircle, User } from "lucide-react";
import { Academician } from "@/modules/dashboard/types"; // Tip tanımı
import { AcademicianDetailsDialog } from "./academician-details-dialog";
import { AcademicianContactDialog } from "./academician-contact-dialog"; // Yol aynı klasördeyse kısaltılabilir

interface AcademicianCardProps {
    academician: Academician;
}

export const AcademicianCard = ({ academician }: AcademicianCardProps) => {

    // Veritabanında artık tam isim tutulduğu için mapping'e gerek yok
    // Örn: "Bilgisayar Mühendisliği" direkt DB'den gelir.
    const deptLabel = academician.department || "Bölüm Belirtilmemiş";

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <Card className="flex flex-col h-full hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">

            <CardContent className="p-6 pt-8 flex flex-col items-center text-center space-y-4 grow">
                {/* AVATAR ALANI */}
                <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md group-hover:scale-105 transition-transform">
                        <AvatarImage src={academician.avatar} alt={academician.name} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {getInitials(academician.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Müsaitlik Durumu İkonu */}
                    <div className={`absolute bottom-0 right-0 p-1 rounded-full border-4 border-card ${
                        academician.isAvailableForMentorship
                            ? "bg-green-500 text-white"
                            : "bg-muted-foreground/50 text-white"
                    }`} title={academician.isAvailableForMentorship ? "Mentörlük Verebilir" : "Meşgul"}>
                        {academician.isAvailableForMentorship ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                            <XCircle className="w-3.5 h-3.5" />
                        )}
                    </div>
                </div>

                {/* İSİM VE BÖLÜM */}
                <div className="space-y-1 w-full">
                    <h3 className="font-bold text-lg leading-tight px-2 truncate" title={academician.name}>
                        {academician.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary/80 truncate max-w-[200px]">{deptLabel}</span>
                    </div>
                    {/* Unvan (Dr. Öğr. Üyesi vb.) */}
                    <p className="text-xs text-muted-foreground">{academician.title}</p>
                </div>

                {/* İSTATİSTİKLER */}
                <div className="grid grid-cols-2 gap-2 w-full max-w-50 py-3 border-y border-border/50 my-2">
                    <div className="flex flex-col items-center justify-center p-1">
                        <span className="font-bold text-base flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-primary/70" />
                            {academician.publicationsCount}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">Yayın</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-l border-border/50 p-1">
                         <span className="font-bold text-base flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-primary/70" />
                             {academician.mentoredProjects}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">Proje</span>
                    </div>
                </div>

                {/* ARAŞTIRMA ALANLARI */}
                <div className="w-full space-y-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">
                        Uzmanlık Alanları
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                        {academician.researchInterests.length > 0 ? (
                            <>
                                {academician.researchInterests.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] font-normal px-2 bg-secondary/50 hover:bg-secondary">
                                        {tag}
                                    </Badge>
                                ))}
                                {academician.researchInterests.length > 3 && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 border-dashed text-muted-foreground">
                                        +{academician.researchInterests.length - 3}
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <span className="text-[10px] text-muted-foreground italic">- Belirtilmemiş -</span>
                        )}
                    </div>
                </div>

            </CardContent>

            {/* FOOTER AKSİYONLARI */}
            <CardFooter className="p-4 bg-muted/30 border-t flex flex-col gap-2 mt-auto">

                {/* 1. İLETİŞİME GEÇ (Contact Dialog) */}
                <AcademicianContactDialog academician={academician}>
                    <Button
                        size="sm"
                        className="w-full h-8 text-xs rounded-md shadow-sm"
                        disabled={!academician.isAvailableForMentorship}
                        variant={academician.isAvailableForMentorship ? "default" : "secondary"}
                    >
                        <Mail className="w-3.5 h-3.5 mr-2" />
                        {academician.isAvailableForMentorship ? "İletişime Geç" : "Mentörlük Kapalı"}
                    </Button>
                </AcademicianContactDialog>

                {/* 2. PROFİLİ GÖR (Details Dialog) */}
                <AcademicianDetailsDialog academician={academician}>
                    <Button size="sm" variant="outline" className="w-full h-8 text-xs bg-background hover:bg-background/80">
                        <User className="w-3.5 h-3.5 mr-2" /> Profili Gör
                    </Button>
                </AcademicianDetailsDialog>

            </CardFooter>
        </Card>
    );
};