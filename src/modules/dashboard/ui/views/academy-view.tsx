"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademyEventCard } from "../components/academy/academy-event-card";
import { MOCK_ACADEMY_EVENTS } from "@/lib/data";
import { LayoutGrid, ListVideo } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const AcademyView = () => {

    // --- MANTIK ---

    // 1. Planlananlar: Canlı veya Gelecek
    const plannedEvents = MOCK_ACADEMY_EVENTS.filter(
        (e) => e.status === "live" || e.status === "upcoming"
    ).sort((a, b) => {
        // Önce "live" olanlar en başa
        if (a.status === "live" && b.status !== "live") return -1;
        if (a.status !== "live" && b.status === "live") return 1;

        // Sonra tarihe göre ARTAN (En yakın tarih en üstte)
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // 2. Tamamlananlar: Geçmiş
    const completedEvents = MOCK_ACADEMY_EVENTS.filter(
        (e) => e.status === "ended"
    ).sort((a, b) => {
        // Tarihe göre AZALAN (En yeni biten en üstte)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });


    return (
        <div className="space-y-8 max-w-full px-4 py-8">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-indigo-500 bg-clip-text text-transparent w-fit">
                    Synapse Akademi
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                    Sektör profesyonelleri ile gerçekleştirdiğimiz canlı eğitimler, atölyeler ve geçmiş yayın kayıtlarına buradan ulaşabilirsiniz.
                </p>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="planned" className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="grid w-full max-w-100 grid-cols-2">
                        <TabsTrigger value="planned" className="gap-2">
                            <LayoutGrid className="w-4 h-4" /> Planlanan Yayınlar
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="gap-2">
                            <ListVideo className="w-4 h-4" /> Tamamlananlar
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* --- TAB 1: PLANLANANLAR --- */}
                <TabsContent value="planned" className="mt-0">
                    {plannedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {plannedEvents.map((event) => (
                                <AcademyEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                            <p className="text-muted-foreground">Şu an planlanmış bir yayın bulunmamaktadır.</p>
                        </div>
                    )}
                </TabsContent>

                {/* --- TAB 2: TAMAMLANANLAR --- */}
                <TabsContent value="completed" className="mt-0">
                    {completedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {completedEvents.map((event) => (
                                <AcademyEventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                            <p className="text-muted-foreground">Henüz tamamlanmış bir yayın bulunmamaktadır.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};