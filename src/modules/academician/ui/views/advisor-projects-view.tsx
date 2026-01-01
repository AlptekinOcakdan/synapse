"use client";

import { useState } from "react";
import { MOCK_PROJECTS } from "@/lib/data";
import { Search } from "lucide-react";
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
import {Project} from "@/modules/dashboard/types";
import {AdvisorProjectCard} from "@/modules/academician/ui/components/projects/advisor-project-card"; // Opsiyonel: Toast bildirimi için

export const AdvisorProjectsView = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [message, setMessage] = useState("");

    // SADECE AKADEMİSYEN ARAYAN VE HENÜZ DANIŞMANI OLMAYAN PROJELER
    const advisorNeededProjects = MOCK_PROJECTS.filter(p =>
        p.needsAdvisor &&
        !p.advisor &&
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfirmMentorship = () => {
        if (!selectedProject) return;

        // Burada Backend'e istek atılacak
        console.log(`Proje ID: ${selectedProject.id} için danışmanlık isteği gönderildi. Mesaj: ${message}`);

        toast.success("Danışmanlık talebiniz proje sahibine iletildi.");

        setSelectedProject(null);
        setMessage("");
    };

    return (
        <div className="space-y-8 max-w-full px-4 py-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                    Akademik Danışmanlık
                </h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Aşağıdaki projeler akademik rehberlik ve mentörlük arayışındadır. Uzmanlık alanınıza uygun projelere destek olarak öğrencilerin gelişimine katkıda bulunabilirsiniz.
                </p>
            </div>

            {/* Filter Bar */}
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
                {/* İleride Bölüm Filtresi Eklenebilir */}
            </div>

            <Separator />

            {/* Grid List */}
            {advisorNeededProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advisorNeededProjects.map((project) => (
                        <AdvisorProjectCard
                            key={project.id}
                            project={project}
                            onBecomeAdvisor={setSelectedProject}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">Şu an akademik danışman arayan açık bir proje bulunmamaktadır.</p>
                </div>
            )}

            {/* Danışmanlık Onay Modalı */}
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
                            Proje sahibine bildirim gönderilecektir. Kabul edildiğinde proje detaylarında <strong>Danışman</strong> olarak listeleneceksiniz.
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Öğrencilere Notunuz (Opsiyonel)</label>
                            <Textarea
                                placeholder="Merhaba, projeniz ilgimi çekti. Ofis saatlerimde görüşebiliriz..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedProject(null)}>İptal</Button>
                        <Button onClick={handleConfirmMentorship} className="bg-indigo-600 hover:bg-indigo-700">
                            Onayla ve Gönder
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};