"use client";

import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AcademicianMailThread } from "@/modules/academician/types";

interface AcademicianMailSidebarProps {
    mails: AcademicianMailThread[];
    selectedMailId: string | null;
    onSelectMail: (mail: AcademicianMailThread) => void;
}

export const AcademicianMailSidebar = ({ mails, selectedMailId, onSelectMail }: AcademicianMailSidebarProps) => {
    const [search, setSearch] = useState("");

    const filteredMails = mails.filter(m =>
        (m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.student.name.toLowerCase().includes(search.toLowerCase()))
    );

    const MailListItem = ({ mail }: { mail: AcademicianMailThread }) => (
        <button
            onClick={() => onSelectMail(mail)}
            className={cn(
                "w-full flex flex-col gap-2 p-3 rounded-lg transition-colors hover:bg-muted/50 text-left border border-transparent",
                selectedMailId === mail.id
                    ? "bg-primary/5 border-primary/10"
                    : "bg-card border-border/40"
            )}
        >
            {/* Üst Kısım: Öğrenci Bilgisi */}
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border bg-background">
                        <AvatarImage src={mail.student.avatar} />
                        <AvatarFallback>{mail.student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden text-left">
                        <span className="text-sm font-semibold truncate max-w-35">
                            {mail.student.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                            {mail.student.department}
                        </span>
                    </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-1">
                    {mail.lastMessageDate}
                </span>
            </div>

            {/* Orta Kısım: Konu ve Proje */}
            <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                        "font-medium text-xs truncate",
                        mail.isUnread ? "text-foreground font-bold" : "text-muted-foreground"
                    )}>
                        {mail.subject}
                    </span>
                    {mail.isUnread && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                </div>

                {mail.relatedProject && (
                    <Badge variant="outline" className="w-fit text-[9px] px-1.5 py-0 h-4 font-normal text-muted-foreground bg-muted/50">
                        {mail.relatedProject}
                    </Badge>
                )}
            </div>

            {/* Alt Kısım: Mesaj Özeti */}
            <p className="text-[11px] text-muted-foreground line-clamp-1 opacity-70 mt-1">
                {mail.messages[mail.messages.length - 1].content}
            </p>
        </button>
    );

    return (
        <div className="flex flex-col h-full border-r bg-background/50 backdrop-blur-sm">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Öğrenci Mesajları</h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Öğrenci veya konu ara..."
                        className="pl-8 bg-muted/40"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="inbox" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="inbox">Gelen Kutusu</TabsTrigger>
                        <TabsTrigger value="sent">Gönderilenler</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="inbox" className="flex-1 min-h-0 m-0">
                    <ScrollArea className="h-full px-4 py-2">
                        <div className="space-y-2">
                            {filteredMails.map(mail => (
                                <MailListItem key={mail.id} mail={mail} />
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
};