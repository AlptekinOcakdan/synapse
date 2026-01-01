import {DashboardView} from "@/modules/dashboard/ui/views/dashboard-view";
import {Suspense} from "react";

const Page = () => {
    return (
        <Suspense>
            <DashboardView/>
        </Suspense>
    );
};

export default Page;