"use client";

import { useState, useMemo } from "react"; // useMemo eklendi
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { ChatSession } from "@/modules/dashboard/types";
import { ChatSidebar } from "@/modules/dashboard/ui/components/chats/chat-sidebar";
import { MOCK_CHATS } from "@/lib/data";
import { ChatArea } from "@/modules/dashboard/ui/components/chats/chat-area";
// GÜNCELLEME 1: Next.js navigation kancalarını ekledik
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const ChatsView = () => {
    // GÜNCELLEME 2: URL yönetimi için hook'lar
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // GÜNCELLEME 3: selectedChat'i state yerine URL'den türetiyoruz (Derived State)
    // URL'de ?chatId=123 varsa, o ID'yi alıp MOCK_CHATS içinden buluyoruz.
    const currentChatId = searchParams.get("chatId");

    const selectedChat = useMemo(() => {
        if (!currentChatId) return null;
        return MOCK_CHATS.find((c) => c.id === currentChatId) || null;
    }, [currentChatId]);

    // GÜNCELLEME 4: Sohbet seçildiğinde sadece URL'i değiştiriyoruz
    const handleSelectChat = (chat: ChatSession) => {
        const params = new URLSearchParams(searchParams);
        params.set("chatId", chat.id);

        // replace yerine push kullanırsak tarayıcı 'geri' tuşu ile önceki sohbete dönebilir
        // scroll: false ile sayfanın en tepeye zıplamasını engelleriz
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        setIsMobileMenuOpen(false);
    };

    return (
        <div className="h-[calc(100dvh-5rem)] w-full flex overflow-hidden bg-background">

            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block w-80 lg:w-96 shrink-0 h-full">
                <ChatSidebar
                    chats={MOCK_CHATS}
                    selectedChatId={selectedChat?.id || null}
                    onSelectChat={handleSelectChat}
                />
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">

                {/* MOBIL HEADER - Sadece chat seçiliyken mobilde geri butonu veya menü göstermek için opsiyonel mantık eklenebilir */}
                <div className="md:hidden absolute top-4 left-4 z-50">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetContent side="left" className="p-0 w-80">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Sohbet Listesi</SheetTitle>
                                <SheetDescription>
                                    Geçmiş sohbetlerinizi buradan görüntüleyebilir ve seçebilirsiniz.
                                </SheetDescription>
                            </SheetHeader>

                            <ChatSidebar
                                chats={MOCK_CHATS}
                                selectedChatId={selectedChat?.id || null}
                                onSelectChat={handleSelectChat}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                {selectedChat ? (
                    <ChatArea
                        key={selectedChat.id} // Key değiştiğinde bileşeni resetler (önemli)
                        chat={selectedChat}
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