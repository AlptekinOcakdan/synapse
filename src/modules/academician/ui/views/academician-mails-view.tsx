"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";

// --- CONVEX IMPORTS ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// --- COMPONENT IMPORTS ---
import { ProjectDetailsDialog } from "@/modules/dashboard/ui/components/dashboard/project-details-dialog";
import { AcademicianMailSidebar } from "@/modules/academician/ui/components/questions/academician-mail-sidebar";
import { AcademicianMailArea } from "@/modules/academician/ui/components/questions/academician-mail-area";
import { AcademicianMailThread } from "@/modules/academician/types"; // Az önce oluşturduğumuz tip

interface AcademicianMailsViewProps {
    userId: Id<"users">;
}

export const AcademicianMailsView = ({userId}: AcademicianMailsViewProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const viewer = useQuery(api.users.getViewerProfile, {userId: userId});

    const threads = useQuery(
        api.mails.getMailThreads,
        userId ? { userId: userId } : "skip"
    );

    // 3. SEÇİLİ MAİL (URL'den)
    const currentMailId = searchParams.get("mailId");

    const selectedMail = useMemo(() => {
        if (!currentMailId || !threads) return null;
        // Backend'den gelen veri ile Tipimiz eşleşiyor
        return threads.find((m) => m.id === currentMailId) as AcademicianMailThread | null;
    }, [currentMailId, threads]);

    // URL'den proje ID'sini al
    const currentProjectId = searchParams.get("projectId");

    // Mock veriden aramak yerine direkt veritabanından çekiyoruz.
    // Eğer ID varsa sorgu çalışır, yoksa "skip" ile atlanır.
    const fetchedProject = useQuery(
        api.projects.getProject,
        currentProjectId ? { id: currentProjectId as Id<"projects"> } : "skip"
    );

    // Tip güvenliği ve loading kontrolü
    const selectedProject = fetchedProject || null;

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

    // Yükleniyor Durumu
    if (threads === undefined || !viewer) {
        return (
            <div className="h-[calc(100dvh-5rem)] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100dvh-5rem)] w-full flex overflow-hidden bg-background relative">

            {/* --- PROJECT MODAL --- */}
            {selectedProject && (
                <ProjectDetailsDialog
                    project={selectedProject}
                    open={true}
                    onOpenChange={handleCloseProjectDialog}
                />
            )}

            {/* --- DESKTOP SIDEBAR --- */}
            <div className="hidden md:block w-80 lg:w-96 shrink-0 h-full">
                <AcademicianMailSidebar
                    mails={threads as AcademicianMailThread[]}
                    selectedMailId={selectedMail?.id || null}
                    onSelectMail={handleSelectMail}
                />
            </div>

            {/* --- MAIN AREA --- */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">

                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Öğrenci Mesajları</SheetTitle>
                            <SheetDescription>Gelen kutusu</SheetDescription>
                        </SheetHeader>

                        <AcademicianMailSidebar
                            mails={threads as AcademicianMailThread[]}
                            selectedMailId={selectedMail?.id || null}
                            onSelectMail={handleSelectMail}
                        />
                    </SheetContent>
                </Sheet>

                {selectedMail ? (
                    <AcademicianMailArea
                        key={selectedMail.id}
                        mailThread={selectedMail}
                        currentUserId={userId} // TİP GÜVENLİ ID
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