"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Award, User, Loader2, CheckCircle2, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BadgesViewProps {
    userId: Id<"users">;
}

interface Student {
    id: Id<"users">;
    name: string;
    email: string;
    avatar: string;
    department: string;
    title: string;
}

export const BadgesView = ({ userId }: BadgesViewProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const students = useQuery(api.badges.searchStudents, { searchQuery });
    const awardBadge = useMutation(api.badges.awardBadge);

    const issuedBadges = useQuery(api.badges.getBadgesForUser,
        selectedStudent ? { userId: selectedStudent.id } : "skip"
    );

    const showDropdown = searchQuery.trim().length > 0 && !selectedStudent;

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setSearchQuery("");
    };

    const handleClearStudent = () => {
        setSelectedStudent(null);
        setSearchQuery("");
    };

    const handleSubmit = async () => {
        if (!selectedStudent || !title.trim() || !description.trim()) return;
        setIsSubmitting(true);
        try {
            await awardBadge({
                issuerId: userId,
                recipientId: selectedStudent.id,
                title: title.trim(),
                description: description.trim(),
            });
            toast.success(`"${title}" rozeti ${selectedStudent.name}'a verildi.`);
            setTitle("");
            setDescription("");
            setSelectedStudent(null);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Bir hata oluştu.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

    return (
        <div className="max-w-3xl mx-auto space-y-8 px-4 py-8">
            {/* Başlık */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Rozet Ver
                </h1>
                <p className="text-muted-foreground mt-2">
                    Öğrencilerin başarılarını ve katkılarını rozetlerle ödüllendirin.
                </p>
            </div>

            <Separator />

            {/* Form Kartı */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Rozet Bilgileri
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Öğrenci Seçimi */}
                    <div className="space-y-2">
                        <Label>Öğrenci</Label>
                        {selectedStudent ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/40 bg-primary/5">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={selectedStudent.avatar} />
                                    <AvatarFallback className="text-xs">{getInitials(selectedStudent.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{selectedStudent.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{selectedStudent.department}</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                                    onClick={handleClearStudent}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="İsim veya e-posta ile öğrenci ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            className="absolute z-20 w-full mt-1 rounded-lg border border-border bg-popover shadow-lg overflow-hidden"
                                        >
                                            {students === undefined ? (
                                                <div className="flex items-center justify-center py-6">
                                                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                                </div>
                                            ) : students.length === 0 ? (
                                                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                                                    <User className="w-5 h-5" />
                                                    <p className="text-sm">Öğrenci bulunamadı</p>
                                                </div>
                                            ) : (
                                                <ul className="py-1">
                                                    {students.map((student) => (
                                                        <li key={student.id}>
                                                            <button
                                                                type="button"
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left"
                                                                onClick={() => handleSelectStudent(student as Student)}
                                                            >
                                                                <Avatar className="h-8 w-8 shrink-0">
                                                                    <AvatarImage src={student.avatar} />
                                                                    <AvatarFallback className="text-xs">{getInitials(student.name)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium truncate">{student.name}</p>
                                                                    <p className="text-xs text-muted-foreground truncate">{student.department}</p>
                                                                </div>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Rozet Başlığı */}
                    <div className="space-y-2">
                        <Label htmlFor="badge-title">Rozet Adı</Label>
                        <Input
                            id="badge-title"
                            placeholder="ör. Mükemmel Takım Oyuncusu"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={80}
                        />
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="badge-desc">Açıklama</Label>
                        <Textarea
                            id="badge-desc"
                            placeholder="Bu rozeti neden verdiğinizi kısaca açıklayın..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
                    </div>

                    {/* Gönder Butonu */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedStudent || !title.trim() || !description.trim() || isSubmitting}
                            className="gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            Rozet Ver
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Seçili öğrencinin mevcut rozetleri */}
            {selectedStudent && (
                <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">
                        {selectedStudent.name} adlı öğrencinin mevcut rozetleri
                    </p>
                    {issuedBadges === undefined ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : issuedBadges.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic py-2">
                            Henüz rozet kazanılmamış.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {issuedBadges.map((b) => (
                                <Badge key={b._id} variant="secondary" className="gap-1.5 py-1 px-2.5">
                                    <Award className="w-3 h-3 text-primary" />
                                    {b.title}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
