import { UserProfile } from "@/modules/dashboard/types";
import { MOCK_PROJECTS } from "@/lib/data";
import { ProjectCard } from "@/modules/dashboard/ui/components/projects/project-card";

export const ProjectsTab = ({ user }: { user: UserProfile }) => {
    // Sadece bu kullanıcıya ait projeleri filtrele (Mock olduğu için id kontrolü yapmıyoruz, örnek 3 tane alıyoruz)
    const userProjects = MOCK_PROJECTS.slice(0, 3);

    return (
        <div className="space-y-4">
            {userProjects.map((project) => (
                <ProjectCard key={project.id} project={project} currentUserId={user.id} />
            ))}
            {userProjects.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">Henüz proje bulunmuyor.</div>
            )}
        </div>
    );
};
