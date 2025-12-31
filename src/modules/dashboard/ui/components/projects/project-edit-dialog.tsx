"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, UserMinus} from "lucide-react";
import {LayoutProps} from "@/lib/utils";
import {Project} from "@/modules/dashboard/types";

interface ProjectEditDialogProps extends LayoutProps{
    project: Project;
}

export const ProjectEditDialog = ({ project, children }: ProjectEditDialogProps) => {
    // Local State for Editing
    const [title, setTitle] = useState(project.title);
    const [summary, setSummary] = useState(project.summary);
    const [participantsNeeded, setParticipantsNeeded] = useState(project.participantsNeeded);
    // Katılımcıları mock state olarak tutuyoruz
    const [participants, setParticipants] = useState(project.participants);

    const handleRemoveParticipant = (id: number) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="w-full max-w-2xl max-h-[85dvh] h-auto flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle>Projeyi Düzenle</DialogTitle>
                    <DialogDescription>
                        Proje detaylarını ve ekip arkadaşlarını buradan yönetebilirsin.
                    </DialogDescription>
                </DialogHeader>

                    <ScrollArea className="h-[calc(85dvh-10rem)] w-full">
                        <div className="p-6 space-y-6">

                            {/* 1. GENEL BİLGİLER */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Proje Başlığı</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Proje Özeti</Label>
                                    <Textarea
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        className="min-h-25"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Aranan Ek Katılımcı Sayısı</Label>
                                    <Input
                                        type="number"
                                        value={participantsNeeded}
                                        onChange={(e) => setParticipantsNeeded(Number(e.target.value))}
                                        className="w-full md:w-1/3"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-border my-4" />

                            {/* 2. KATILIMCI YÖNETİMİ */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Mevcut Katılımcılar</Label>
                                    <span className="text-xs text-muted-foreground">
                                        {participants.length} Kişi
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {participants.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.department}</p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRemoveParticipant(user.id)}
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {participants.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic text-center py-4">
                                            Henüz katılımcı yok.
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </ScrollArea>

                <div className="p-4 border-t bg-background shrink-0 flex justify-end gap-2 rounded-b-lg">
                    <Button variant="outline">İptal</Button>
                    <Button>
                        <Save className="w-4 h-4 mr-2" /> Değişiklikleri Kaydet
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};