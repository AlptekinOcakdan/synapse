import { BadgesView } from "@/modules/academician/ui/views/badges-view";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

const Page = async () => {
    const session = await getSession();

    if (!session || !session.userId) {
        redirect("/");
    }

    return <BadgesView userId={session.userId as Id<"users">} />;
};

export default Page;
