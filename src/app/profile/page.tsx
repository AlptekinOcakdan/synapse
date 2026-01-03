import {ProfileView} from "@/modules/profile/ui/views/profile-view";
import {getSession} from "@/lib/session";
import {redirect} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";

const Page = async () => {
    // 1. Sunucu tarafında cookie'yi çöz
    const session = await getSession();

    // 2. Oturum yoksa Login'e at
    if (!session || !session.userId) {
        redirect("/");
    }

    // 3. User ID'yi Client Component'e gönder
    // Not: Session'dan gelen string ID'yi Convex ID tipine cast ediyoruz
    return <ProfileView userId={session.userId as Id<"users">} />;
};

export default Page;