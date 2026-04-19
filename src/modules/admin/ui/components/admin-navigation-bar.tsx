"use client";

import {SynapseLogo} from "@/components/synapse-logo";
import {AuthButton} from "@/modules/auth/ui/components/auth-button";

export const AdminNavigationBar = () => {
    return (
        <header className="top-0 w-full border-b h-16">
            <nav className="h-full px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <SynapseLogo/>
                    <span className="text-sm text-muted-foreground font-medium">Yönetim Paneli</span>
                </div>
                <AuthButton/>
            </nav>
        </header>
    );
};