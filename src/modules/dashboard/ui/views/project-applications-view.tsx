"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApplicationCard } from "../components/projects/application-card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectApplicationsView = ({ projectId }: { projectId: string }) => {
    const project = useQuery(api.projects.getProject, { id: projectId as Id<"projects"> });
    const applications = useQuery(api.applications.getApplicationsForProject, { projectId: projectId as Id<"projects"> });

    if (project === undefined || applications === undefined) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-48 mb-8" />
                <Separator />
                <div className="grid gap-6 mt-8">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Proje Bulunamadı</h1>
                <p className="text-muted-foreground">Bu proje mevcut değil veya silinmiş olabilir.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/my-projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Projelerime Dön
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
                    <p className="text-muted-foreground">Projenize gelen başvuruları yönetin.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/my-projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Geri Dön
                    </Link>
                </Button>
            </div>
            <Separator />
            <div className="mt-8">
                {applications.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">Henüz Başvuru Yok</h3>
                        <p className="text-muted-foreground mt-2">Bu proje için henüz kimse başvurmadı.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((application) => (
                            <ApplicationCard key={application._id} application={application} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
