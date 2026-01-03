"use client";

import { useState } from "react";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { ChatSidebar } from "@/modules/dashboard/ui/components/chats/chat-sidebar";
import { ChatArea } from "@/modules/dashboard/ui/components/chats/chat-area";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// --- CONVEX ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const ChatsView = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // URL'den Chat ID'yi al
    const currentChatId = searchParams.get("chatId") as Id<"conversations"> | null;

    // 1. Tüm Sohbetleri Çek (Sidebar İçin)
    const chats = useQuery(api.chats.listConversations);

    // 2. Seçili Sohbetin Detayını Çek (ChatArea Header İçin)
    // Eğer ID yoksa "skip" et.
    const selectedChat = useQuery(
        api.chats.getChat,
        currentChatId ? { conversationId: currentChatId } : "skip"
    );

    const handleSelectChat = (chatId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("chatId", chatId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setIsMobileMenuOpen(false);
    };

    // Loading State
    if (chats === undefined) {
        return (
            <div className="h-[calc(100dvh-5rem)] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100dvh-5rem)] w-full flex overflow-hidden bg-background">
            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block w-80 lg:w-96 shrink-0 h-full">
                <ChatSidebar
                    chats={chats || []} // Convex verisi
                    selectedChatId={currentChatId}
                    onSelectChat={(chat) => handleSelectChat(chat.id)}
                />
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">
                {/* MOBIL HEADER */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetContent side="left" className="p-0 w-80">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Sohbet Listesi</SheetTitle>
                                <SheetDescription>Sohbet geçmişi</SheetDescription>
                            </SheetHeader>
                            <ChatSidebar
                                chats={chats || []}
                                selectedChatId={currentChatId}
                                onSelectChat={(chat) => handleSelectChat(chat.id)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                {currentChatId && selectedChat ? (
                    <ChatArea
                        key={currentChatId} // ID değişince resetle
                        chatData={selectedChat} // Convex'ten gelen header verisi
                        chatId={currentChatId}  // Mesajları çekmek için ID
                        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
                        <div className="h-24 w-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                            <Menu className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Sohbet Seçilmedi</h3>
                        <p className="max-w-sm text-sm">
                            Mesajlaşmaya başlamak için sol taraftan bir kişi veya grup seçin.
                        </p>
                        <Button
                            className="mt-6 md:hidden"
                            variant="outline"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            Sohbetleri Aç
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};