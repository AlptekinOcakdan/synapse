import { ProjectApplicationsView } from "@/modules/dashboard/ui/views/project-applications-view";

interface ProjectApplicationsViewProps {
    params: Promise<{
        projectId: string;
    }>
}

const ProjectApplicationsPage =async ({ params }: ProjectApplicationsViewProps) => {
    const {projectId} = await params;
    return <ProjectApplicationsView projectId={projectId} />;
};

export default ProjectApplicationsPage;
