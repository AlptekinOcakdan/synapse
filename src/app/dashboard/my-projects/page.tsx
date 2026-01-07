import {ProjectsView} from "@/modules/dashboard/ui/views/projects-view";
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
        <>
            <ProjectsView userId={session.userId as Id<"users">}/>
        </>
    );
};

export default Page;