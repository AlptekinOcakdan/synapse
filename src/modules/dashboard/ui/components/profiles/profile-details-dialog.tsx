"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    Trophy,
    GraduationCap,
    Quote,
    ExternalLink,
    Award, FolderGit2, Crown, User, Calendar
} from "lucide-react";
import { UserProfile } from "../../../types";
import { Competition, Experience } from "@/modules/auth/types";
import { LayoutProps } from "@/lib/utils";
import { DEPARTMENTS, MOCK_PROJECTS } from "@/lib/data";
import { ProjectStatusBadge } from "@/modules/dashboard/ui/components/profiles/project-status-badge";
// 1. useRouter'ı import ediyoruz
import { useRouter } from "next/navigation";

interface ProfileDetailsDialogProps extends LayoutProps {
    profile: UserProfile;
}

export const ProfileDetailsDialog = ({ profile, children }: ProfileDetailsDialogProps) => {
    // 2. Router hook'unu tanımlıyoruz
    const router = useRouter();

    const getDeptLabel = (val: string) => {
        return DEPARTMENTS.find(d => d.value === val)?.label || val;
    };

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // 3. Proje görüntüleme fonksiyonu
    const handleViewProject = (projectId: string) => {
        // Kullanıcıyı dashboard'a, proje ID'si ile birlikte yönlendiriyoruz.
        // Bu işlem, DashboardView'daki useEffect/useMemo mantığını tetikleyip proje modalını açacaktır.
        router.push(`/dashboard?projectId=${projectId}`);
    };

    const bio = profile.bio || "Henüz bir biyografi eklenmemiş.";
    const experiences: Experience[] = profile.experiences || [];
    const competitions: Competition[] = profile.competitions || [];

    const userProjects = MOCK_PROJECTS.filter(project =>
        project.owner.id === profile.id ||
        project.participants.some(p => p.id === profile.id)
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90dvh] p-0 overflow-hidden flex flex-col gap-0">
                {/* ... Header ve Avatar kısıımları aynı ... */}
                <div className="relative bg-linear-to-r from-primary/10 via-primary/5 to-background p-6 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                            <AvatarImage src={profile.avatar} alt={profile.name} />
                            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>

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
                                    <GraduationCap className="w-4 h-4" />
                                    <span>{getDeptLabel(profile.department)}</span>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <Button>
                                    İletişime Geç <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogHeader className="sr-only">
                    <DialogTitle>{profile.name} Profili</DialogTitle>
                    <DialogDescription>Kullanıcı detayları</DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(90dvh-20rem)] px-6">
                    <div className="space-y-8 py-6">

                        {/* ... Hakkında, Deneyimler, Başarılar kısımları aynı ... */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Quote className="w-5 h-5 text-primary" /> Hakkında
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {bio}
                            </p>
                        </section>

                        <Separator />

                        {experiences.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" /> Deneyimler
                                </h3>
                                <div className="relative border-l-2 border-muted ml-2 space-y-6">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="ml-6 relative">
                                            <span className="absolute -left-7.75 top-1 h-4 w-4 rounded-full border-2 border-background bg-primary ring-4 ring-background" />
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                                                <h4 className="font-semibold text-base">{exp.institution}</h4>
                                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md w-fit mt-1 sm:mt-0">
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

                        {experiences.length > 0 && <Separator />}

                        {competitions.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary" /> Başarılar & Dereceler
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {competitions.map((comp, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                                            <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                                                <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
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

                        {(competitions.length > 0) && <Separator />}

                        <section className="space-y-3">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" /> Uzmanlık Alanları
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm font-normal">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        {userProjects.length > 0 && (
                            <>
                                <Separator />
                                <section className="space-y-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <FolderGit2 className="w-5 h-5 text-primary" /> Projeler
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {userProjects.map((project) => {
                                            const isOwner = project.owner.id === profile.id;
                                            return (
                                                <div key={project.id} className="group border rounded-xl p-4 hover:border-primary/50 transition-colors bg-card">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                                                                    {project.title}
                                                                </h4>
                                                                {isOwner ? (
                                                                    <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20 text-[10px] px-1.5 h-5 gap-1">
                                                                        <Crown className="w-3 h-3" /> Kurucu
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 gap-1">
                                                                        <User className="w-3 h-3" /> Üye
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {project.platform} • {project.competition}
                                                            </div>
                                                        </div>
                                                        <ProjectStatusBadge status={project.status} />
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                        {project.summary}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(project.date).toLocaleDateString('tr-TR')}
                                                        </div>

                                                        {/* 4. Butona onClick ekliyoruz */}
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="h-auto p-0 text-primary cursor-pointer"
                                                            onClick={() => handleViewProject(String(project.id))}
                                                        >
                                                            İncele <ExternalLink className="w-3 h-3 ml-1" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </>
                        )}

                    </div>
                </ScrollArea>

                <div className="p-4 border-t md:hidden bg-background">
                    <Button className="w-full">İletişime Geç</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};