"use client";

import {useState, useRef, useEffect, ChangeEvent, KeyboardEvent} from "react";
import { Send, Info, Menu, Loader2, ArrowUp } from "lucide-react";
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

// --- CONVEX IMPORTS ---
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// --- STRICT TYPES ---

interface Message {
    id: Id<"messages">;
    senderId: Id<"users">;
    content: string;
    timestamp: string;
    senderName: string;
    senderAvatar: string;
    isRead: boolean;
}

interface Participant {
    id?: Id<"users">;
    name: string;
    avatar: string;
}

interface ChatHeaderData {
    id: Id<"conversations">;
    type: "direct" | "group";
    name: string;
    avatar: string;
    participants: Participant[];
}

interface ChatAreaProps {
    chatId: Id<"conversations">;
    chatData: ChatHeaderData;
    onMobileMenuOpen: () => void;
}

export const ChatArea = ({ chatId, chatData, onMobileMenuOpen }: ChatAreaProps) => {
    const [inputValue, setInputValue] = useState("");
    const [detailMessage, setDetailMessage] = useState<Message | null>(null);

    // 1. PAGINATED QUERY
    // Backend returns [Newest, ..., Oldest].
    const { results, status, loadMore } = usePaginatedQuery(
        api.chats.getMessages,
        { conversationId: chatId },
        { initialNumItems: 20 }
    );

    // 2. DATA PREPARATION
    // We reverse the array to show [Oldest, ..., Newest] (Bottom of screen)
    // We use .slice() to create a copy before reversing because 'results' might be read-only.
    const messages = (results || []).slice().reverse();

    // Mutations & Queries
    const sendMessage = useMutation(api.chats.sendMessage);
    const currentUser = useQuery(api.users.viewer);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    // 3. SCROLL LOGIC
    // Scroll to bottom only on initial load or when a NEW message is sent (length increases)
    useEffect(() => {
        if (messages.length > 0 && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages.length, chatId]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const content = inputValue.trim();
        setInputValue("");

        // Reset Height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        try {
            await sendMessage({
                conversationId: chatId,
                content: content
            });
            // Scroll will happen automatically due to useEffect on messages.length
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
        }
    };

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        const target = e.target;
        target.style.height = "auto";
        target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
    };

    if (!currentUser) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col h-full w-full bg-background relative">
            {/* HEADER */}
            <div className="h-16 border-b flex items-center px-4 md:px-6 justify-between bg-background/80 backdrop-blur shrink-0 z-10">
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
                        <AvatarImage src={chatData.avatar} />
                        <AvatarFallback>{chatData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{chatData.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {chatData.type === "group"
                                ? `${chatData.participants.length} member`
                                : "Online"}
                        </p>
                    </div>
                </div>
            </div>

            {/* MESSAGES LIST */}
            {/* Note: We use ref on the viewport to handle scrolling if needed */}
            <ScrollArea className="h-[calc(100dvh-14.25rem)] px-4" ref={scrollViewportRef}>
                <div className="flex flex-col gap-4 pb-4 pt-4 min-h-full justify-end">

                    {/* LOAD MORE BUTTON (For Older Messages) */}
                    {status === "CanLoadMore" && (
                        <div className="flex justify-center py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadMore(20)}
                                className="text-xs text-muted-foreground"
                            >
                                <ArrowUp className="w-3 h-3 mr-2" /> Load Previous Messages
                            </Button>
                        </div>
                    )}

                    {status === "LoadingMore" && (
                        <div className="flex justify-center py-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {messages.length === 0 && status !== "LoadingFirstPage" ? (
                        <div className="text-center text-muted-foreground text-sm mt-10">
                            No messages yet. Send a wave! 👋
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderId === currentUser._id;

                            return (
                                <ContextMenu key={msg.id}>
                                    <ContextMenuTrigger>
                                        <div
                                            className={cn(
                                                "flex w-full gap-2 md:gap-3 max-w-[85%] md:max-w-[75%]",
                                                isMe ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                                            )}
                                        >
                                            <Avatar className="h-8 w-8 shrink-0 mt-0.5 border">
                                                <AvatarImage src={msg.senderAvatar} />
                                                <AvatarFallback className="text-[10px]">
                                                    {msg.senderName.substring(0,2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className={cn(
                                                "flex flex-col px-4 py-2 rounded-2xl text-sm shadow-sm",
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-foreground rounded-tl-none"
                                            )}>
                                                {chatData.type === "group" && !isMe && (
                                                    <span className="text-[10px] font-bold text-primary mb-1 opacity-80">
                                                        {msg.senderName}
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
                                            <Info className="w-4 h-4 mr-2" /> Details
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            );
                        })
                    )}
                    {/* Dummy div to scroll to bottom */}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* INPUT AREA */}
            <div className="p-4 border-t bg-background shrink-0 z-10">
                <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border focus-within:ring-1 focus-within:ring-ring transition-all">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Write a message..."
                        className="flex-1 w-full min-h-6 max-h-32 border-none shadow-none focus-visible:ring-0 resize-none bg-transparent px-2 py-1.5 wrap-break-word whitespace-pre-wrap"
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

            {/* DETAIL DIALOG */}
            <Dialog open={!!detailMessage} onOpenChange={(open) => !open && setDetailMessage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message Details</DialogTitle>
                        <DialogDescription>Message metadata.</DialogDescription>
                    </DialogHeader>
                    {detailMessage && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Avatar>
                                    <AvatarImage src={detailMessage.senderAvatar} />
                                    <AvatarFallback>{detailMessage.senderName.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">Sender</p>
                                    <p className="text-sm text-muted-foreground">{detailMessage.senderName}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">CONTENT</p>
                                <div className="p-3 border rounded-md text-sm bg-background">
                                    {detailMessage.content}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};