"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Award, Briefcase, Check, ChevronsUpDown, GraduationCap, Loader2, Plus, Trash2, Trophy, Upload, User, X, GripVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignUpFormData, Experience, Competition } from "@/modules/auth/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ScrollArea} from "@/components/ui/scroll-area";
import Image from "next/image";
import {ProfilePhotoDialog} from "@/modules/auth/ui/components/profile-photo-modal";

const DEPARTMENTS = [
    { value: "bilgisayar-muh", label: "Bilgisayar Mühendisliği" },
    { value: "elektrik-elektronik", label: "Elektrik-Elektronik Mühendisliği" },
    { value: "makine", label: "Makine Mühendisliği" },
    { value: "endustri", label: "Endüstri Mühendisliği" },
    { value: "mimarlik", label: "Mimarlık" },
    { value: "tip", label: "Tıp Fakültesi" },
    { value: "hukuk", label: "Hukuk Fakültesi" },
    { value: "psikoloji", label: "Psikoloji" },
    { value: "isletme", label: "İşletme" },
    { value: "diger", label: "Diğer" },
];

interface CVBuilderSectionProps {
    data: SignUpFormData;
    updateData: (data: SignUpFormData) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const CVBuilderSection = ({ data, updateData, onSubmit, isLoading }: CVBuilderSectionProps) => {
    // --- Local States ---
    const [skillInput, setSkillInput] = useState("");
    const [openDepartment, setOpenDepartment] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // DEĞİŞİKLİK 3: Initial state'e 'order: 0' eklendi
    const [tempExp, setTempExp] = useState<Experience>({
        institution: "",
        duration: "",
        description: "",
        order: 0
    });

    const [tempComp, setTempComp] = useState<Competition>({
        name: "",
        rank: ""
    });

    // --- Helpers ---

    const addSkill = (e: KeyboardEvent) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!data.skills.includes(skillInput.trim())) {
                updateData({ ...data, skills: [...data.skills, skillInput.trim()] });
            }
            setSkillInput("");
        }
    };
    const removeSkill = (skill: string) => {
        updateData({ ...data, skills: data.skills.filter((s) => s !== skill) });
    };

    // DEĞİŞİKLİK 4: Deneyim Ekleme Mantığı Güncellendi
    const addExperience = () => {
        if (!tempExp.institution || !tempExp.description) return;

        // Yeni elemanın sırası = Mevcut uzunluk + 1
        const newOrder = (data.experiences?.length || 0) + 1;

        const newExperience = {
            ...tempExp,
            order: newOrder
        };

        updateData({ ...data, experiences: [...(data.experiences || []), newExperience] });

        // Formu sıfırla
        setTempExp({ institution: "", duration: "", description: "", order: 0 });
    };

    const handleExperienceKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addExperience();
        }
    };

    // DEĞİŞİKLİK 5: Deneyim Silme Mantığı Güncellendi (Sıralamayı onarmak için)
    const removeExperience = (index: number) => {
        const newExp = [...data.experiences];
        newExp.splice(index, 1);

        // Silme işleminden sonra order'ları 1'den başlayarak yeniden düzenle
        const reorderedExp = newExp.map((exp, idx) => ({
            ...exp,
            order: idx + 1
        }));

        updateData({ ...data, experiences: reorderedExp });
    };

    // DEĞİŞİKLİK 6: Sürükle-Bırak Sıralama Fonksiyonu
    const handleReorderExperiences = (newOrder: Experience[]) => {
        // Framer Motion bize yeni diziyi verir.
        // Ancak 'order' property'sini de güncellememiz gerekir (Backend için).
        const updatedExperiences = newOrder.map((exp, index) => ({
            ...exp,
            order: index + 1 // Dizideki yeni konumuna göre order'ı güncelle
        }));

        updateData({ ...data, experiences: updatedExperiences });
    };

    const addCompetition = () => {
        if (!tempComp.name) return;
        updateData({ ...data, competitions: [...data.competitions, tempComp] });
        setTempComp({ name: "", rank: "" });
    };
    const removeCompetition = (index: number) => {
        const newComp = [...data.competitions];
        newComp.splice(index, 1);
        updateData({ ...data, competitions: newComp });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* ... Header ve Fotoğraf Alanı (Aynı) ... */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Profilini Oluştur</h2>
                    <p className="text-muted-foreground text-sm">Seni daha iyi tanımamız için detayları doldur.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="w-16 h-16 rounded-full bg-secondary border border-dashed border-muted-foreground/50 flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-all overflow-hidden relative group"
                        onClick={() => setIsPhotoModalOpen(true)}
                    >
                        {data.profileImage ? (
                            <Image src={data.profileImage} alt="Profil" width={64} height={64} className="w-full h-full object-cover" />
                        ) : (
                            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                        {data.profileImage && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {data.profileImage ? "Değiştir" : "Fotoğraf"}
                    </span>
                </div>
            </div>

            <ProfilePhotoDialog
                isOpen={isPhotoModalOpen}
                onClose={setIsPhotoModalOpen}
                currentImage={data.profileImage}
                onSave={(img) => updateData({ ...data, profileImage: img })}
            />

            <Separator />

            <div className="grid gap-8">
                {/* 1. Biyografi & Bölüm (Aynı) */}
                <div className="space-y-4">
                    <div className="space-y-2 flex flex-col items-start">
                        <Label className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary" /> Bölümün
                        </Label>
                        <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={openDepartment} className="w-fit max-w-full justify-between font-normal">
                                    <span className="truncate mr-2">
                                        {data.department ? DEPARTMENTS.find((dept) => dept.value === data.department)?.label : "Bölümünü ara veya seç..."}
                                    </span>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                                <Command filter={(value, search) => value.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr")) ? 1 : 0}>
                                    <CommandInput placeholder="Bölüm ara..." />
                                    <CommandList className="overflow-hidden">
                                        <ScrollArea className="h-72">
                                            <CommandEmpty>Bölüm bulunamadı.</CommandEmpty>
                                            <CommandGroup>
                                                {DEPARTMENTS.map((dept) => (
                                                    <CommandItem
                                                        key={dept.value}
                                                        value={dept.label}
                                                        onSelect={() => {
                                                            updateData({ ...data, department: dept.value });
                                                            setOpenDepartment(false);
                                                        }}
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4", data.department === dept.value ? "opacity-100" : "opacity-0")} />
                                                        {dept.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </ScrollArea>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Hakkında (Bio)</Label>
                        <Textarea placeholder="Kendinden kısaca bahset..." className="min-h-20 resize-none" value={data.bio} onChange={(e) => updateData({...data, bio: e.target.value})} />
                    </div>
                </div>

                {/* 2. Yetenekler (Aynı) */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Yetenekler</Label>
                    <div className="bg-secondary/20 p-3 rounded-md border border-input min-h-20 focus-within:ring-1 focus-within:ring-ring transition-all">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <AnimatePresence>
                                {data.skills.map((skill) => (
                                    <motion.div key={skill} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                                        <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 hover:bg-secondary/80 pointer-events-auto">
                                            {skill}
                                            <div className="ml-1 cursor-pointer"><X className="w-3 h-3 hover:text-destructive transition-colors relative z-10" onClick={(e) => { e.stopPropagation(); removeSkill(skill); }} /></div>
                                        </Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <Input className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto" placeholder="Yetenek yaz ve Enter'a bas..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                    </div>
                </div>

                {/* 3. Deneyimler (SÜRÜKLE BIRAK GÜNCELLEMESİ) */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" /> Deneyimler
                    </Label>

                    {/* Ekleme Formu */}
                    <div className="grid gap-3 p-4 border border-dashed rounded-lg bg-secondary/10">
                        <div className="flex gap-3">
                            <Input placeholder="Kurum Adı" className="flex-1" value={tempExp.institution} onChange={(e) => setTempExp({...tempExp, institution: e.target.value})} onKeyDown={handleExperienceKeyDown} />
                            <Input placeholder="Süre" className="w-1/3" value={tempExp.duration} onChange={(e) => setTempExp({...tempExp, duration: e.target.value})} onKeyDown={handleExperienceKeyDown} />
                        </div>
                        <Textarea placeholder="Neler yaptın?" className="min-h-15 resize-none" value={tempExp.description} onChange={(e) => setTempExp({...tempExp, description: e.target.value})} onKeyDown={handleExperienceKeyDown} />
                        <Button type="button" variant="secondary" size="sm" className="w-full" onClick={addExperience} disabled={!tempExp.institution || !tempExp.description}>
                            <Plus className="w-4 h-4 mr-2" /> Deneyim Ekle
                        </Button>
                    </div>

                    {/* DEĞİŞİKLİK 7: Reorder.Group Kullanımı */}
                    <div className="space-y-2">
                        {/* Reorder.Group, normal bir div veya ul yerine kullanılır */}
                        <Reorder.Group
                            axis="y"
                            values={data.experiences || []}
                            onReorder={handleReorderExperiences}
                            className="space-y-2"
                        >
                            <AnimatePresence initial={false}>
                                {(data.experiences || []).map((exp) => (
                                    <Reorder.Item
                                        key={exp.institution + exp.duration} // Benzersiz bir key kullanmak önemli (ID yoksa birleşim kullanabiliriz)
                                        value={exp}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        whileDrag={{ scale: 1.02, zIndex: 50 }}
                                        className="relative"
                                    >
                                        <Card className="bg-card border-border relative overflow-hidden group cursor-default">
                                            <CardContent className="p-4 pl-10"> {/* Sol tarafta tutamaç için boşluk bıraktık (pl-10) */}

                                                {/* Sürükleme Tutamacı (Grip Handle) */}
                                                <div
                                                    className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-secondary/50 transition-colors"
                                                    title="Sıralamak için sürükleyin"
                                                >
                                                    <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                                                </div>

                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-semibold text-sm">{exp.institution}</h4>
                                                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                        {exp.duration}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {exp.description}
                                                </p>

                                                {/* Silme butonu (onMouseDown stopPropagation önemli, yoksa sürükleme ile çakışabilir) */}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={() => removeExperience(data.experiences.indexOf(exp))}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>

                        {(data.experiences?.length || 0) > 1 && (
                            <p className="text-[10px] text-muted-foreground text-center italic">
                                * Sıralamayı değiştirmek için deneyimleri sürükleyebilirsiniz.
                            </p>
                        )}
                    </div>
                </div>

                {/* 4. Yarışmalar (Aynı) */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Yarışmalar</Label>
                    <div className="flex gap-2">
                        <Input placeholder="Yarışma Adı" className="flex-1" value={tempComp.name} onChange={(e) => setTempComp({...tempComp, name: e.target.value})} />
                        <Input placeholder="Derece" className="w-1/4" value={tempComp.rank} onChange={(e) => setTempComp({...tempComp, rank: e.target.value})} />
                        <Button type="button" variant="outline" size="icon" onClick={addCompetition} disabled={!tempComp.name}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <AnimatePresence>
                            {(data.competitions || []).map((comp, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center justify-between p-3 rounded-md bg-secondary/20 border border-input text-sm">
                                    <div className="flex items-center gap-2"><Trophy className="w-3 h-3 text-yellow-500" /><span className="font-medium">{comp.name}</span>{comp.rank && <span className="text-muted-foreground">- {comp.rank}</span>}</div>
                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeCompetition(i)}><X className="w-3 h-3" /></Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <Button onClick={onSubmit} className="w-full font-bold" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Profili Tamamla & Başla"}
            </Button>
        </motion.div>
    );
};