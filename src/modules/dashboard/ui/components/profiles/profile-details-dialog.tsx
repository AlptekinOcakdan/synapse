"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import {
    Briefcase,
    Trophy,
    GraduationCap,
    Quote,
    ExternalLink,
    Award
} from "lucide-react";
import {UserProfile, DEPARTMENTS} from "../../../types";
import {Competition, Experience} from "@/modules/auth/types";
import {LayoutProps} from "@/lib/utils";

interface ProfileDetailsDialogProps extends LayoutProps {
    profile: UserProfile;
}

export const ProfileDetailsDialog = ({profile, children}: ProfileDetailsDialogProps) => {

    // Bölüm ismini bulma (Slug -> Label)
    const getDeptLabel = (val: string) => {
        return DEPARTMENTS.find(d => d.value === val)?.label || val;
    };

    // İsim Baş Harfleri
    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Verilere Güvenli Erişim
    // UserProfile tipinde bu alanlar opsiyonel (?) tanımlandığı için varsayılan değerler atıyoruz.
    const bio = profile.bio || "Henüz bir biyografi eklenmemiş.";
    const experiences: Experience[] = profile.experiences || [];
    const competitions: Competition[] = profile.competitions || [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90dvh] p-0 overflow-hidden flex flex-col gap-0">
                <div className="relative bg-linear-to-r from-primary/10 via-primary/5 to-background p-6 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                        {/* Avatar */}
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                            <AvatarImage src={profile.avatar} alt={profile.name}/>
                            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>

                        {/* İsim ve Ünvan */}
                        <div className="space-y-1.5 flex-1">
                            <div className="flex flex-col items-start gap-3">
                                <h2 className="text-2xl font-bold">{profile.name}</h2>
                                {profile.isAvailable && (
                                    <Badge variant="secondary"
                                           className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                                        Projeye Açık
                                    </Badge>
                                )}
                            </div>
                            <p className="text-lg font-medium text-muted-foreground">{profile.title}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                                <div className="flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4"/>
                                    <span>{getDeptLabel(profile.department)}</span>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <Button>
                                    İletişime Geç <ExternalLink className="w-4 h-4 ml-2"/>
                                </Button>
                            </div>
                        </div>
                        {/* Aksiyon Butonu */}
                    </div>
                </div>

                <DialogHeader className="sr-only">
                    <DialogTitle>{profile.name} Profili</DialogTitle>
                    <DialogDescription>Kullanıcı detayları</DialogDescription>
                </DialogHeader>

                {/* --- SCROLLABLE CONTENT --- */}
                <ScrollArea className="h-[calc(90dvh-20rem)] px-6">
                    <div className="space-y-8 py-6">

                        {/* 1. HAKKINDA (BIO) */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Quote className="w-5 h-5 text-primary"/> Hakkında
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {bio}
                            </p>
                        </section>

                        <Separator/>

                        {/* 2. DENEYİMLER (Timeline Tarzı) */}
                        {experiences.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary"/> Deneyimler
                                </h3>
                                <div className="relative border-l-2 border-muted ml-2 space-y-6">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="ml-6 relative">
                                            {/* Nokta */}
                                            <span
                                                className="absolute -left-7.75 top-1 h-4 w-4 rounded-full border-2 border-background bg-primary ring-4 ring-background"/>

                                            <div
                                                className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                                                <h4 className="font-semibold text-base">{exp.institution}</h4>
                                                <span
                                                    className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md w-fit mt-1 sm:mt-0">
                                                    {exp.duration}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {experiences.length > 0 && <Separator/>}

                        {/* 3. YARIŞMALAR & DERECELER */}
                        {competitions.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary"/> Başarılar & Dereceler
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {competitions.map((comp, index) => (
                                        <div key={index}
                                             className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                                            <div
                                                className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                                                <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{comp.name}</p>
                                                <p className="text-xs font-semibold text-primary">
                                                    {comp.rank}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(competitions.length > 0) && <Separator/>}

                        {/* 4. YETENEKLER */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary"/> Uzmanlık Alanları
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm font-normal">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                    </div>
                </ScrollArea>

                {/* Mobil için Alt Buton */}
                <div className="p-4 border-t md:hidden bg-background">
                    <Button className="w-full">İletişime Geç</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};