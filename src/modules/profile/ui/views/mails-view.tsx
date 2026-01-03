"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MailSidebar } from "@/modules/profile/ui/components/questions/mail-sidebar";
import { MailArea } from "@/modules/profile/ui/components/questions/mail-area";
import { MailThread } from "@/modules/profile/types"; // Tipleri buradan çekiyoruz

// --- CONVEX ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface MailsViewProps {
    userId: Id<"users">;
}

export const MailsView = ({userId}:MailsViewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const viewer = useQuery(api.users.getViewerProfile, { userId: userId });

    // 1. DATA FETCHING
    // viewer yüklenmeden sorgu yapma ("skip")
    const threads = useQuery(
        api.mails.getMailThreads,
        userId ? { userId: userId } : "skip"
    );

    // 2. MAIL SEÇİMİ
    const currentMailId = searchParams.get("mailId");

    const selectedMail = useMemo(() => {
        if (!currentMailId || !threads) return null;
        return threads.find((m) => m.id === currentMailId) || null;
    }, [currentMailId, threads]);

    const handleSelectMail = (mail: MailThread) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mailId", mail.id);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setIsMobileMenuOpen(false);
    };

    // Loading State
    if (threads === undefined || !viewer) {
        return (
            <div className="h-[calc(100dvh-5rem)] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100dvh-5rem)] w-full flex overflow-hidden bg-background relative">
            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block w-80 lg:w-96 shrink-0 h-full">
                <MailSidebar
                    mails={threads} // Artık tip tam uyumlu, hata vermez
                    selectedMailId={selectedMail?.id || null}
                    onSelectMail={handleSelectMail}
                />
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">

                {/* MOBIL SIDEBAR */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Posta Kutusu</SheetTitle>
                            <SheetDescription>Menü</SheetDescription>
                        </SheetHeader>
                        <MailSidebar
                            mails={threads}
                            selectedMailId={selectedMail?.id || null}
                            onSelectMail={handleSelectMail}
                        />
                    </SheetContent>
                </Sheet>

                {selectedMail ? (
                    <MailArea
                        key={selectedMail.id}
                        mailThread={selectedMail}
                        currentUserId={userId} // MailArea'ya ID'yi gönderiyoruz
                        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
                        <div className="h-24 w-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                            <Mail className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Posta Kutusu</h3>
                        <p className="max-w-sm text-sm text-muted-foreground mb-6">
                            Akademisyenlerinizle yaptığınız yazışmaları buradan yönetebilirsiniz.
                        </p>
                        <Button className="md:hidden" variant="outline" onClick={() => setIsMobileMenuOpen(true)}>
                            Postaları Aç
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};