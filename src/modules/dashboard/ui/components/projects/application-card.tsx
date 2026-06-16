"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, User, X } from "lucide-react";
import { ProfileDetailsDialog } from "../profiles/profile-details-dialog";
// Importları kontrol et (yolun doğru olduğundan emin ol)
import type {Project, UserProfile} from "@/modules/dashboard/types";
import { Experience, Competition } from "@/modules/auth/types";
import { getInitials } from "@/lib/utils";

export type ApplicationWithUser = Doc<"applications"> & { user: Doc<"users"> };

interface ApplicationCardProps {
    application: ApplicationWithUser;
    project: Project;
}

export const ApplicationCard = ({ application, project }: ApplicationCardProps) => {
    const router = useRouter();
    const { userId } = useSession();

    const approveApplication = useMutation(api.projectMembers.approveApplication);
    const rejectApplication = useMutation(api.applications.rejectApplication);
    const createOrGetConversation = useMutation(api.chats.getOrCreateConversation);

    const applicant = application.user;

    // --- DÖNÜŞTÜRME İŞLEMİ BURADA ---
    // Doc<"users"> tipindeki 'applicant' verisini UserProfile formatına çeviriyoruz.
    const userProfile: UserProfile = {
        id: applicant._id,
        name: `${applicant.firstName} ${applicant.lastName}`, // İsimleri birleştir
        avatar: applicant.avatar || "",
        department: applicant.department,
        title: applicant.title,
        city: applicant.city,
        role: applicant.role,
        email: applicant.email,
        bio: applicant.bio,
        socialLinks: applicant.socialLinks,
        competencies: applicant.competencies ?? [],
        isAvailable: applicant.isAvailable,
        // Şemada olmayan ama Interface'de zorunlu olan alanlara varsayılan değer atıyoruz:
        completedProjectCount: 0,
        activeProjectCount: 0,
        // Tiplerin tam uyuşması için casting yapıyoruz (gerekirse map ile dönüştürülebilir)
        experiences: applicant.experiences as unknown as Experience[],
        competitions: applicant.competitions as unknown as Competition[],
        certificates: applicant.certificates,
        // Eğer UserProfile academicData içeriyorsa ekle, içermiyorsa bu satırı sil:
        // academicData: applicant.academicData
    };

    const handleApprove = async () => {
        const currentMembersCount = project.participants.length;
        if (currentMembersCount >= project.participantsNeeded) {
            toast.warning("Proje zaten dolu!", {
                description: "Maksimum katılımcı sayısına ulaşıldı. Yeni başvuru onaylayamazsınız.",
            });
            return;
        }

        toast.promise(approveApplication({ applicationId: application._id }), {
            loading: "Başvuru onaylanıyor...",
            success: "Başvuru onaylandı! Kullanıcı projeye eklendi.",
            error: "Onaylama sırasında bir hata oluştu.",
        });
    };

    const handleReject = async () => {
        toast.promise(rejectApplication({ applicationId: application._id, userId: userId as Id<"users"> }), {
            loading: "Başvuru reddediliyor...",
            success: "Başvuru reddedildi.",
            error: "Reddetme sırasında bir hata oluştu.",
        });
    };

    const handleContact = async () => {
        if (!userId) return;
        try {
            const conversationId = await createOrGetConversation({
                userId: userId as Id<"users">,
                otherUserId: applicant._id as Id<"users">,
            });
            router.push(`/dashboard/chats?chatId=${conversationId}`);
        } catch {
            toast.error("Sohbet başlatılırken bir hata oluştu.");
        }
    };

    return (
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={applicant.avatar} />
                        <AvatarFallback>
                            {getInitials(`${applicant.firstName} ${applicant.lastName}`)}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h4 className="font-bold text-lg">
                            {applicant.firstName} {applicant.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{applicant.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {applicant.competencies?.slice(0, 3).map((skill: string) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                    {/* Hazırladığımız userProfile objesini buraya veriyoruz */}
                    <ProfileDetailsDialog
                        profile={userProfile}
                    >
                        <Button variant="outline" size="icon">
                            <User className="h-4 w-4" />
                        </Button>
                    </ProfileDetailsDialog>

                    <Button variant="outline" size="icon" onClick={handleContact}>
                        <MessageSquare className="h-4 w-4" />
                    </Button>

                    {application.status === "pending" && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/80"
                                onClick={handleReject}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-success hover:text-success/80"
                                onClick={handleApprove}
                            >
                                <Check className="h-5 w-5" />
                            </Button>
                        </>
                    )}

                    {application.status === "accepted" && (
                        <Badge className="bg-success/10 text-success">Onaylandı</Badge>
                    )}
                    {application.status === "rejected" && (
                        <Badge variant="destructive">Reddedildi</Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};