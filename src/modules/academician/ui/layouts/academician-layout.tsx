import {LayoutProps} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {AcademicianNavigationBar} from "@/modules/academician/ui/components/academician-navigation-bar";

export const AcademicianLayout = ({children}: LayoutProps) => {
    return (
        <main className="min-h-dvh grid grid-rows-[5rem_1fr]">
            <AcademicianNavigationBar/>
            <div className="w-full h-full">
                <ScrollArea className="h-[calc(100dvh-5rem)] w-full">
                    <div className="w-full h-full">
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
};