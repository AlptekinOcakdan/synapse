"use client";

import {usePathname} from "next/navigation";
import {SynapseLogo} from "@/components/synapse-logo";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Menu} from "lucide-react";

export const AcademicianNavigationBar = () => {
    const pathname = usePathname();

    const navLinks = [
        { name: "Projeler", href: "/academician" },
        { name: "Sorular", href: "/academician/questions" },
    ];
    return (
        <header className="top-0 w-full transitio-all duration-300 border-b h-20">
            <nav className="h-full px-4 md:px-6 flex items-center">
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex flex-row items-center gap-4 shrink-0">
                        <SynapseLogo/>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 mr-2">
                            {navLinks.map((link) => (
                                <Button key={link.name} variant="nav" size="sm" asChild data-active={pathname === link.href}>
                                    <Link href={link.href}>
                                        {link.name}
                                    </Link>
                                </Button>
                            ))}
                            <Separator orientation="vertical" className="h-6 w-px hidden lg:block"/>
                        </div>
                        {/*<AuthButton/>*/}
                        <div className="md:hidden flex items-center ml-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                                        <Menu className="h-6 w-6"/>
                                        <span className="sr-only">Menüyü aç</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 mt-2">
                                    {navLinks.map((link) => (
                                        <DropdownMenuItem key={link.name} asChild>
                                            <Link href={link.href} className={`w-full cursor-pointer ${pathname === link.href ? "font-bold text-primary" : ""}`}>
                                                {link.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="w-full cursor-pointer">
                                            Proje Pazarına Dön
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};