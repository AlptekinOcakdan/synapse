import {ProfileLayout} from "@/modules/profile/ui/layouts/profile-layout";
import {LayoutProps} from "@/lib/utils";

const Layout = ({children}:LayoutProps) => {
    return (
        <ProfileLayout>
            {children}
        </ProfileLayout>
    );
};

export default Layout;