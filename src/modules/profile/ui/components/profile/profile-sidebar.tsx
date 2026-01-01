"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, MapPin, Edit2, Twitter, Link as LinkIcon } from "lucide-react";
import {UserProfile} from "@/modules/dashboard/types";
import {ProfileEditModal} from "@/modules/profile/ui/components/profile/profile-edit-modal";

interface ProfileSidebarProps {
    user: UserProfile;
}

export const ProfileSidebar = ({ user }: ProfileSidebarProps) => {
    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    return (
        <Card className="h-fit sticky top-6">
            <ProfileEditModal user={user}>
                <Button size="icon" variant="secondary" className="absolute top-3 right-3 rounded-full h-8 w-8 shadow-md z-10">
                    <Edit2 className="w-4 h-4" />
                </Button>
            </ProfileEditModal>

            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">

                {/* Avatar & Edit Button Wrapper */}
                <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Kimlik Bilgileri */}
                <div className="space-y-1 w-full">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-primary font-medium text-sm">{user.title}</p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Sakarya, Türkiye</span>
                    </div>
                </div>

                {/* Durum Rozeti */}
                {user.isAvailable && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 py-1 px-4">
                        Projeye Açık
                    </Badge>
                )}

                <Separator />

                {/* İletişim Linkleri */}
                <div className="w-full space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm">
                        <Mail className="w-4 h-4" /> {user.email}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        {user.socialLinks?.github && (
                            <Button asChild variant="outline" className="w-full gap-2 h-9 text-sm">
                                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-4 h-4" /> GitHub
                                </a>
                            </Button>
                        )}
                        {user.socialLinks?.linkedin && (
                            <Button asChild variant="outline" className="w-full gap-2 h-9 text-sm">
                                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </a>
                            </Button>
                        )}
                        {user.socialLinks?.twitter && (
                            <Button asChild variant="outline" className="w-full gap-2 h-9 text-sm">
                                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                    <Twitter className="w-4 h-4" /> Twitter
                                </a>
                            </Button>
                        )}
                        {user.socialLinks?.personalWebsite && (
                            <Button asChild variant="outline" className="w-full gap-2 h-9 text-sm">
                                <a href={user.socialLinks.personalWebsite} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="w-4 h-4" /> Website
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Yetenekler */}
                <div className="w-full text-left space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        Yetenekler
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {user.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};