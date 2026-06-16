import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export const EmptyState = ({ title, description, icon, action, className }: EmptyStateProps) => (
    <div className={cn(
        "text-center py-20 text-muted-foreground bg-muted/10 rounded-xl border border-dashed space-y-4",
        className
    )}>
        {icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                {icon}
            </div>
        )}
        <div className="space-y-1">
            <p className="text-base font-medium text-foreground">{title}</p>
            {description && (
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
            )}
        </div>
        {action && <div>{action}</div>}
    </div>
);
