"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Settings, Loader2, LogIn } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// --- ENTEGRASYON ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { logoutAction } from "@/actions/auth";
import {useSession} from "@/providers/session-provider";

// Artık Props Yok!
export const AuthButton = () => {
    const router = useRouter();

    // 1. Context'ten ID'yi al
    const { userId, isAuthenticated } = useSession();

    // 2. Convex'ten Veriyi Çek (Eğer ID varsa sorgu çalışır, yoksa "skip")
    const user = useQuery(api.users.getBasicUser, userId ? { userId } : "skip");

    const getInitials = (name: string) => {
        if (!name) return "SY";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const handleLogout = async () => {
        await logoutAction();
        // router.refresh() gerekebilir logout sonrası state temizliği için
    };

    // --- DURUM KONTROLLERİ ---

    // A. Giriş Yapmamışsa (Login Butonu Göster veya Null Dön)
    if (!isAuthenticated) {
        return (
            <Button variant="default" size="sm" onClick={() => /* Login Modalını Aç */ {}}>
                <LogIn className="w-4 h-4 mr-2" /> Giriş Yap
            </Button>
        );
    }

    // B. Veri Yükleniyorsa
    if (user === undefined) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Button>
        );
    }

    // C. ID var ama Veritabanında Kullanıcı Yoksa (Nadir hata durumu)
    if (user === null) {
        return null;
    }

    // D. Kullanıcı Yüklendi
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10 border border-border/50">
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profilim</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/questions")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Sorularım</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};