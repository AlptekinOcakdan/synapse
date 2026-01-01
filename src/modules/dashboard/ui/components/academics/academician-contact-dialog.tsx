"use client";

import {FormEvent, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Mail, Link2, Loader2 } from "lucide-react";
import { Academician } from "@/modules/dashboard/types";
import { MOCK_PROJECTS } from "@/lib/data";
import {LayoutProps} from "@/lib/utils";

interface AcademicianContactDialogProps extends LayoutProps {
    academician: Academician;
}

export const AcademicianContactDialog = ({ academician, children }: AcademicianContactDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

    // Kullanıcının kendi projelerini filtreliyoruz (Örnek olarak hepsini gösteriyoruz)
    // Gerçek uygulamada: MOCK_PROJECTS.filter(p => p.owner.id === currentUserId)
    const myProjects = MOCK_PROJECTS;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // API isteği simülasyonu
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("E-posta Gönderildi:", {
            to: academician.email,
            subject,
            message,
            relatedProject: selectedProjectId
        });

        setIsLoading(false);
        setOpen(false);
        setSubject("");
        setMessage("");
        setSelectedProjectId(undefined);

        // Buraya bir Toast (Success Notification) eklenebilir.
        alert("E-postanız başarıyla gönderildi!");
    };

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" /> İletişime Geç
                    </DialogTitle>
                    <DialogDescription>
                        Aşağıdaki formu doldurarak akademisyene doğrudan e-posta gönderebilirsiniz.
                    </DialogDescription>
                </DialogHeader>

                {/* Kime Kısmı - Görsel Bilgi */}
                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={academician.avatar} />
                        <AvatarFallback>{getInitials(academician.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{academician.name}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">

                    {/* Proje Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="project" className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5" /> İlgili Proje (Opsiyonel)
                        </Label>
                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                            <SelectTrigger id="project" className="bg-background">
                                <SelectValue placeholder="Bir proje seçiniz..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Proje ile ilgisi yok</SelectItem>
                                {myProjects.map((project) => (
                                    <SelectItem key={project.id} value={String(project.id)}>
                                        {project.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Konu */}
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-xs font-semibold text-muted-foreground uppercase">
                            Konu
                        </Label>
                        <Input
                            id="subject"
                            placeholder="Örn: Bitirme Projesi Mentörlük Talebi"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    {/* Mesaj İçeriği */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase">
                            Mesajınız
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Sayın hocam, ..."
                            className="min-h-30 resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={isLoading || !subject || !message}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gönderiliyor
                                </>
                            ) : (
                                <>
                                    Gönder <Send className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};