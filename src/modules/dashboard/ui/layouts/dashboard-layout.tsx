import { LayoutProps } from "@/lib/utils";
import { DashboardNavigationBar } from "@/modules/dashboard/ui/components/dashboard-navigation-bar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DashboardLayout = ({ children }: LayoutProps) => {
    return (
        <main className="min-h-dvh grid grid-rows-[5rem_1fr]">
            <DashboardNavigationBar />
            <div className="w-full h-full">
                <ScrollArea className="h-full w-full">
                    <div className="h-full w-full max-w-full">
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
};