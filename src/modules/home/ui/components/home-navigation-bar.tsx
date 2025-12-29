"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SynapseLogo } from "@/components/synapse-logo";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {SignInModal} from "@/modules/auth/ui/components/sign-in-modal";
import {useRouter} from "next/navigation";

export const HomeNavigationBar = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    // Auth Modal State'i
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Nasıl Çalışır?", href: "#nasil-calisir" },
        { name: "Kurumsal", href: "#kurumsal" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
                    isScrolled
                        ? "bg-background/80 backdrop-blur-md border-border"
                        : "bg-transparent border-transparent"
                }`}
            >
                <div className="container mr-auto px-4 md:px-6 flex justify-between items-center h-20">
                    <SynapseLogo />

                    {/* --- DESKTOP MENU --- */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex items-center gap-2 ml-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                Giriş Yap
                            </Button>
                            {/* "Aramıza Katıl" da şimdilik aynı giriş modalını açabilir veya kayıt modalı varsa ona yönlenir */}
                            <Button onClick={() => router.push("/sign-up")}>
                                Aramıza Katıl <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* --- MOBILE MENU (Sheet) --- */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Menüyü aç</span>
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="top" className="w-full border-b border-border bg-background pb-4">
                                <SheetHeader>
                                    <SheetTitle className="text-left">
                                        <SynapseLogo />
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col gap-4 px-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    <Separator className="-ml-2 min-w-dvw"/>

                                    <div className="flex flex-row gap-3 justify-center">
                                        <Button
                                            variant="secondary"
                                            className="w-fit justify-start"
                                            onClick={() => setIsAuthModalOpen(true)}
                                        >
                                            Giriş Yap
                                        </Button>
                                        <Button
                                            className="w-fit justify-start"
                                            onClick={() => router.push("/sign-up")}
                                        >
                                            Aramıza Katıl <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            {/* Auth Modal Bileşeni */}
            <SignInModal isOpen={isAuthModalOpen} onClose={setIsAuthModalOpen} />
        </>
    );
};