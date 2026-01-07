import {DashboardView} from "@/modules/dashboard/ui/views/dashboard-view";
import {Suspense} from "react";
import {getSession} from "@/lib/session";
import {redirect} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";

const Page = async () => {
    const session = await getSession();

    // 2. Oturum yoksa Login'e at
    if (!session || !session.userId) {
        redirect("/");
    }
    return (
        <Suspense>
            <DashboardView userId={session.userId as Id<"users">}/>
        </Suspense>
    );
};

export default Page;