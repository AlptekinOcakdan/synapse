import {LayoutProps} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ProfileNavigationBar} from "@/modules/profile/ui/components/profile-navigation-bar";

export const ProfileLayout = ({children}: LayoutProps) => {
    return (
        <main className="min-h-dvh grid grid-rows-[5rem_1fr]">
            <ProfileNavigationBar/>
            <div className="w-full h-full">
                <ScrollArea className="h-[calc(100dvh-5rem)] w-full">
                    <div className="h-full w-full">
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </main>
    );
};