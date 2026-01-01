"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";

// Importlar (Kendi dosya yollarınıza göre ayarlayın)
import { MOCK_ACADEMICIAN_MAILS } from "@/lib/data";
import { MOCK_PROJECTS } from "@/lib/data";
import { AcademicianMailThread } from "@/modules/academician/types";
import { ProjectDetailsDialog } from "@/modules/dashboard/ui/components/dashboard/project-details-dialog";
import {AcademicianMailSidebar} from "@/modules/academician/ui/components/questions/academician-mail-sidebar";
import {AcademicianMailArea} from "@/modules/academician/ui/components/questions/academician-mail-area";

export const AcademicianMailsView = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. Mail State (URL Driven)
    const currentMailId = searchParams.get("mailId");
    const selectedMail = useMemo(() => {
        if (!currentMailId) return null;
        return MOCK_ACADEMICIAN_MAILS.find((m) => m.id === currentMailId) || null;
    }, [currentMailId]);

    // 2. Project Modal State (URL Driven)
    const currentProjectId = searchParams.get("projectId");
    const selectedProject = useMemo(() => {
        if (!currentProjectId) return null;
        return MOCK_PROJECTS.find((p) => String(p.id) === currentProjectId) || null;
    }, [currentProjectId]);

    const handleSelectMail = (mail: AcademicianMailThread) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mailId", mail.id);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setIsMobileMenuOpen(false);
    };

    const handleCloseProjectDialog = (open: boolean) => {
        if (!open) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("projectId");
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
                <AcademicianMailSidebar
                    mails={MOCK_ACADEMICIAN_MAILS}
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
                            <SheetTitle>Öğrenci Mesajları</SheetTitle>
                            <SheetDescription>Gelen kutusuna göz atın.</SheetDescription>
                        </SheetHeader>

                        <AcademicianMailSidebar
                            mails={MOCK_ACADEMICIAN_MAILS}
                            selectedMailId={selectedMail?.id || null}
                            onSelectMail={handleSelectMail}
                        />
                    </SheetContent>
                </Sheet>

                {selectedMail ? (
                    <AcademicianMailArea
                        key={selectedMail.id}
                        mailThread={selectedMail}
                        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
                        <div className="h-24 w-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                            <Mail className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Akademisyen Posta Kutusu</h3>
                        <p className="max-w-sm text-sm text-muted-foreground mb-6">
                            Öğrencilerden gelen proje taleplerini ve soruları buradan yönetebilirsiniz.
                        </p>
                        <Button
                            className="md:hidden"
                            variant="outline"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            Mesajları Aç
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};