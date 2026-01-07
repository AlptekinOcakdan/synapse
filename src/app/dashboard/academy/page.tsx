import {AcademyView} from "@/modules/dashboard/ui/views/academy-view";
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
            <AcademyView userId={session.userId as Id<"users">}/>
        </>
    );
};

export default Page;