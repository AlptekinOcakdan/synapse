"use client";

import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MailThread } from "@/modules/profile/types";

interface MailSidebarProps {
    mails: MailThread[];
    selectedMailId: string | null;
    onSelectMail: (mail: MailThread) => void;
}

export const MailSidebar = ({ mails, selectedMailId, onSelectMail }: MailSidebarProps) => {
    const [search, setSearch] = useState("");

    // Filtreleme: Hem konu hem akademisyen isminde arama
    const filteredMails = mails.filter(m =>
        (m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.academician.name.toLowerCase().includes(search.toLowerCase()))
    );

    const MailListItem = ({ mail }: { mail: MailThread }) => (
        <button
            onClick={() => onSelectMail(mail)}
            className={cn(
                "w-full flex flex-col gap-2 p-3 rounded-lg transition-colors hover:bg-muted/50 text-left border border-transparent",
                selectedMailId === mail.id
                    ? "bg-primary/5 border-primary/10"
                    : "bg-card border-border/40"
            )}
        >
            {/* Üst Kısım: Akademisyen ve Tarih */}
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={mail.academician.avatar} />
                        <AvatarFallback>{mail.academician.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground truncate max-w-30">
                        {mail.academician.name}
                    </span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                    {mail.lastMessageDate}
                </span>
            </div>

            {/* Orta Kısım: Konu ve Proje */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                        "font-semibold text-sm truncate",
                        mail.isUnread ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {mail.subject}
                    </span>
                    {mail.isUnread && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                </div>

                {mail.relatedProject && (
                    <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 h-5 font-normal text-muted-foreground">
                        {mail.relatedProject}
                    </Badge>
                )}
            </div>

            {/* Alt Kısım: Son Mesaj Özeti */}
            <p className="text-xs text-muted-foreground line-clamp-1 opacity-70">
                {mail.messages[mail.messages.length - 1].content}
            </p>
        </button>
    );

    return (
        <div className="flex flex-col h-full border-r bg-background/50 backdrop-blur-sm">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Posta Kutusu</h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Konu veya kişi ara..."
                        className="pl-8 bg-muted/40"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="inbox" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="inbox" className="gap-2">
                            Gelen Kutusu
                        </TabsTrigger>
                        <TabsTrigger value="archive" className="gap-2">
                            Arşiv
                        </TabsTrigger>
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

                <TabsContent value="archive" className="flex-1 min-h-0 m-0">
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Arşivlenmiş mesajınız yok.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};