import {LayoutProps} from "@/lib/utils";
import {DashboardLayout} from "@/modules/dashboard/ui/layouts/dashboard-layout";

const Layout = ({children}: LayoutProps) => {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
};

export default Layout;