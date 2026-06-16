"use client";

import { UserProfile } from "@/modules/dashboard/types";
import { Check, Edit2, Layers, Plus, Trophy, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Competition } from "@/modules/auth/types";
import { toast } from "sonner";
// --- CONVEX IMPORTS ---
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BadgesCard } from "./badges-card";
import { ProjectStatsCards } from "@/modules/dashboard/ui/components/shared/project-stats-cards";

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
            <ProjectStatsCards
                completedCount={user.completedProjectCount}
                activeCount={user.activeProjectCount}
            />
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