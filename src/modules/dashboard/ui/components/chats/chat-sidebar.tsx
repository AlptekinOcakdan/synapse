"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {ChatSession} from "@/modules/dashboard/types";

interface ChatSidebarProps {
    chats: ChatSession[];
    selectedChatId: string | null;
    onSelectChat: (chat: ChatSession) => void;
}

export const ChatSidebar = ({ chats, selectedChatId, onSelectChat }: ChatSidebarProps) => {
    const [search, setSearch] = useState("");

    // Filtreleme Fonksiyonu
    const filterChats = (type: "direct" | "group") => {
        return chats.filter(c =>
            c.type === type &&
            c.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const ChatListItem = ({ chat }: { chat: ChatSession }) => (
        <button
            onClick={() => onSelectChat(chat)}
            className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 text-left",
                selectedChatId === chat.id && "bg-muted"
            )}
        >
            <Avatar className="h-10 w-10 border bg-background">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="font-medium truncate text-sm">{chat.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{chat.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground truncate max-w-35">
                        {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                            {chat.unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </button>
    );

    return (
        <div className="flex flex-col h-full border-r bg-background/50 backdrop-blur-sm">
            {/* Header & Search */}
            <div className="p-4 border-b space-y-4">
                <h2 className="text-xl font-bold px-1">Sohbetler</h2>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Sohbet ara..."
                        className="pl-8 bg-muted/40"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs & List */}
            <Tabs defaultValue="direct" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="direct">Bireysel</TabsTrigger>
                        <TabsTrigger value="group">Gruplar</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="direct" className="flex-1 min-h-0 m-0">
                    <ScrollArea className="h-full px-2 py-2">
                        <div className="space-y-1">
                            {filterChats("direct").map(chat => (
                                <ChatListItem key={chat.id} chat={chat} />
                            ))}
                            {filterChats("direct").length === 0 && (
                                <p className="text-center text-xs text-muted-foreground py-4">Sohbet bulunamadı.</p>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="group" className="flex-1 min-h-0 m-0">
                    <ScrollArea className="h-full px-2 py-2">
                        <div className="space-y-1">
                            {filterChats("group").map(chat => (
                                <ChatListItem key={chat.id} chat={chat} />
                            ))}
                            {filterChats("group").length === 0 && (
                                <p className="text-center text-xs text-muted-foreground py-4">Grup bulunamadı.</p>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
};