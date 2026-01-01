"use client";

import { UserProfile } from "@/modules/dashboard/types";
import { Briefcase, Check, Edit2, Layers, Plus, Trophy, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {Competition} from "@/modules/auth/types";

const StatsCards = ({ user }: { user: UserProfile }) => (
    <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-muted/50 via-muted/20 to-transparent p-4 flex flex-col items-center justify-center text-center hover:border-border/80 transition-all duration-300">
            <div className="mb-2 p-2 rounded-full bg-background/50 border border-border/50 shadow-sm z-10">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-3xl font-black tracking-tight text-foreground z-10 mb-0.5">{user.projectCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 z-10">Tamamlanan Proje</span>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex flex-col items-center justify-center text-center hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300">
            <div className="mb-2 p-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-sm z-10">
                <Trophy className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-3xl font-black tracking-tight text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] z-10 mb-0.5">{user.top3Count}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400/80 z-10">Aktif Proje</span>
        </div>
    </div>
);

export const OverviewTab = ({ user }: { user: UserProfile }) => {
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioContent, setBioContent] = useState(user.bio);

    const [isEditingCompetitions, setIsEditingCompetitions] = useState(false);
    const [competitions, setCompetitions] = useState<Competition[]>(user.competitions || []);
    const [tempComp, setTempComp] = useState<Competition>({ name: "", rank: "", date: "" });

    const handleSaveBio = () => {
        // user.bio = bioContent; // Mock veriyi güncelle
        setIsEditingBio(false);
    };

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

    const handleSaveCompetitions = () => {
        // user.competitions = competitions; // Mock veriyi güncelle
        setIsEditingCompetitions(false);
    };

    return (
        <div className="space-y-6">
            <StatsCards user={user} />
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
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(false)}>İptal</Button>
                                <Button size="sm" onClick={handleSaveBio}>
                                    <Check className="w-4 h-4 mr-2" /> Kaydet
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground leading-relaxed">
                            {user.bio}
                        </p>
                    )}
                </CardContent>
            </Card>
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
                                <Input placeholder="Tarih (örn: 2024)" className="sm:w-1/5" value={tempComp.date} onChange={(e) => setTempComp({...tempComp, date: e.target.value})} />
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
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingCompetitions(false)}>İptal</Button>
                                <Button size="sm" onClick={handleSaveCompetitions}>
                                    <Check className="w-4 h-4 mr-2" /> Değişiklikleri Kaydet
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user.competitions?.map((comp, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{comp.name}</p>
                                        <p className="text-xs font-semibold text-primary">{comp.rank}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

