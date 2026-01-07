import {ChatsView} from "@/modules/dashboard/ui/views/chats-view";
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
        <Suspense fallback={<p>Loading chats...</p>}>
            <ChatsView userId={session.userId as Id<"users">}/>
        </Suspense>
    );
};

export default Page;