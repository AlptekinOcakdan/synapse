"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { Project } from "../../../types";
import { LayoutProps } from "@/lib/utils";

// --- CONVEX & TOAST IMPORTS ---
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel"; // Toast bildirimi

interface ApplyProjectDialogProps extends LayoutProps {
    project: Project;
}

export const ApplyProjectDialog = ({ project, children }: ApplyProjectDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [motivation, setMotivation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const applyMutation = useMutation(api.applications.applyToProject);

    const MAX_CHARS = 1000;

    const handleSubmit = async () => {
        if (!motivation.trim()) return;

        setIsSubmitting(true);

        try {
            // Backend'e istek atıyoruz
            await applyMutation({
                // Frontend'deki string ID'yi Convex ID tipine çeviriyoruz
                projectId: project.id as Id<"projects">,
                motivation: motivation,
            });

            // Başarılı olursa
            toast.success("Başvurunuz başarıyla iletildi!");
            setIsOpen(false);
            setMotivation("");

        } catch (error) {
            console.error("Başvuru hatası:", error);
            // Backend'den gelen hatayı (örn: "Zaten başvurdunuz") kullanıcıya göster
            const errorMessage = error instanceof Error ? error.message : "Başvuru sırasında bir hata oluştu.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Projeye Başvur</DialogTitle>
                    <DialogDescription>
                        <span className="font-semibold text-primary">{project.title}</span> projesi için başvuru yapıyorsunuz.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="motivation">Motivasyon Mektubu</Label>
                        <Textarea
                            id="motivation"
                            placeholder="Neden bu projede yer almak istiyorsun? Yeteneklerinden ve katkılarından bahset..."
                            className="h-40 resize-none focus-visible:ring-primary"
                            maxLength={MAX_CHARS}
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Kendini ifade etmek için harika bir fırsat.</span>
                            <span className={motivation.length >= MAX_CHARS ? "text-destructive" : ""}>
                                {motivation.length}/{MAX_CHARS}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex w-full justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                            İptal
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || motivation.length === 0}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    Gönder <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};