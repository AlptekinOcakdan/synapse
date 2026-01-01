"use client";

import { AcademyEvent } from "../../../types";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {BellRing, Calendar, Clock, PlayCircle, Radio} from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

interface AcademyEventCardProps {
    event: AcademyEvent;
}

export const AcademyEventCard = ({ event }: AcademyEventCardProps) => {

    // Tarih formatlama
    const formattedDate = new Date(event.date).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit"
    });

    const isLive = event.status === "live";
    const isEnded = event.status === "ended";

    // Katılımcı Mantığı
    const visibleParticipants = event.participants.slice(0, 1);
    const hiddenParticipants = event.participants.slice(1);
    const hasMoreParticipants = hiddenParticipants.length > 0;

    return (
        <Card className={`group overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-primary/50 rounded-t-md pt-0 ${isLive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}>

            {/* --- THUMBNAIL ALANI --- */}
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
                <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Platform Badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm border-white/10">
                        {event.platform}
                    </Badge>
                </div>

                {/* Durum Badge'leri */}
                <div className="absolute top-3 right-3">
                    {isLive ? (
                        <Badge variant="destructive" className="animate-pulse gap-1.5 px-3">
                            <Radio className="w-3 h-3" /> CANLI
                        </Badge>
                    ) : !isEnded ? (
                        <Badge className="bg-primary text-primary-foreground">
                            PLANLANDI
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            {event.duration}
                        </Badge>
                    )}
                </div>

                {/* Oynat İkonu */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                        <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                </div>
            </div>

            {/* --- İÇERİK ALANI (Flex ile düzenlendi) --- */}
            <div className="flex flex-col flex-1 p-4 gap-3">

                {/* 1. Başlık (Kayan Yazı Efekti) */}
                <div className="w-full overflow-hidden relative h-7">
                    {/* group-hover:animate-none ekleyerek hoverda durmasını sağlayabiliriz */}
                    <h3 className="font-bold text-lg leading-tight whitespace-nowrap absolute animate-marquee group-hover:text-primary transition-colors">
                        {event.title}
                        {/* Boşluk bırakıp tekrar yazıyoruz ki döngü hissi versin (CSS'e bağlı) */}
                        <span className="mx-8 opacity-0">|</span>
                        {event.title}
                    </h3>
                </div>

                {/* 2. Etiketler */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                    {event.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* 3. Açıklama (Scroll Area ile Sabit Yükseklik) */}
                <ScrollArea className="h-18 w-full pr-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {event.description}
                    </p>
                </ScrollArea>

                {/* 4. Katılımcılar (mt-auto ile en alta itildi) */}
                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        {/* Katılımcı Avatarları */}
                        <div className="flex -space-x-2">
                            {visibleParticipants.map((p) => (
                                <Avatar key={p.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background border border-border">
                                    <AvatarImage src={p.avatar} />
                                    <AvatarFallback className="text-[10px] bg-muted">{p.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            ))}

                            {/* Fazla Katılımcı Varsa (+X Badge ve HoverCard) */}
                            {hasMoreParticipants && (
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-background bg-muted text-[10px] font-bold text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
                                            +{hiddenParticipants.length}
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60 p-3">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Diğer Katılımcılar</h4>
                                            {hiddenParticipants.map(p => (
                                                <div key={p.id} className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={p.avatar} />
                                                        <AvatarFallback className="text-[9px]">{p.name.substring(0,2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs">{p.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            )}
                        </div>

                        {/* Katılımcı İsim Özeti (Sadece ilk kişi veya rol) */}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-medium truncate max-w-30">
                                {event.participants[0].name} {hasMoreParticipants || event.participants.length > 1 ? `ve diğerleri` : ''}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                {event.participants.length > 1 ? "Konuşmacılar" : event.participants[0].role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <CardFooter className="p-3 bg-muted/30 border-t flex flex-col gap-3 shrink-0">
                {/* Tarih Bilgisi */}
                <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                    </div>
                    {!isEnded && !isLive && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{event.duration}</span>
                        </div>
                    )}
                </div>

                {/* Aksiyon Butonu */}
                {isLive ? (
                    <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 shadow-md shadow-red-500/20 h-9"
                        onClick={() => window.open(event.url, "_blank")}
                    >
                        <Radio className="w-4 h-4 animate-pulse" /> Yayına Eriş
                    </Button>
                ) : isEnded ? (
                    <Button
                        variant="outline"
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors h-9"
                        onClick={() => window.open(event.url, "_blank")}
                    >
                        <PlayCircle className="w-4 h-4" /> Kaydı İzle
                    </Button>
                ) : (
                    <Button variant="secondary" className="w-full gap-2 opacity-80 h-9">
                        <BellRing className="w-4 h-4" /> Takip Et
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};