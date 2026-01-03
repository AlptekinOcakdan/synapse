"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Send, Menu, Paperclip, MoreVertical, GraduationCap, FileText, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MailThread } from "@/modules/profile/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DocumentUploadDialog } from "@/modules/profile/ui/components/questions/document-upload-dialog";
import { PhotoUploadDialog } from "@/modules/profile/ui/components/questions/photo-upload-dialog";

// --- CONVEX IMPORTS ---
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface MailAreaProps {
    mailThread: MailThread;
    currentUserId: Id<"users">; // Mesajı kimin attığını belirlemek için gerekli
    onMobileMenuOpen: () => void;
}

export const MailArea = ({ mailThread, currentUserId, onMobileMenuOpen }: MailAreaProps) => {
    // 1. MESAJLARI ÇEK (Real-time)
    // mailThread.id'nin Convex ID formatında geldiğinden emin olun (Types dosyasında Id<"mailThreads"> yapmıştık)
    const messages = useQuery(api.mails.getMessages, {
        threadId: mailThread.id as Id<"mailThreads">
    });

    // 2. MESAJ GÖNDERME MUTATION
    const sendMessage = useMutation(api.mails.sendMessage);

    const [inputValue, setInputValue] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
    const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

    // Otomatik Scroll (Mesajlar güncellendiğinde en alta in)
    useEffect(() => {
        if (messages && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const content = inputValue.trim();
        setInputValue(""); // Optimistik UI temizliği

        try {
            await sendMessage({
                threadId: mailThread.id as Id<"mailThreads">,
                senderId: currentUserId,
                content: content
            });
        } catch (error) {
            console.error("Mesaj gönderilemedi:", error);
            // Hata olursa inputu geri doldurabilir veya toast gösterebilirsiniz
        }
    };

    const handleFileUpload = async (file: File) => {
        // Not: Gerçek dosya yükleme (AWS S3 vb.) entegrasyonu buraya gelecek.
        // Şimdilik dosya ismini mesaj olarak gönderiyoruz.
        console.log("Dosya seçildi:", file.name);

        try {
            await sendMessage({
                threadId: mailThread.id as Id<"mailThreads">,
                senderId: currentUserId,
                content: `📎 Dosya Gönderildi: ${file.name}`
            });
        } catch (error) {
            console.error("Dosya mesajı gönderilemedi:", error);
        }
    };

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    // İlgili Projeye Gitme Mantığı
    const handleOpenProject = () => {
        if (!mailThread.relatedProjectId) {
            console.log("Mailde ilişkili proje ID'si yok.");
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set("projectId", mailThread.relatedProjectId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Yükleniyor Durumu
    if (!messages) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-background relative">

            {/* --- MAIL HEADER --- */}
            <div className="min-h-16 border-b flex flex-col justify-center px-4 md:px-6 py-3 bg-background/80 backdrop-blur shrink-0 gap-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden -ml-2 text-muted-foreground"
                            onClick={onMobileMenuOpen}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Konu Başlığı */}
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                                {mailThread.subject}
                                {mailThread.relatedProject && (
                                    <Badge variant="secondary" className="text-xs font-normal cursor-pointer hover:bg-secondary/80 transition-colors" onClick={handleOpenProject}>
                                        {mailThread.relatedProject}
                                    </Badge>
                                )}
                            </h3>
                            {/* Alıcı/Gönderen Bilgisi */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap className="w-4 h-4" />
                                <span>{mailThread.academician.title} {mailThread.academician.name}</span>
                                <span className="text-xs opacity-50">•</span>
                                <span className="text-xs">{mailThread.academician.department}</span>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Arşivle</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Sil</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* --- MAIL CONTENT --- */}
            <ScrollArea className="h-[calc(100dvh-5rem)] w-full px-4 bg-muted/5">
                <div className="flex flex-col gap-6 pb-6 pt-6 max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-10 opacity-70">
                            Henüz bu konuşmada bir mesaj yok.
                        </div>
                    ) : (
                        messages.map((msg) => {
                            // Backend'den gelen senderId string'ini, currentUserId (ID Object) ile karşılaştırıyoruz
                            const isMe = msg.senderId === String(currentUserId);

                            return (
                                <div key={msg.id} className={cn(
                                    "flex flex-col gap-2 p-4 rounded-xl border shadow-xs transition-all",
                                    isMe ? "bg-white dark:bg-card ml-8 border-primary/20" : "bg-white dark:bg-card mr-8"
                                )}>
                                    {/* Mesaj Header */}
                                    <div className="flex items-center justify-between border-b pb-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                {isMe ? (
                                                    <AvatarFallback className="bg-primary/10 text-primary">BN</AvatarFallback>
                                                ) : (
                                                    <AvatarImage src={mailThread.academician.avatar} />
                                                )}
                                                {!isMe && <AvatarFallback>AK</AvatarFallback>}
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {isMe ? "Ben" : mailThread.academician.name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {isMe ? "Öğrenci" : "Akademisyen"}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(msg.timestamp).toLocaleString('tr-TR', {
                                                day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {/* Mesaj İçeriği */}
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* --- REPLY AREA --- */}
            <div className="p-4 border-t bg-background shrink-0">
                <div className="max-w-4xl mx-auto flex flex-col gap-2">
                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            placeholder="Yanıtınızı buraya yazın..."
                            className="min-h-25 resize-none pr-12 bg-muted/20 focus:bg-background transition-colors focus-visible:ring-1"
                            value={inputValue}
                            onChange={handleInput}
                        />

                        <div className="absolute bottom-2 right-2 flex gap-2">
                            {/* DROPDOWN MENU */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => setIsDocDialogOpen(true)} className="cursor-pointer gap-2">
                                        <FileText className="w-4 h-4" /> Belge Yükle
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsPhotoDialogOpen(true)} className="cursor-pointer gap-2">
                                        <ImageIcon className="w-4 h-4" /> Fotoğraf Yükle
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="gap-2 shadow-sm"
                        >
                            Yanıtla <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <DocumentUploadDialog
                open={isDocDialogOpen}
                onOpenChange={setIsDocDialogOpen}
                onSend={handleFileUpload}
            />

            <PhotoUploadDialog
                open={isPhotoDialogOpen}
                onOpenChange={setIsPhotoDialogOpen}
                onSend={handleFileUpload}
            />
        </div>
    );
};