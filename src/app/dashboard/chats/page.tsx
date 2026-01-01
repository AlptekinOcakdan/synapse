import {ChatsView} from "@/modules/dashboard/ui/views/chats-view";
import {Suspense} from "react";

const Page = () => {
    return (
        <Suspense fallback={<p>Loading chats...</p>}>
            <ChatsView/>
        </Suspense>
    );
};

export default Page;