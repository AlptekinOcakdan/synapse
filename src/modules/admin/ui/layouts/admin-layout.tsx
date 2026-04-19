import {LayoutProps} from "@/lib/utils";
import {AdminNavigationBar} from "@/modules/admin/ui/components/admin-navigation-bar";

export const AdminLayout = ({children}: LayoutProps) => {
    return (
        <main className="min-h-dvh grid grid-rows-[4rem_1fr]">
            <AdminNavigationBar/>
            <div className="p-6">
                {children}
            </div>
        </main>
    );
};
