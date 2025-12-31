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
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3 border flex flex-col items-center justify-center text-center gap-1 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                            <Briefcase className="w-3.5 h-3.5" />
                            Projeler
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {profile.projectCount}
                        </span>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex flex-col items-center justify-center text-center gap-1 hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-1.5 text-primary/80 text-xs font-medium uppercase tracking-wider">
                            <Trophy className="w-3.5 h-3.5" />
                            İlk 3 Derece
                        </div>
                        <span className="text-2xl font-bold text-primary">
                            {profile.top3Count}
                        </span>
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