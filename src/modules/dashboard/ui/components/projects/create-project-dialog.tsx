"use client";

import { useState } from "react";
import { useTagInput } from "@/lib/hooks/use-tag-input";
import { Plus, Trash2, Users, GraduationCap, Target, Save, X, Award, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProjectFormData, ProjectStatus } from "../../../types";
import { LayoutProps } from "@/lib/utils";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {Id} from "@/convex/_generated/dataModel";
import { Checkbox } from "@/components/ui/checkbox";

const INITIAL_FORM_DATA: ProjectFormData = {
    title: "",
    competition: "",
    summary: "",
    status: "recruiting",
    positions: [],
    needsAdvisor: true,
    platform: ""
};

interface CreateProjectDialogProps extends LayoutProps{
    userId: Id<"users">,
    isAdvisor?: boolean
}

export const CreateProjectDialog = ({ children, userId, isAdvisor }: CreateProjectDialogProps) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createProject = useMutation(api.projects.createProject);
    const departments = useQuery(api.departments.get);

    const [tempDept, setTempDept] = useState<string>("");
    const [tempCount, setTempCount] = useState<string>("1");

    const {
        tags: tempSkills,
        setTags: setTempSkills,
        inputValue: tempSkillInput,
        setInputValue: setTempSkillInput,
        addTag: handleAddTempSkill,
        removeTag: handleRemoveTempSkill,
    } = useTagInput();

    const handleAddPosition = () => {
        if (!tempDept || !tempCount) return;
        const newPosition = {
            id: crypto.randomUUID(),
            department: tempDept,
            count: parseInt(tempCount),
            competencies: tempSkills
        };
        setFormData(prev => ({
            ...prev,
            positions: [...prev.positions, newPosition]
        }));
        setTempDept("");
        setTempCount("1");
        setTempSkills([]);
        setTempSkillInput("");
    };

    const handleRemovePosition = (id: string) => {
        setFormData(prev => ({
            ...prev,
            positions: prev.positions.filter(p => p.id !== id)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.summary) {
            toast.error("Lütfen zorunlu alanları doldurun.");
            return;
        }

        setIsSubmitting(true);

        try {
            await createProject({
                title: formData.title,
                summary: formData.summary,
                competition: formData.competition || "",
                status: formData.status,
                positions: formData.positions.map(p => ({
                    id: p.id,
                    department: p.department,
                    count: p.count,
                    competencies: p.competencies
                })),
                userId: userId,
                advisorId: isAdvisor ? userId : undefined,
                needsAdvisor: formData.needsAdvisor,
                platform: formData.platform
            });

            toast.success("Proje başarıyla oluşturuldu! 🎉");

            setFormData(INITIAL_FORM_DATA);
            setOpen(false);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Bir hata oluştu.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDeptLabel = (val: string) => {
        return (departments || []).find(d => d.value === val)?.label || val;
    };

    const statusOptions: { value: ProjectStatus, label: string }[] = [
        { value: "recruiting", label: "Ekip Kuruluyor" },
        { value: "ongoing", label: "Devam Ediyor" },
        { value: "completed", label: "Tamamlandı" },
        { value: "cancelled", label: "İptal Edildi" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[85dvh] h-auto flex flex-col p-0 gap-0 font-sans">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle>Yeni Proje Oluştur</DialogTitle>
                    <DialogDescription>
                        Ekibini kurmak ve yarışmalara katılmak için projenin detaylarını gir.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(85dvh-10rem)] w-full">
                    <div className="p-6 space-y-6">

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    Proje Adı <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    placeholder="Örn: Otonom İHA Sistemi"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary" /> Hedef Yarışma
                                    </Label>
                                    <Input
                                        placeholder="Örn: Teknofest 2024"
                                        value={formData.competition}
                                        onChange={(e) => setFormData({...formData, competition: e.target.value})}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Proje Durumu</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: ProjectStatus) => setFormData({...formData, status: value})}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Durum seç..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Proje Özeti <span className="text-destructive">*</span></Label>
                                <Textarea
                                    placeholder="Projenin amacı, çözdüğü sorun ve kullanılacak teknolojilerden kısaca bahset..."
                                    className="min-h-25 resize-none"
                                    value={formData.summary}
                                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="needsAdvisor"
                                    checked={formData.needsAdvisor}
                                    onCheckedChange={(checked) => setFormData({...formData, needsAdvisor: !!checked})}
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="needsAdvisor"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Proje için akademik danışman mentörlüğü gerekiyor.
                                </label>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" /> Aranan Ekip Arkadaşları
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Hangi bölümden kaç kişiye ihtiyacın olduğunu ve beklediğin yetenekleri ekle.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="space-y-2 w-full sm:flex-1">
                                        <Label className="text-xs font-semibold">Bölüm / Alan</Label>
                                        <Select value={tempDept} onValueChange={setTempDept} disabled={isSubmitting}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Bölüm seç..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(departments || []).map((dept, index) => (
                                                    <SelectItem key={index} value={dept.value}>
                                                        {dept.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 w-full sm:w-24">
                                        <Label className="text-xs font-semibold">Kişi Sayısı</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="bg-background"
                                            value={tempCount}
                                            onChange={(e) => setTempCount(e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold flex items-center gap-1">
                                        <Award className="w-3 h-3 text-primary" /> Beklenen Yetenekler
                                    </Label>
                                    <div className="bg-background border rounded-md p-2 flex flex-col gap-2 focus-within:ring-1 focus-within:ring-ring">
                                        {tempSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {tempSkills.map((skill) => (
                                                    <Badge key={skill} variant="secondary" className="px-1.5 py-0.5 text-xs font-normal gap-1 h-6">
                                                        {skill}
                                                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveTempSkill(skill)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                className="border-none shadow-none focus-visible:ring-0 px-0 h-7 text-sm min-w-30"
                                                placeholder="Yetenek yaz ve Enter'a bas..."
                                                value={tempSkillInput}
                                                onChange={(e) => setTempSkillInput(e.target.value)}
                                                onKeyDown={handleAddTempSkill}
                                                disabled={isSubmitting}
                                            />
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleAddTempSkill()} disabled={!tempSkillInput.trim() || isSubmitting}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Button type="button" variant="secondary" onClick={handleAddPosition} disabled={!tempDept || isSubmitting} className="w-full sm:w-auto self-end mt-1">
                                    <Plus className="w-4 h-4 mr-2" /> Pozisyonu Ekle
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.positions.length > 0 ? (
                                    formData.positions.map((pos) => (
                                        <div key={pos.id} className="p-3 rounded-md border bg-card relative group">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold">{getDeptLabel(pos.department)}</p>
                                                        <p className="text-xs text-muted-foreground font-medium">{pos.count} Kişi Aranıyor</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleRemovePosition(pos.id)} disabled={isSubmitting}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {pos.competencies.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pl-9">
                                                    {pos.competencies.map((skill, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-muted-foreground bg-secondary/20">{skill}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-sm text-muted-foreground italic bg-muted/10 rounded-lg border border-dashed">
                                        Henüz bir pozisyon eklemedin.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background shrink-0 flex justify-end gap-2 rounded-b-lg">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={!formData.title || !formData.summary || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Oluşturuluyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> Projeyi Oluştur
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};