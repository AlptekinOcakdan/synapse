"use client";

import { Loader2 } from "lucide-react";
import { ProfileSidebar } from "@/modules/profile/ui/components/profile/profile-sidebar";
import { ProfileContent } from "@/modules/profile/ui/components/profile/profile-content";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Prop tanımı ekle
interface ProfileViewProps {
    userId: Id<"users">;
}

export const ProfileView = ({ userId }: ProfileViewProps) => {
    // ARTIK SORGUMUZA USER ID'Yİ ARGÜMAN OLARAK VERİYORUZ
    const user = useQuery(api.users.getViewerProfile, { userId: userId });

    if (user === undefined) {
        return (
            <div className="h-[50vh] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (user === null) {
        return (
            <div className="h-[50vh] w-full flex items-center justify-center text-muted-foreground">
                Kullanıcı verisi veritabanında bulunamadı.
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Profilim</h1>
                <p className="text-muted-foreground">Kişisel bilgilerinizi, projelerinizi ve deneyimlerinizi yönetin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-20">
                    <ProfileSidebar user={user} />
                </div>
                <div className="lg:col-span-8">
                    <ProfileContent user={user} />
                </div>
            </div>
        </div>
    );
};