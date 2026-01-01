"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import {Send, Menu, Paperclip, MoreVertical, User, FileText, ImageIcon} from "lucide-react";
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
import { AcademicianMailThread } from "@/modules/academician/types";
import { MOCK_PROJECTS } from "@/lib/data"; // Projeler buradan çekilecek
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {MailMessage} from "@/modules/profile/types";
import {DocumentUploadDialog} from "@/modules/profile/ui/components/questions/document-upload-dialog";
import {PhotoUploadDialog} from "@/modules/profile/ui/components/questions/photo-upload-dialog";

// Bu sabit normalde Auth context'ten gelir, akademisyenin kendi ID'si
const CURRENT_ACADEMICIAN_ID = "ac-1";

interface AcademicianMailAreaProps {
    mailThread: AcademicianMailThread;
    onMobileMenuOpen: () => void;
}

export const AcademicianMailArea = ({ mailThread, onMobileMenuOpen }: AcademicianMailAreaProps) => {
    const [messages, setMessages] = useState<MailMessage[]>(mailThread.messages);
    const [inputValue, setInputValue] = useState("");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
    const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);


    const handleFileUpload = (file: File) => {
        console.log("Dosya alındı, sunucuya gönderiliyor:", file.name, file.type);
        const newMessage = {
            id: crypto.randomUUID(),
            senderId: "current_user_id", // Constants'dan alın
            content: `📎 Dosya Gönderildi: ${file.name}`,
            timestamp: new Date().toISOString(),
            isRead: true
        };

        // setMessages([...messages, newMessage]); // State'i güncelle
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: MailMessage = {
            id: crypto.randomUUID(),
            senderId: CURRENT_ACADEMICIAN_ID,
            content: inputValue.trim(),
            timestamp: new Date().toISOString(),
            isRead: true
        };

        setMessages([...messages, newMessage]);
        setInputValue("");
    };

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    // Proje Detayını Açma Fonksiyonu
    const handleOpenProject = () => {
        if (!mailThread.relatedProject) return;

        const project = MOCK_PROJECTS.find(p =>
            p.title.toLowerCase().trim() === mailThread.relatedProject?.toLowerCase().trim()
        );

        if (project) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("projectId", String(project.id));
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-background relative">

            {/* --- HEADER --- */}
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

                        <div className="space-y-1">
                            <h3 className="font-bold text-lg leading-tight flex flex-col lg:flex-row lg:items-center gap-2">
                                {mailThread.subject}
                                {mailThread.relatedProject && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs font-normal cursor-pointer hover:bg-secondary/80 transition-colors whitespace-break-spaces"
                                        onClick={handleOpenProject}
                                    >
                                        {mailThread.relatedProject}
                                    </Badge>
                                )}
                            </h3>
                            {/* Öğrenci Detayı */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-foreground/80">{mailThread.student.name}</span>
                                <span className="text-xs opacity-50">•</span>
                                <span className="text-xs">{mailThread.student.grade}</span>
                                <span className="text-xs opacity-50">•</span>
                                <span className="text-xs">{mailThread.student.department}</span>
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
                            <DropdownMenuItem>Öğrenci Profilini Gör</DropdownMenuItem>
                            <DropdownMenuItem>Arşivle</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* --- MESSAGE LIST --- */}
            <ScrollArea className="h-[calc(100dvh-5rem)] px-4 bg-muted/5">
                <div className="flex flex-col gap-6 pb-6 pt-6 max-w-4xl mx-auto">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === CURRENT_ACADEMICIAN_ID;

                        return (
                            <div key={msg.id} className={cn(
                                "flex flex-col gap-2 p-4 rounded-xl border shadow-sm",
                                isMe ? "bg-white dark:bg-card ml-12 border-primary/20" : "bg-white dark:bg-card mr-12"
                            )}>
                                <div className="flex items-center justify-between border-b pb-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            {isMe ? (
                                                <AvatarFallback className="bg-primary/10 text-primary">DR</AvatarFallback>
                                            ) : (
                                                <AvatarImage src={mailThread.student.avatar} />
                                            )}
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {isMe ? "Siz" : mailThread.student.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {isMe ? "Akademisyen" : "Öğrenci"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(msg.timestamp).toLocaleString('tr-TR', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* --- REPLY INPUT --- */}
            <div className="p-4 border-t bg-background shrink-0">
                <div className="max-w-4xl mx-auto flex flex-col gap-2">
                    <div className="relative">
                        <Textarea
                            placeholder="Yanıtınızı buraya yazın..."
                            className="min-h-25 resize-none pr-12 bg-muted/20 focus:bg-background transition-colors"
                            value={inputValue}
                            onChange={handleInput}
                        />
                        <div className="absolute bottom-2 right-2 flex gap-2">
                            {/* DROPDOWN MENU BAŞLANGICI */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
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
                        <Button onClick={handleSendMessage} disabled={!inputValue.trim()} className="gap-2">
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