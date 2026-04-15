import {ChatsView} from "@/modules/dashboard/ui/views/chats-view";
import {Suspense} from "react";

const Page =  () => {
    return (
        <Suspense fallback={<p>Sohbetler yukleniyor...</p>}>
            <ChatsView />
        </Suspense>
    );
};

export default Page;