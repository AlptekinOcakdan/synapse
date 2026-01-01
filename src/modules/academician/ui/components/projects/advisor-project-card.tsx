"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, GraduationCap, School } from "lucide-react";
import {Project} from "@/modules/dashboard/types";

interface AdvisorProjectCardProps {
    project: Project;
    onBecomeAdvisor: (project: Project) => void;
}

export const AdvisorProjectCard = ({ project, onBecomeAdvisor }: AdvisorProjectCardProps) => {

    return (
        <Card className="flex flex-col h-full border-l-4 border-l-indigo-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
                <div className="flex flex-col justify-between items-start gap-2">
                    <div className="space-y-1">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200 bg-indigo-500/10 mb-2">
                            <School className="w-3 h-3 mr-1" /> Akademik Danışman Aranıyor
                        </Badge>
                        <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                        {project.competition}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="py-2 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {project.summary}
                </p>

                {/* Proje Sahibi Bilgisi */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={project.owner.avatar} />
                        <AvatarFallback>{project.owner.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold">{project.owner.name}</span>
                        <span className="text-[10px] text-muted-foreground">Proje Lideri</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4 px-6 border-t bg-muted/10 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(project.date).toLocaleDateString("tr-TR")}
                </div>

                <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    onClick={() => onBecomeAdvisor(project)}
                >
                    <GraduationCap className="w-4 h-4" /> Danışman Ol
                </Button>
            </CardFooter>
        </Card>
    );
};