import {AcademicianMailsView} from "@/modules/academician/ui/views/academician-mails-view";
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
            <AcademicianMailsView userId={session.userId as Id<"users">}/>
        </Suspense>
    );
};

export default Page;