import {LayoutProps} from "@/lib/utils";
import {AcademicianLayout} from "@/modules/academician/ui/layouts/academician-layout";

const Layout = ({children}: LayoutProps) => {
    return (
        <AcademicianLayout>
            {children}
        </AcademicianLayout>
    );
};

export default Layout;