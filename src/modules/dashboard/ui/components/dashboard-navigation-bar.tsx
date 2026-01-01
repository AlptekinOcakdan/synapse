"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SynapseLogo } from "@/components/synapse-logo";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const DashboardNavigationBar = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Proje Pazarı", href: "/dashboard" },
        { name: "Yıldızlar Karması", href: "/dashboard/profiles" },
        { name: "Projelerim", href: "/dashboard/my-projects" },
        { name: "Sohbetlerim", href: "/dashboard/chats" },
        { name: "Uzman Havuzu", href: "/dashboard/academics" },
        { name: "Synapse Akademi", href: "/dashboard/academy" },
    ];

    return (
        <header
            className={`top-0 w-full z-50 transition-all duration-300 border-b h-20 ${
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-border"
                    : "bg-background border-border"
            }`}
        >
            <nav className="h-full px-4 md:px-6 flex items-center">
                <div className="flex w-full items-center justify-between gap-4">

                    {/* --- SOL TARAFTA LOGO --- */}
                    <div className="shrink-0">
                        <SynapseLogo />
                    </div>

                    {/* --- SAĞ TARAF (Linkler + Auth + Mobil Menü) --- */}
                    <div className="flex items-center gap-4">

                        {/* DESKTOP LINKS (Mobilde gizlenir) */}
                        <div className="hidden xl:flex items-center gap-4 mr-2">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.name}
                                    variant="nav" // Yeni eklediğimiz stil
                                    size="sm"
                                    asChild // Button'un Link gibi davranmasını sağlar
                                    data-active={pathname === link.href} // Aktiflik durumunu CSS'e bildirir
                                >
                                    <Link href={link.href}>
                                        {link.name}
                                    </Link>
                                </Button>
                            ))}
                            {/* Desktop Ayırıcı Çizgi */}
                            <div className="h-6 w-px bg-border/60 hidden lg:block" />
                        </div>

                        {/* AUTH BUTTON (Her zaman görünür) */}
                        <AuthButton />

                        {/* MOBILE MENU (Sadece mobilde görünür) */}
                        <div className="xl:hidden flex items-center ml-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Menüyü aç</span>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-48 mt-2">
                                    {navLinks.map((link) => (
                                        <DropdownMenuItem key={link.name} asChild>
                                            <Link
                                                href={link.href}
                                                className={`w-full cursor-pointer ${pathname === link.href ? "font-bold text-primary" : ""}`}
                                            >
                                                {link.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};