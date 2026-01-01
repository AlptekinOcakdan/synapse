import {Badge} from "@/components/ui/badge";

export const ProjectStatusBadge = ({ status }: { status: string }) => {
    const styles = {
        recruiting: "border-green-500/30 text-green-600 bg-green-500/10",
        ongoing: "border-blue-500/30 text-blue-600 bg-blue-500/10",
        completed: "border-gray-500/30 text-gray-600 bg-gray-500/10",
    };

    const labels = {
        recruiting: "Alım Var",
        ongoing: "Aktif",
        completed: "Tamamlandı",
    };

    const key = status as keyof typeof styles;

    return (
        <Badge variant="outline" className={`${styles[key] || ""} whitespace-nowrap text-[10px] px-2 h-5`}>
            {labels[key] || status}
        </Badge>
    );
};