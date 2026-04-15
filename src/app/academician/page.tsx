import {AdvisorProjectsView} from "@/modules/academician/ui/views/advisor-projects-view";
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
            <AdvisorProjectsView userId={session.userId as Id<"users">}/>
        </>
    );
};

export default Page;