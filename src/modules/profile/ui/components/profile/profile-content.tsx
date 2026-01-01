"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/modules/dashboard/types";
import { OverviewTab } from "@/modules/profile/ui/components/profile/overview-tab";
import { ProjectsTab } from "@/modules/profile/ui/components/profile/projects-tab";
import { TimelineTab } from "@/modules/profile/ui/components/profile/timeline-tab";

interface ProfileContentProps {
    user: UserProfile;
}

export const ProfileContent = ({ user }: ProfileContentProps) => {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                    <TabsTrigger value="projects">Projelerim</TabsTrigger>
                    <TabsTrigger value="timeline">Deneyim</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <OverviewTab user={user} />
                </TabsContent>

                <TabsContent value="projects">
                    <ProjectsTab user={user} />
                </TabsContent>

                <TabsContent value="timeline">
                    <TimelineTab user={user} />
                </TabsContent>
            </Tabs>
        </div>
    );
};