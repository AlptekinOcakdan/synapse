"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/modules/dashboard/types";
import { Github, Linkedin, Link as LinkIcon, Plus, Twitter, Upload, X, Loader2 } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import Image from "next/image";
import { ProfilePhotoDialog } from "@/modules/auth/ui/components/profile-photo-modal";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// --- CONVEX IMPORTS ---
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

interface ProfileEditModalProps {
    children: React.ReactNode;
    user: UserProfile;
}

export const ProfileEditModal = ({ children, user }: ProfileEditModalProps) => {
    const [open, setOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [editableUser, setEditableUser] = useState(user);
    const [skillInput, setSkillInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Mutation
    const updateProfile = useMutation(api.users.updateProfile);

    // Yetenek Ekleme
    const handleAddSkill = () => {
        if (skillInput.trim()) {
            const newSkill = skillInput.trim();
            if (!editableUser.skills.includes(newSkill)) {
                setEditableUser({ ...editableUser, skills: [...editableUser.skills, newSkill] });
            }
            setSkillInput("");
        }
    };

    const addSkillOnEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setEditableUser({
            ...editableUser,
            skills: editableUser.skills.filter((skill) => skill !== skillToRemove),
        });
    };

    // Kaydetme Fonksiyonu
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                // DÜZELTME BURADA: userId'yi ekliyoruz
                // user.id string geliyor olabilir, Convex ID tipine cast ediyoruz
                userId: user.id as Id<"users">,

                name: editableUser.name,
                title: editableUser.title,
                bio: editableUser.bio,
                avatar: editableUser.avatar,
                skills: editableUser.skills,
                socialLinks: {
                    github: editableUser.socialLinks?.github || "",
                    linkedin: editableUser.socialLinks?.linkedin || "",
                    twitter: editableUser.socialLinks?.twitter || "",
                    personalWebsite: editableUser.socialLinks?.personalWebsite || ""
                }
            });
            toast.success("Profil başarıyla güncellendi!");
            setOpen(false);
        } catch (error) {
            console.error(error);
            // Hata mesajını kullanıcıya göster
            const msg = error instanceof Error ? error.message : "Hata oluştu";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-2xl p-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle>Profili Düzenle</DialogTitle>
                        <DialogDescription>
                            Bilgilerinizi güncelleyin. Kaydet butonuna tıkladığınızda değişiklikler uygulanacaktır.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[65vh]">
                        <div className="grid gap-6 p-6 pt-0">
                            {/* Avatar Düzenleme */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Avatar</Label>
                                <div className="col-span-3">
                                    <div
                                        className="w-16 h-16 rounded-full bg-secondary border border-dashed border-muted-foreground/50 flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-all overflow-hidden relative group"
                                        onClick={() => setIsPhotoModalOpen(true)}
                                    >
                                        {editableUser.avatar ? (
                                            <Image src={editableUser.avatar} alt="Profil" width={64} height={64} className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Temel Bilgiler */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">İsim</Label>
                                <Input
                                    id="name"
                                    value={editableUser.name}
                                    onChange={(e) => setEditableUser({...editableUser, name: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Unvan</Label>
                                <Input
                                    id="title"
                                    value={editableUser.title}
                                    onChange={(e) => setEditableUser({...editableUser, title: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            {/* Email genelde değiştirilemez (Auth provider'a bağlıdır), disabled yapabiliriz */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">E-posta</Label>
                                <Input id="email" type="email" value={user.email} disabled className="col-span-3 opacity-70" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="bio" className="text-right pt-2">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={editableUser.bio}
                                    onChange={(e) => setEditableUser({...editableUser, bio: e.target.value})}
                                    className="col-span-3"
                                    rows={4}
                                />
                            </div>

                            {/* Sosyal Medya */}
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Sosyal Bağlantılar</Label>
                                <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Github className="w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="github"
                                            placeholder="https://github.com/..."
                                            value={editableUser.socialLinks?.github || ""}
                                            onChange={(e) => setEditableUser({
                                                ...editableUser,
                                                socialLinks: { ...editableUser.socialLinks, github: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Linkedin className="w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="linkedin"
                                            placeholder="https://linkedin.com/in/..."
                                            value={editableUser.socialLinks?.linkedin || ""}
                                            onChange={(e) => setEditableUser({
                                                ...editableUser,
                                                socialLinks: { ...editableUser.socialLinks, linkedin: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Twitter className="w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="twitter"
                                            placeholder="https://twitter.com/..."
                                            value={editableUser.socialLinks?.twitter || ""}
                                            onChange={(e) => setEditableUser({
                                                ...editableUser,
                                                socialLinks: { ...editableUser.socialLinks, twitter: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                        <Input
                                            id="website"
                                            placeholder="https://websiteniz.com"
                                            value={editableUser.socialLinks?.personalWebsite || ""}
                                            onChange={(e) => setEditableUser({
                                                ...editableUser,
                                                socialLinks: { ...editableUser.socialLinks, personalWebsite: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Yetenekler */}
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="skills" className="text-right pt-2">
                                    Yetenekler
                                </Label>
                                <div className="col-span-3 bg-secondary/20 p-3 rounded-md border border-input min-h-20 focus-within:ring-1 focus-within:ring-ring transition-all">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <AnimatePresence>
                                            {editableUser.skills.map((skill) => (
                                                <motion.div key={skill} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                                                    <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 hover:bg-secondary/80 pointer-events-auto">
                                                        {skill}
                                                        <div className="ml-1 cursor-pointer" onClick={() => removeSkill(skill)}>
                                                            <X className="w-3 h-3 hover:text-destructive transition-colors" />
                                                        </div>
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto flex-1"
                                            placeholder="Yetenek ekle..."
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={addSkillOnEnter}
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-3 rounded-md"
                                            onClick={handleAddSkill}
                                            disabled={!skillInput.trim()}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-6 pt-4 border-t">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor...
                                </>
                            ) : (
                                "Değişiklikleri Kaydet"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ProfilePhotoDialog
                isOpen={isPhotoModalOpen}
                onClose={setIsPhotoModalOpen}
                currentImage={editableUser.avatar}
                onSave={(img) => setEditableUser({ ...editableUser, avatar: img || "" })}
            />
        </>
    );
};