"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Settings } from "lucide-react";

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

export const AuthButton = () => {
    const router = useRouter();

    // SİMÜLASYON: Gerçek projede burası useSession() veya context'ten gelir.
    const user = {
        name: "Alptekin Ocakdan",
        email: "alptekin@example.com",
        image: "", // Avatar resmi varsa buraya URL gelir, yoksa fallback çalışır
    };

    // İsimden baş harfleri çıkarma mantığı (Örn: Alptekin Ocakdan -> AO)
    // Eğer isim yoksa senin istediğin "AS" fallback'i devreye girer.
    const getInitials = (name: string) => {
        if (!name) return "AS";
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const handleLogout = () => {
        // Çıkış işlemleri...
        console.log("Çıkış yapılıyor...");
        router.push("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                {/* Kullanıcı Bilgi Alanı */}
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Menü Öğeleri */}
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profilim</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/profile/questions")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Sorularım</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};