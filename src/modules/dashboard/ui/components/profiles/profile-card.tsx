"use client";

import { Trophy, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {UserProfile } from "../../../types";
import {ProfileDetailsDialog} from "@/modules/dashboard/ui/components/profiles/profile-details-dialog";
import {DEPARTMENTS} from "@/lib/data";

interface ProfileCardProps {
    profile: UserProfile;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {

    // İsimden baş harfleri alma
    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getDeptLabel = (val: string) => {
        return DEPARTMENTS.find(d => d.value === val)?.label || val;
    };

    return (
        <Card className="hover:border-primary/50 transition-all duration-300 group flex flex-col h-full overflow-hidden w-full">
            {/* --- HEADER: Avatar & İsim --- */}
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-border group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="font-bold text-lg bg-secondary text-secondary-foreground">
                            {getInitials(profile.name)}
                        </AvatarFallback>
                    </Avatar>
                    {/* Online/Müsaitlik Durumu (Opsiyonel Süsleme) */}
                    {profile.isAvailable && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full" title="Projelere Açık" />
                    )}
                </div>

                <div className="flex flex-col overflow-hidden">
                    <h3 className="font-bold text-lg truncate leading-tight group-hover:text-primary transition-colors">
                        {profile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate font-medium">
                        {profile.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground/80">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span className="truncate">{getDeptLabel(profile.department)}</span> {/* Burayı güncelleyin */}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-5 pb-4">
                {/* --- İSTATİSTİKLER (Grid Yapısı) --- */}
                <div className="grid grid-cols-2 gap-4">
                    {/* 1. KART: TAMAMLANAN PROJELER */}
                    <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-muted/50 via-muted/20 to-transparent p-4 flex flex-col items-center justify-center text-center hover:border-border/80 transition-all duration-300">

                        {/* İkon */}
                        <div className="mb-2 p-2 rounded-full bg-background/50 border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Sayı Değeri */}
                        <span className="text-3xl font-black tracking-tight text-foreground z-10 mb-0.5">
                            {profile.projectCount}
                        </span>

                        {/* Açıklayıcı Metin (Düzeltildi) */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 z-10">
                            Tamamlanan Proje
                        </span>

                        {/* Arka Plan Dekoru */}
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-foreground/5 blur-2xl group-hover:bg-foreground/10 transition-colors duration-500" />
                    </div>

                    {/* 2. KART: AKTİF / DEVAM EDEN PROJELER */}
                    <div className="group relative overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex flex-col items-center justify-center text-center hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300">

                        {/* İkon */}
                        <div className="mb-2 p-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-all duration-300 z-10">
                            <Trophy className="w-4 h-4 text-indigo-400" />
                        </div>

                        {/* Sayı Değeri */}
                        <span className="text-3xl font-black tracking-tight text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] z-10 mb-0.5">
                            {profile.top3Count}
                        </span>

                        {/* Açıklayıcı Metin (Düzeltildi) */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/80 z-10">
                        Aktif Proje
                        </span>

                        {/* Arka Plan Glow Efekti */}
                        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500" />
                    </div>
                </div>

                {/* --- YETENEKLER --- */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Uzmanlık Alanları
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {profile.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-2 py-0.5 text-xs font-normal">
                                {skill}
                            </Badge>
                        ))}
                        {profile.skills.length > 5 && (
                            <Badge variant="outline" className="px-2 py-0.5 text-xs text-muted-foreground bg-background">
                                +{profile.skills.length - 5}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <Separator />

            {/* --- FOOTER: Aksiyon --- */}
            <CardFooter className="pt-4 pb-4">
                <ProfileDetailsDialog profile={profile}>
                    <Button className="w-full group/btn" variant="default">
                        Profili İncele
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </ProfileDetailsDialog>
            </CardFooter>
        </Card>
    );
};