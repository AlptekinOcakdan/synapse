"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Project } from "@/modules/dashboard/types";
import { AdvisorProjectCard } from "@/modules/academician/ui/components/projects/advisor-project-card";

// --- CONVEX IMPORTS ---
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const AdvisorProjectsView = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Backend'den Projeleri Çek
    // Backend'deki return tipi düzeltildiği için artık burası otomatik olarak Project[] döner.
    const advisorNeededProjects = useQuery(api.academician.getAdvisorSeekingProjects, {
        search: searchQuery
    });

    const applyForMentorship = useMutation(api.academician.applyForMentorship);

    const handleConfirmMentorship = async () => {
        if (!selectedProject) return;
        setIsSubmitting(true);

        try {
            await applyForMentorship({
                projectId: selectedProject.id as Id<"projects">,
                message: message
            });

            toast.success("Danışmanlık talebiniz iletildi.");
            setSelectedProject(null);
            setMessage("");
        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (advisorNeededProjects === undefined) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-full px-4 py-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                    Akademik Danışmanlık
                </h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Aşağıdaki projeler akademik rehberlik ve mentörlük arayışındadır.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Proje ara..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Separator />

            {advisorNeededProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advisorNeededProjects.map((project) => (
                        <AdvisorProjectCard
                            key={project.id}
                            // ARTIK CASTING YOK! Veri tipi birebir uyumlu.
                            project={project}
                            onBecomeAdvisor={setSelectedProject}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? "Aradığınız kriterlere uygun proje bulunamadı."
                            : "Şu an akademik danışman arayan açık bir proje bulunmamaktadır."}
                    </p>
                </div>
            )}

            <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Danışmanlık Başvurusu</DialogTitle>
                        <DialogDescription>
                            <span className="font-semibold text-foreground">&ldquo;{selectedProject?.title}&rdquo;</span> projesi için akademik danışman olmak üzeresiniz.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg text-sm text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                            Proje sahibine bildirim gönderilecektir.
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Öğrencilere Notunuz (Opsiyonel)</label>
                            <Textarea
                                placeholder="Merhaba, projeniz ilgimi çekti..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedProject(null)} disabled={isSubmitting}>
                            İptal
                        </Button>
                        <Button
                            onClick={handleConfirmMentorship}
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Onayla ve Gönder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};