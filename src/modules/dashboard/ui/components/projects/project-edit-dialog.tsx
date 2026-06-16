"use client";

import { useState } from "react";
import { useTagInput } from "@/lib/hooks/use-tag-input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, UserMinus, Loader2, Target, Plus, Trash2, Users, GraduationCap, Award, X } from "lucide-react";
import { LayoutProps } from "@/lib/utils";
import { Project, ProjectPosition, ProjectStatus } from "@/modules/dashboard/types";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface ProjectEditDialogProps extends LayoutProps {
    project: Project;
    userId: Id<"users">;
}

export const ProjectEditDialog = ({ project, children, userId }: ProjectEditDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState(project.title);
    const [summary, setSummary] = useState(project.summary);
    const [competition, setCompetition] = useState(project.competition);
    const [status, setStatus] = useState<ProjectStatus>(project.status);
    const [needsAdvisor, setNeedsAdvisor] = useState(project.needsAdvisor);
    const [participants, setParticipants] = useState(project.participants);
    const [positions, setPositions] = useState<ProjectPosition[]>(project.positions || []);

    // Temp state for adding new positions
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

    const updateProject = useMutation(api.projects.updateProject);
    const removeMember = useMutation(api.projectMembers.removeMember);
    const updateMemberRole = useMutation(api.projectMembers.updateMemberRole);
    const departments = useQuery(api.departments.get);

    const handleRemoveParticipant = async (memberId: Id<"users">) => {
        try {
            await removeMember({ projectId: project.id, memberId, userId });
            setParticipants(participants.filter(p => p.id !== memberId));
            toast.success("Üye projeden çıkarıldı.");
        } catch {
            toast.error("Üye projeden çıkarılırken bir hata oluştu.");
        }
    };

    const handleRoleChange = async (memberId: Id<"users">, newRole: string) => {
        try {
            await updateMemberRole({ projectId: project.id, memberId, newRole, userId });
            setParticipants(prev => prev.map(p => p.id === memberId ? { ...p, role: newRole } : p));
            toast.success("Üyenin rolü güncellendi.");
        } catch {
            toast.error("Rol güncellenirken bir hata oluştu.");
        }
    };

    const handleAddPosition = () => {
        if (!tempDept || !tempCount) return;
        const newPosition: ProjectPosition = {
            id: crypto.randomUUID(),
            department: tempDept,
            count: parseInt(tempCount),
            competencies: tempSkills,
            filled: 0, // Yeni eklenen pozisyonun dolu sayısı 0'dır
        };
        setPositions(prev => [...prev, newPosition]);
        setTempDept("");
        setTempCount("1");
        setTempSkills([]);
        setTempSkillInput("");
    };

    const handleRemovePosition = (id: string) => {
        setPositions(prev => prev.filter(p => p.id !== id));
    };

    const getDeptLabel = (val: string) => {
        return (departments || []).find(d => d.value === val)?.label || val;
    };

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            await updateProject({
                userId,
                projectId: project.id,
                title,
                summary,
                competition,
                status,
                needsAdvisor,
                positions: positions.map(p => ({
                    ...p,
                    competencies: p.competencies ?? p.skills ?? [],
                })),
            });
            toast.success("Proje başarıyla güncellendi.");
            setOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Proje güncellenirken bir hata oluştu.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
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

            <DialogContent className="w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[90dvh] sm:max-h-[85dvh] h-auto flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2 shrink-0">
                    <DialogTitle>Projeyi Düzenle</DialogTitle>
                    <DialogDescription>
                        Proje detaylarını ve ekip arkadaşlarını buradan yönetebilirsin.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(85dvh-10rem)] w-full">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Proje Başlığı</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary" /> Hedef Yarışma
                                    </Label>
                                    <Input value={competition} onChange={(e) => setCompetition(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Proje Durumu</Label>
                                    <Select value={status} onValueChange={(value: ProjectStatus) => setStatus(value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Proje Özeti</Label>
                                <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-25" />
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="needsAdvisorEdit" checked={needsAdvisor} onCheckedChange={(checked) => setNeedsAdvisor(!!checked)} />
                                <label htmlFor="needsAdvisorEdit" className="text-sm font-medium leading-none">
                                    Proje için akademik danışman mentörlüğü gerekiyor.
                                </label>
                            </div>
                        </div>

                        <div className="h-px bg-border my-4" />

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
                                                {(departments || []).map((dept) => (
                                                    <SelectItem key={dept.value} value={dept.value}>
                                                        {dept.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 w-full sm:w-24">
                                        <Label className="text-xs font-semibold">Kişi Sayısı</Label>
                                        <Input type="number" min="1" className="bg-background" value={tempCount} onChange={(e) => setTempCount(e.target.value)} disabled={isSubmitting} />
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
                                                    <Badge key={skill} variant="turquoise" className="px-1.5 py-0.5 text-xs font-normal gap-1 h-6">
                                                        {skill}
                                                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveTempSkill(skill)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2 items-center">
                                            <Input className="border-none shadow-none focus-visible:ring-0 px-0 h-7 text-sm min-w-[6rem] sm:min-w-[7.5rem]" placeholder="Yetenek yaz ve Enter'a bas..." value={tempSkillInput} onChange={(e) => setTempSkillInput(e.target.value)} onKeyDown={handleAddTempSkill} disabled={isSubmitting} />
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
                                {positions.map((pos) => (
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
                                        {(pos.competencies ?? pos.skills ?? []).length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pl-9">
                                                {(pos.competencies ?? pos.skills ?? []).map((skill, idx) => (
                                                    <Badge key={idx} variant="turquoise" className="text-[10px] px-1.5 py-0 h-5 text-muted-foreground bg-secondary/20">{skill}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {positions.length === 0 && (
                                    <div className="text-center py-8 text-sm text-muted-foreground italic bg-muted/10 rounded-lg border border-dashed">
                                        Henüz bir pozisyon eklenmemiş.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-px bg-border my-4" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-base font-semibold">Mevcut Katılımcılar</Label>
                                <span className="text-xs text-muted-foreground">{participants.length} Kişi</span>
                            </div>

                            <div className="space-y-3">
                                {participants.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {project.owner.id !== user.id && (
                                                <>
                                                    <Select defaultValue={user.role || "Üye"} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                                                        <SelectTrigger className="w-30 h-8 text-xs bg-background">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Üye">Üye</SelectItem>
                                                            <SelectItem value="Yazılım">Yazılım</SelectItem>
                                                            <SelectItem value="Donanım">Donanım</SelectItem>
                                                            <SelectItem value="Tasarım">Tasarım</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveParticipant(user.id)}>
                                                        <UserMinus className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                            {project.owner.id === user.id && (
                                                <span className="text-xs font-semibold text-primary px-2">Proje Sahibi</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {participants.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">Henüz katılımcı yok.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background shrink-0 flex justify-end gap-2 rounded-b-lg">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isSubmitting}>İptal</Button>
                    </DialogClose>
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};