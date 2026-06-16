import { Briefcase, Trophy } from "lucide-react";

interface ProjectStatsCardsProps {
    completedCount: number;
    activeCount: number;
}

export const ProjectStatsCards = ({ completedCount, activeCount }: ProjectStatsCardsProps) => (
    <div className="grid grid-cols-2 gap-4">
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-muted/50 via-muted/20 to-transparent p-4 flex flex-col items-center justify-center text-center hover:border-border/80 transition-all duration-300">
            <div className="mb-2 p-2 rounded-full bg-background/50 border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-3xl font-black tracking-tight text-foreground z-10 mb-0.5">
                {completedCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 z-10">
                Tamamlanan Proje
            </span>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-foreground/5 blur-2xl group-hover:bg-foreground/10 transition-colors duration-500" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-primary/10 transition-all duration-300">
            <div className="mb-2 p-2 rounded-full bg-primary/10 border border-primary/20 shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-300 z-10">
                <Trophy className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-black tracking-tight text-primary z-10 mb-0.5">
                {activeCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80 z-10">
                Aktif Proje
            </span>
            <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
        </div>
    </div>
);
