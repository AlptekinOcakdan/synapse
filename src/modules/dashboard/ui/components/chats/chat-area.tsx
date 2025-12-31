"use client";

import { useState, useRef, useEffect } from "react";
import {Send, Info, Menu} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {ChatSession, Message} from "@/modules/dashboard/types";
import {CURRENT_USER_ID} from "@/lib/data";

interface ChatAreaProps {
    chat: ChatSession;
    onMobileMenuOpen: () => void; // YENİ PROP
}

export const ChatArea = ({ chat, onMobileMenuOpen }: ChatAreaProps) => {
    const [messages, setMessages] = useState<Message[]>(chat.messages);
    const [inputValue, setInputValue] = useState("");
    const [detailMessage, setDetailMessage] = useState<Message | null>(null); // Dialog için seçilen mesaj

    // Auto-resize Textarea Ref
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Scroll Ref
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mesaj gönderilince en alta kaydır
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: crypto.randomUUID(),
            senderId: CURRENT_USER_ID,
            content: inputValue.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, newMessage]);
        setInputValue("");

        // Textarea yüksekliğini sıfırla
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Textarea otomatik yükseklik ayarı (max 4 satır)
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        const target = e.target;
        target.style.height = "auto";
        target.style.height = `${Math.min(target.scrollHeight, 100)}px`; // ~4 satır (24px * 4 + padding)
    };

    // Gönderici ismini bulma helper'ı
    const getSender = (senderId: number) => {
        return chat.participants.find(p => p.id === senderId);
    };

    return (
        <div className="flex flex-col h-full w-full bg-background relative">

            {/* --- HEADER --- */}
            <div className="h-16 border-b flex items-center px-4 md:px-6 justify-between bg-background/80 backdrop-blur shrink-0">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden -ml-2 text-muted-foreground"
                        onClick={onMobileMenuOpen}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{chat.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {chat.type === "group"
                                ? `${chat.participants.length} üye`
                                : "Çevrimiçi"}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- MESSAGES LIST --- */}
            <ScrollArea className="h-[calc(100dvh-14.25rem)] mx-4 ">
                <div className="flex flex-col gap-4 pb-4 pt-4">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === CURRENT_USER_ID;
                        const sender = getSender(msg.senderId);

                        return (
                            <ContextMenu key={msg.id}>
                                <ContextMenuTrigger>
                                    <div
                                        className={cn(
                                            "flex w-full gap-2 md:gap-3 max-w-[85%] md:max-w-[75%]",
                                            isMe ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                                        )}
                                    >
                                        {/* Avatar (Her iki tarafta da göster) */}
                                        <Avatar className="h-8 w-8 shrink-0 mt-0.5 border">
                                            <AvatarImage src={sender?.avatar} />
                                            <AvatarFallback className="text-[10px]">
                                                {sender?.name.substring(0,2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Balon */}
                                        <div className={cn(
                                            "flex flex-col px-4 py-2 rounded-2xl text-sm shadow-sm",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted text-foreground rounded-tl-none"
                                        )}>
                                            {/* Grup sohbeti ise ve gönderen ben değilsem isim yaz */}
                                            {chat.type === "group" && !isMe && (
                                                <span className="text-[10px] font-bold text-primary mb-1 opacity-80">
                                                    {sender?.name}
                                                </span>
                                            )}

                                            <span className="leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </span>

                                            <span className={cn(
                                                "text-[9px] self-end mt-1 opacity-70",
                                                isMe ? "text-primary-foreground" : "text-muted-foreground"
                                            )}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onClick={() => setDetailMessage(msg)}>
                                        <Info className="w-4 h-4 mr-2" /> Detaylar
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        );
                    })}
                    {/* Scroll Anchor */}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* --- INPUT AREA --- */}
            <div className="p-4 border-t bg-background shrink-0">
                <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border focus-within:ring-1 focus-within:ring-ring transition-all">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Bir mesaj yazın..."
                        // GÜNCELLEME: 'break-words', 'whitespace-pre-wrap' ve 'w-full' eklendi
                        className="min-h-6 max-h-25 w-[calc(100dvw-6rem)] border-none shadow-none focus-visible:ring-0 resize-none bg-transparent px-2 py-1.5 md:w-[calc(85dvw-11.75rem)] wrap-break-word whitespace-pre-wrap"
                        rows={1}
                        value={inputValue}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        size="icon"
                        className={cn("h-8 w-8 shrink-0 rounded-lg transition-all", inputValue.trim() ? "opacity-100" : "opacity-50")}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* --- MESSAGE DETAIL DIALOG --- */}
            <Dialog open={!!detailMessage} onOpenChange={(open) => !open && setDetailMessage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mesaj Detayı</DialogTitle>
                        <DialogDescription>Mesajın gönderim bilgileri.</DialogDescription>
                    </DialogHeader>
                    {detailMessage && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Avatar>
                                    <AvatarImage src={getSender(detailMessage.senderId)?.avatar} />
                                    <AvatarFallback>{getSender(detailMessage.senderId)?.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">Gönderen</p>
                                    <p className="text-sm text-muted-foreground">{getSender(detailMessage.senderId)?.name}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">İÇERİK</p>
                                <div className="p-3 border rounded-md text-sm bg-background">
                                    {detailMessage.content}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">ZAMAN</p>
                                <p className="text-sm">
                                    {new Date(detailMessage.timestamp).toLocaleString("tr-TR", {
                                        dateStyle: "full",
                                        timeStyle: "medium"
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
};