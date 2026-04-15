"use client";

import { UserProfile } from "@/modules/dashboard/types";
import { Briefcase, Check, Edit2, Layers, Plus, Trophy, X, Loader2, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Competition } from "@/modules/auth/types";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// --- CONVEX IMPORTS ---
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type BadgeItem = {
    _id: Id<"badges">;
    title: string;
    description: string;
    issuedAt: string;
    issuer: { name: string; title: string; avatar: string };
};

const BadgesCard = ({ userId }: { userId: Id<"users"> }) => {
    const badges = useQuery(api.badges.getBadgesForUser, { userId });
    const [selected, setSelected] = useState<BadgeItem | null>(null);

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

    if (badges === undefined) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (badges.length === 0) return null;

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" /> Rozetler
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {badges.map((badge) => (
                            <motion.button
                                key={badge._id}
                                type="button"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelected(badge as BadgeItem)}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors w-24 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                                    <Award className="w-5 h-5 text-primary" />
                                </span>
                                <span className="text-[11px] font-medium leading-tight line-clamp-2 text-foreground">
                                    {badge.title}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                                <Award className="w-6 h-6 text-primary" />
                            </span>
                            <DialogTitle className="text-xl leading-snug">{selected?.title}</DialogTitle>
                        </div>
                        <DialogDescription asChild>
                            <div className="space-y-4 pt-1">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {selected?.description}
                                </p>
                                <div className="flex items-center gap-3 pt-2 border-t border-border">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selected?.issuer.avatar} />
                                        <AvatarFallback className="text-xs">
                                            {selected ? getInitials(selected.issuer.name) : ""}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">{selected?.issuer.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{selected?.issuer.title}</p>
                                    </div>
                                    <span className="ml-auto text-[11px] text-muted-foreground">
                                        {selected ? formatDate(selected.issuedAt) : ""}
                                    </span>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

const StatsCards = ({ user }: { user: UserProfile }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-muted/50 via-muted/20 to-transparent p-4 flex flex-col items-center justify-center text-center hover:border-border/80 transition-all duration-300">
            <div className="mb-2 p-2 rounded-full bg-background/50 border border-border/50 shadow-sm z-10">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-3xl font-black tracking-tight text-foreground z-10 mb-0.5">{user.completedProjectCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 z-10">Tamamlanan Proje</span>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex flex-col items-center justify-center text-center hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300">
            <div className="mb-2 p-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-sm z-10">
                <Trophy className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-3xl font-black tracking-tight text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] z-10 mb-0.5">{user.activeProjectCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/80 z-10">Aktif Proje</span>
        </div>
    </div>
);

export const OverviewTab = ({ user }: { user: UserProfile }) => {
    // --- CONVEX MUTATION ---
    const updateOverview = useMutation(api.users.updateOverview);

    // --- STATE ---
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isSavingBio, setIsSavingBio] = useState(false);
    const [bioContent, setBioContent] = useState(user.bio);

    const [isEditingCompetitions, setIsEditingCompetitions] = useState(false);
    const [isSavingComp, setIsSavingComp] = useState(false);
    const [competitions, setCompetitions] = useState<Competition[]>(user.competitions || []);
    const [tempComp, setTempComp] = useState<Competition>({ name: "", rank: "", date: "" });

    // --- BIO HANDLERS ---
    const handleSaveBio = async () => {
        setIsSavingBio(true);
        try {
            await updateOverview({
                userId: user.id as Id<"users">,
                bio: bioContent
            });
            toast.success("Hakkında yazısı güncellendi.");
            setIsEditingBio(false);
        } catch {
            toast.error("Güncelleme başarısız.");
        } finally {
            setIsSavingBio(false);
        }
    };

    // --- COMPETITION HANDLERS ---
    const addCompetition = () => {
        if (!tempComp.name) return;
        setCompetitions([...competitions, tempComp]);
        setTempComp({ name: "", rank: "", date: "" });
    };

    const removeCompetition = (index: number) => {
        const newComp = [...competitions];
        newComp.splice(index, 1);
        setCompetitions(newComp);
    };

    const handleSaveCompetitions = async () => {
        setIsSavingComp(true);
        try {
            await updateOverview({
                userId: user.id as Id<"users">,
                competitions: competitions
            });
            toast.success("Başarılar güncellendi.");
            setIsEditingCompetitions(false);
        } catch {
            toast.error("Güncelleme başarısız.");
        } finally {
            setIsSavingComp(false);
        }
    };

    return (
        <div className="space-y-6">
            <StatsCards user={user} />
            <BadgesCard userId={user.id as Id<"users">} />

            {/* --- HAKKINDA KARTI --- */}
            <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" /> Hakkında
                    </CardTitle>
                    {!isEditingBio && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditingBio(true)}>
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isEditingBio ? (
                        <div className="space-y-3">
                            <Textarea
                                value={bioContent}
                                onChange={(e) => setBioContent(e.target.value)}
                                className="min-h-32"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(false)} disabled={isSavingBio}>İptal</Button>
                                <Button size="sm" onClick={handleSaveBio} disabled={isSavingBio}>
                                    {isSavingBio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                    Kaydet
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {user.bio || "Henüz bir biyografi eklenmemiş."}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* --- BAŞARILAR KARTI --- */}
            <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" /> Başarılar & Ödüller
                    </CardTitle>
                    {!isEditingCompetitions && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditingCompetitions(true)}>
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isEditingCompetitions ? (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input placeholder="Yarışma Adı" className="flex-1" value={tempComp.name} onChange={(e) => setTempComp({...tempComp, name: e.target.value})} />
                                <Input placeholder="Derece" className="sm:w-1/4" value={tempComp.rank} onChange={(e) => setTempComp({...tempComp, rank: e.target.value})} />
                                <Input placeholder="Tarih" className="sm:w-1/5" value={tempComp.date} onChange={(e) => setTempComp({...tempComp, date: e.target.value})} />
                                <Button type="button" variant="outline" size="icon" onClick={addCompetition} disabled={!tempComp.name}><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <AnimatePresence>
                                    {competitions.map((comp, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center justify-between p-3 rounded-md bg-secondary/20 border border-input text-sm">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Trophy className="w-3 h-3 text-yellow-500 shrink-0" />
                                                <span className="font-medium">{comp.name}</span>
                                                {comp.rank && <span className="text-muted-foreground">- {comp.rank}</span>}
                                                {comp.date && <span className="text-muted-foreground text-xs">({comp.date})</span>}
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeCompetition(i)}><X className="w-3 h-3" /></Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingCompetitions(false)} disabled={isSavingComp}>İptal</Button>
                                <Button size="sm" onClick={handleSaveCompetitions} disabled={isSavingComp}>
                                    {isSavingComp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                    Değişiklikleri Kaydet
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user.competitions && user.competitions.length > 0 ? (
                                user.competitions.map((comp, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                                            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{comp.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold text-primary">{comp.rank}</p>
                                                {comp.date && <span className="text-[10px] text-muted-foreground">• {comp.date}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground col-span-2 text-center py-4 italic">
                                    Henüz başarı veya ödül eklenmemiş.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};