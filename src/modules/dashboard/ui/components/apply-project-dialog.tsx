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
import { Project } from "../../types";
import {LayoutProps} from "@/lib/utils";

interface ApplyProjectDialogProps extends LayoutProps{
    project: Project;
}

export const ApplyProjectDialog = ({ project, children }: ApplyProjectDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [motivation, setMotivation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MAX_CHARS = 1000;

    const handleSubmit = async () => {
        if (!motivation.trim()) return;

        setIsSubmitting(true);

        // API isteği simülasyonu
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Başvuru gönderildi:", {
            projectId: project.id,
            motivation: motivation
        });

        // Başarılı işlem sonrası
        setIsSubmitting(false);
        setIsOpen(false);
        setMotivation("");

        // Eğer toast kullanıyorsan:
        // toast.success("Başvurunuz başarıyla iletildi!");
        alert("Başvurunuz başarıyla iletildi!"); // Geçici bildirim
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
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