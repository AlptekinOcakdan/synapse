// modules/dashboard/ui/views/mails-view.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { MOCK_MAILS, MOCK_PROJECTS } from "@/lib/data"; // MOCK_PROJECTS eklendi
import { MailThread } from "@/modules/profile/types";
import { ProjectDetailsDialog } from "@/modules/dashboard/ui/components/dashboard/project-details-dialog";
import {MailSidebar} from "@/modules/profile/ui/components/questions/mail-sidebar";
import {MailArea} from "@/modules/profile/ui/components/questions/mail-area"; // Import eklendi

export const MailsView = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. MAIL STATE (Mevcut)
    const currentMailId = searchParams.get("mailId");
    const selectedMail = useMemo(() => {
        if (!currentMailId) return null;
        return MOCK_MAILS.find((m) => m.id === currentMailId) || null;
    }, [currentMailId]);

    // 2. PROJECT MODAL STATE (Yeni Eklenen)
    const currentProjectId = searchParams.get("projectId");
    const selectedProject = useMemo(() => {
        if (!currentProjectId) return null;
        // String/Number dönüşümüne dikkat edin, veri tipinize göre ayarlayın
        return MOCK_PROJECTS.find((p) => String(p.id) === currentProjectId) || null;
    }, [currentProjectId]);

    // Mail Seçme Fonksiyonu
    const handleSelectMail = (mail: MailThread) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mailId", mail.id);
        // Proje detayı açıksa, mail değiştirirken onu kapatmak isteyebilirsiniz veya açık bırakabilirsiniz.
        // params.delete("projectId"); // İsterseniz bu satırı açarak mail değişince modalı kapatabilirsiniz.
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setIsMobileMenuOpen(false);
    };

    // Proje Modalını Kapatma Fonksiyonu
    const handleCloseProjectDialog = (open: boolean) => {
        if (!open) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("projectId");
            // scroll: false ile sayfa zıplamasını engelliyoruz
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <div className="h-[calc(100dvh-5rem)] w-full flex overflow-hidden bg-background relative">

            {/* --- GLOBAL PROJECT MODAL --- */}
            {selectedProject && (
                <ProjectDetailsDialog
                    project={selectedProject}
                    open={true}
                    onOpenChange={handleCloseProjectDialog}
                />
            )}

            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block w-80 lg:w-96 shrink-0 h-full">
                <MailSidebar
                    mails={MOCK_MAILS}
                    selectedMailId={selectedMail?.id || null}
                    onSelectMail={handleSelectMail}
                />
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">
                {/* ... Mobil Sidebar ve Diğer Kodlar Aynı ... */}
                {/* MOBIL SIDEBAR */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Posta Kutusu Menüsü</SheetTitle>
                            <SheetDescription>
                                Gelen kutusu ve arşiv klasörleri arasında geçiş yapın.
                            </SheetDescription>
                        </SheetHeader>
                        <MailSidebar
                            mails={MOCK_MAILS}
                            selectedMailId={selectedMail?.id || null}
                            onSelectMail={handleSelectMail}
                        />
                    </SheetContent>
                </Sheet>

                {selectedMail ? (
                    <MailArea
                        key={selectedMail.id}
                        mailThread={selectedMail}
                        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
                        {/* Boş Durum İçeriği Aynı */}
                        <div className="h-24 w-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                            <Mail className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Posta Kutusu</h3>
                        <p className="max-w-sm text-sm text-muted-foreground mb-6">
                            Akademisyenlerinizle yaptığınız yazışmaları buradan yönetebilirsiniz.
                        </p>
                        <Button
                            className="md:hidden"
                            variant="outline"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            Postaları Aç
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};