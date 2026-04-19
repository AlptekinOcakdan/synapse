import {LayoutProps} from "@/lib/utils";
import {AdminLayout} from "@/modules/admin/ui/layouts/admin-layout";

const Layout = ({children}: LayoutProps) => {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
};

export default Layout;