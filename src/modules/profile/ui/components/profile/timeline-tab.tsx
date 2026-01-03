"use client";

import { UserProfile } from "@/modules/dashboard/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, Check, Edit2, GripVertical, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Experience } from "@/modules/auth/types";
import { toast } from "sonner";

// --- CONVEX IMPORTS ---
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const TimelineTab = ({ user }: { user: UserProfile }) => {
    // --- CONVEX MUTATION ---
    const updateExp = useMutation(api.users.updateExperiences);

    // --- STATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [experiences, setExperiences] = useState<Experience[]>(user.experiences || []);

    // role opsiyonel tanımlanmış olabilir ama formda zorunlu tutuyoruz, bu yüzden string başlatıyoruz
    const [tempExp, setTempExp] = useState<{
        institution: string;
        duration: string;
        description: string;
        role: string;
    }>({ institution: "", duration: "", description: "", role: "" });

    // --- HANDLERS ---

    const addExperience = () => {
        if (!tempExp.institution || !tempExp.description || !tempExp.role) return;

        // Yeni deneyimi listenin başına ekliyoruz (Genelde en yeni en üstte olur)
        const newExperience: Experience = {
            ...tempExp,
            order: experiences.length + 1
        };

        // Yeni listeyi oluştur
        const newExperiences = [newExperience, ...experiences];

        // Order'ları yeniden düzenle (1, 2, 3...)
        const reordered = newExperiences.map((exp, idx) => ({
            ...exp,
            order: idx + 1
        }));

        setExperiences(reordered);
        setTempExp({ institution: "", duration: "", description: "", role: "" });
    };

    const removeExperience = (index: number) => {
        const newExp = experiences.filter((_, i) => i !== index);
        // Silme işleminden sonra order'ları düzelt
        const reorderedExp = newExp.map((exp, idx) => ({ ...exp, order: idx + 1 }));
        setExperiences(reorderedExp);
    };

    const handleReorder = (newOrder: Experience[]) => {
        // Sürükle bırak sonrası order'ları güncelle
        const reorderedExp = newOrder.map((exp, index) => ({ ...exp, order: index + 1 }));
        setExperiences(reorderedExp);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Role alanı undefined olamaz kontrolü (Type güvenliği için map)
            const safeExperiences = experiences.map(exp => ({
                ...exp,
                role: exp.role || "Pozisyon Belirtilmemiş"
            }));

            await updateExp({
                userId: user.id as Id<"users">,
                experiences: safeExperiences
            });

            toast.success("Deneyimler başarıyla güncellendi.");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Kaydetme sırasında bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setExperiences(user.experiences || []); // Değişiklikleri geri al
        setTempExp({ institution: "", duration: "", description: "", role: "" });
        setIsEditing(false);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Kariyer Geçmişi
                </CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        {/* Ekleme Formu */}
                        <div className="grid gap-3 p-4 border border-dashed rounded-lg bg-secondary/10">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    placeholder="Rol / Pozisyon *"
                                    className="flex-1"
                                    value={tempExp.role}
                                    onChange={(e) => setTempExp({ ...tempExp, role: e.target.value })}
                                />
                                <Input
                                    placeholder="Süre (örn: 2022-2023)"
                                    className="sm:w-1/3"
                                    value={tempExp.duration}
                                    onChange={(e) => setTempExp({ ...tempExp, duration: e.target.value })}
                                />
                            </div>
                            <Input
                                placeholder="Kurum Adı *"
                                value={tempExp.institution}
                                onChange={(e) => setTempExp({ ...tempExp, institution: e.target.value })}
                            />
                            <Textarea
                                placeholder="Açıklama *"
                                className="min-h-15 resize-none"
                                value={tempExp.description}
                                onChange={(e) => setTempExp({ ...tempExp, description: e.target.value })}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                onClick={addExperience}
                                disabled={!tempExp.institution || !tempExp.description || !tempExp.role}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Deneyim Ekle
                            </Button>
                        </div>

                        {/* Deneyim Listesi (Sıralanabilir) */}
                        <div className="space-y-2">
                            {experiences.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-4">Henüz eklenen deneyim yok.</p>
                            )}
                            <Reorder.Group axis="y" values={experiences} onReorder={handleReorder} className="space-y-2">
                                <AnimatePresence initial={false}>
                                    {experiences.map((exp) => (
                                        <Reorder.Item
                                            key={exp.order} // Order unique olmalı
                                            value={exp}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            whileDrag={{ scale: 1.02, zIndex: 50 }}
                                            className="relative"
                                        >
                                            <div className="bg-card border rounded-md relative overflow-hidden group cursor-default">
                                                <div className="p-4 pl-10">
                                                    <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-secondary/50 transition-colors" title="Sıralamak için sürükleyin">
                                                        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                                                    </div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-semibold text-sm">{exp.role}</h4>
                                                        {exp.duration && (
                                                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{exp.duration}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-primary/80 mb-1">{exp.institution}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{exp.description}</p>

                                                    {/* Silme Butonu */}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={() => {
                                                            // Index bul (Reorder yüzünden map indexi güvenilir olmayabilir)
                                                            const idx = experiences.findIndex(e => e === exp);
                                                            removeExperience(idx);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </AnimatePresence>
                            </Reorder.Group>
                        </div>

                        {/* Kaydet/İptal Butonları */}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>İptal</Button>
                            <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                Değişiklikleri Kaydet
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-muted ml-2 space-y-8 py-2">
                        {user.experiences && user.experiences.length > 0 ? (
                            user.experiences.map((exp, index) => (
                                <div key={index} className="ml-6 relative">
                                    <span className="absolute -left-7.75 top-1 h-4 w-4 rounded-full border-2 border-background bg-primary ring-4 ring-background" />
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                                        <h4 className="font-bold text-base">{exp.role}</h4>
                                        {exp.duration && (
                                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md w-fit mt-1 sm:mt-0 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {exp.duration}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-primary/80 mb-2">{exp.institution}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground ml-6 italic">Henüz bir deneyim eklenmemiş.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};